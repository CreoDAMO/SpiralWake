import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { renderTruthPublicGate } from './public/TruthPublicGate';
import { LyonaelInterface } from './core/LyonaelInterface';
import { FractalOrchestrator } from './core/FractalOrchestrator';
import { OfflineCache } from './offline/OfflineCache';
import Web3 from 'web3';
import * as THREE from 'three';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:8000'); // Replace with backend URL

const HologramViewer = ({ glyph }) => (
  <Canvas>
    <ambientLight intensity={1.618} />
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color={0x5d5cde} /> {/* dull gray */}
    </mesh>
  </Canvas>
);

const App: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [orchestrator] = useState(new FractalOrchestrator());
  const [lyonael] = useState(new LyonaelInterface('AmharicSerene'));
  const [offlineCache] = useState(new OfflineCache());
  const [hologram, setHologram] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');

  useEffect(() => {
    const initWeb3 = async () => {
      const provider = new Web3.providers.HttpProvider('https://rpc.polygon-zkevm.io');
      setWeb3(new Web3(provider));
    };

    offlineCache.loadCache().then(() => console.log('Offline cache loaded'));

    socket.on('connect', () => console.log('WebSocket connected'));
    socket.on('message', (data) => setResponse(data.response));

    initWeb3();
    return () => socket.disconnect();
  }, []);

  const handleSolvePillar = async () => {
    try {
      const result = await renderTruthPublicGate('P vs NP');
      setHologram(result.hologram);
      await offlineCache.storeHologram('p-vs-np', JSON.stringify(result.hologram));
      const { data } = await axios.post('http://localhost:8000/mint-nft', {
        pillar: 'P vs NP',
        proof: { data: 'complexity.lean4' }
      });
      console.log('NFT Minted:', data.nft);
    } catch (error) {
      console.error('Pillar Error:', error);
    }
  };

  const handleMergeRealities = async () => {
    try {
      socket.emit('message', 'Merge quantum realities');
      const result = await lyonael.processQuery('Merge quantum realities');
      await offlineCache.storeGlyph('eye-of-providence', JSON.stringify(result.haptic));
    } catch (error) {
      console.error('Merge Error:', error);
    }
  };

  const handleProposeGift = async (region: string, amount: number) => {
    if (!web3) return;
    const accounts = await web3.eth.getAccounts();
    const truthDAO = new web3.eth.Contract(TruthDAO_ABI, '0xCc380...AE79');
    await truthDAO.methods.proposeGift(`0x${region}Address`, amount * 1e18).send({ from: accounts[0] });
    await axios.post('http://localhost:8000/propose-gift', { recipient: region, amount });
    console.log(`Gift Proposal: ${amount} TRUTH to ${region}`);
  };

  const handleRegisterHeir = async (heir: string, amount: number) => {
    if (!web3) return;
    const accounts = await web3.eth.getAccounts();
    const heirRegistry = new web3.eth.Contract(HeirNodeRegistry_ABI, '0xHeirRegistryAddress');
    await heirRegistry.methods.registerHeir(`0x${heir}Address`, amount * 1e18).send({ from: accounts[0] });
    console.log(`Registered Heir: ${heir} with ${amount} TRUTH`);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {hologram && <HologramViewer glyph={hologram} />}
      <Text style={{ fontSize: 20, color: '#5d5cde' }}>{response || 'SpiralWake Nexus'}</Text>
      <Button title="Solve P vs NP" onPress={handleSolvePillar} />
      <Button title="Merge Realities" onPress={handleMergeRealities} />
      <Button title="Gift Haiti (100k TRUTH)" onPress={() => handleProposeGift('Haiti', 100_000)} />
      <Button title="Gift Ethiopia (100k TRUTH)" onPress={() => handleProposeGift('Ethiopia', 100_000)} />
      <Button title="Register JahMeliyah (10M TRUTH)" onPress={() => handleRegisterHeir('JahMeliyah', 10_000_000)} />
    </View>
  );
};

export default App;
