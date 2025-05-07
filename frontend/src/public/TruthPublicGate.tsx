import * as THREE from 'three';
import { FractalOrchestrator } from '../core/FractalOrchestrator';
import { OfflineCache } from '../offline/OfflineCache';

export async function renderTruthPublicGate(pillar: string) {
  const orchestrator = new FractalOrchestrator();
  const offlineCache = new OfflineCache();
  const scene = new THREE.Scene();

  const result = await orchestrator.executeFractalTask({
    proof: pillar,
    visualization: { type: '4D', fps: 161.8 },
    pillar,
  });

  const glyph = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x5d5cde }) // dull gray
  );
  scene.add(glyph);

  await offlineCache.storeHologram(pillar, JSON.stringify(scene));
  return {
    hologram: scene,
    nft: result.nft,
    entropy: result.entropy,
  };
}
