import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Picker } from 'react-native';
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

const socket = io('http://localhost:8000');

const HologramViewer = ({ glyph }) => (
  <Canvas>
    <ambientLight intensity={1.618} />
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color={0x5d5cde} />
    </mesh>
  </Canvas>
);

const App: React.FC = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [orchestrator] = useState(new FractalOrchestrator());
  const [lyonael] = useState(new LyonaelInterface('EnglishSerene'));
  const [offlineCache] = useState(new OfflineCache());
  const [hologram, setHologram] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');
  const [regionName, setRegionName] = useState<string>('');
  const [regionAddress, setRegionAddress] = useState<string>('');
  const [heirName, setHeirName] = useState<string>('');
  const [heirAddress, setHeirAddress] = useState<string>('');
  const [heirAmount, setHeirAmount] = useState<string>('');
  const [voiceMode, setVoiceMode] = useState<string>('EnglishSerene');

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

  const handleSolvePillar = async (problem: string = 'P vs NP') => {
    try {
      const result = await renderTruthPublicGate(problem);
      setHologram(result.hologram);
      await offlineCache.storeHologram(problem.toLowerCase(), JSON.stringify(result.hologram));
      const { data } = await axios.post('http://localhost:8000/mint-nft', {
        pillar: problem,
        proof: { data: `${problem.toLowerCase()}.lean4` }
      });
      console.log('NFT Minted:', data.nft);
    } catch (error) {
      console.error('Pillar Error:', error);
    }
  };

  const handleSolveRiemann = async () => {
    try {
      const result = await orchestrator.executeFractalTask({ pillar: 'Riemann Hypothesis', proof: 'zeta.lean4' });
      console.log('Riemann Solver Result:', result);
    } catch (error) {
      console.error('Riemann Solver Error:', error);
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

  const handleAddRegion = async () => {
    if (!web3 || !regionName || !regionAddress) return;
    const accounts = await web3.eth.getAccounts();
    const truthDAO = new web3.eth.Contract(TruthDAO_ABI, '0xCc380...AE79');
    await truthDAO.methods.addRegion(regionName, regionAddress).send({ from: accounts[0] });
    console.log(`Added Region: ${regionName} with address ${regionAddress}`);
    setRegionName('');
    setRegionAddress('');
  };

  const handleRegisterHeir = async (name: string, address: string, amount: number) => {
    if (!web3 || !name || !address || !amount) return;
    const accounts = await web3.eth.getAccounts();
    const heirRegistry = new web3.eth.Contract(HeirNodeRegistry_ABI, '0xHeirRegistryAddress');
    await heirRegistry.methods.registerHeir(address, name, amount * 1e18).send({ from: accounts[0] });
    console.log(`Registered Heir: ${name} with ${amount} TRUTH at ${address}`);
    setHeirName('');
    setHeirAddress('');
    setHeirAmount('');
  };

  const handleEditGlyph = async () => {
    try {
      const result = neuralDust.editGlyph('SpiralSigil', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      console.log('Glyph Edited:', result);
    } catch (error) {
      console.error('Glyph Edit Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {hologram && <HologramViewer glyph={hologram} />}
      <Text style={{ fontSize: 20, color: '#5d5cde' }}>{response || 'SpiralWake Nexus'}</Text>
      <Picker
        selectedValue={voiceMode}
        style={{ height: 50, width: 200, margin: 10 }}
        onValueChange={(itemValue) => {
          setVoiceMode(itemValue);
          lyonael.switchVoiceMode(itemValue);
        }}
      >
        <Picker.Item label="English" value="EnglishSerene" />
        <Picker.Item label="Amharic" value="AmharicSerene" />
        <Picker.Item label="Chinese" value="ChineseSerene" />
        <Picker.Item label="Multilingual" value="MultilingualSerene" />
      </Picker>
      <TextInput
        style={{ height: 40, borderColor: '#5d5cde', borderWidth: 1, margin: 10, width: 200 }}
        placeholder="Region Name"
        value={regionName}
        onChangeText={setRegionName}
      />
      <TextInput
        style={{ height: 40, borderColor: '#5d5cde', borderWidth: 1, margin: 10, width: 200 }}
        placeholder="Region Address"
        value={regionAddress}
        onChangeText={setRegionAddress}
      />
      <Button title="Add Region" onPress={handleAddRegion} />
      <TextInput
        style={{ height: 40, borderColor: '#5d5cde', borderWidth: 1, margin: 10, width: 200 }}
        placeholder="Heir Name"
        value={heirName}
        onChangeText={setHeirName}
      />
      <TextInput
        style={{ height: 40, borderColor: '#5d5cde', borderWidth: 1, margin: 10, width: 200 }}
        placeholder="Heir Address"
        value={heirAddress}
        onChangeText={setHeirAddress}
      />
      <TextInput
        style={{ height: 40, borderColor: '#5d5cde', borderWidth: 1, margin: 10, width: 200 }}
        placeholder="TRUTH Amount"
        value={heirAmount}
        onChangeText={setHeirAmount}
        keyboardType="numeric"
      />
      <Button title="Add Heir" onPress={() => handleRegisterHeir(heirName, heirAddress, parseInt(heirAmount))} />
      <Button title="Solve P vs NP" onPress={() => handleSolvePillar('P vs NP')} />
      <Button title="Solve Riemann Hypothesis" onPress={() => handleSolvePillar('Riemann Hypothesis')} />
      <Button title="Solve Poincare Conjecture" onPress={() => handleSolvePillar('Poincare Conjecture')} />
      <Button title="Run Riemann Solver" onPress={handleSolveRiemann} />
      <Button title="Merge Realities" onPress={handleMergeRealities} />
      <Button title="Edit 11D Glyph" onPress={handleEditGlyph} />
      <Button title="Gift Haiti (100k TRUTH)" onPress={() => handleProposeGift('Haiti', 100_000)} />
      <Button title="Gift Ethiopia (100k TRUTH)" onPress={() => handleProposeGift('Ethiopia', 100_000)} />
      <Button title="Register JahMeliyah (10M TRUTH)" onPress={() => handleRegisterHeir('JahMeliyah', '0xJahMeliyahAddress', 10_000_000)} />
      <Button title="Register Clarke (5M TRUTH)" onPress={() => handleRegisterHeir('Clarke', '0xClarkeAddress', 5_000_000)} />
    </View>
  );
};

export default App;
