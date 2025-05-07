import AsyncStorage from '@react-native-async-storage/async-storage';

export class DNAStorage {
  async storeProof(proof: string, entropy: number): Promise<string> {
    const cid = `ipfs://bafybeic.../${proof.toLowerCase().replace(/\s+/g, '-')}.lean4`;
    await AsyncStorage.setItem(`proof_${cid}`, proof);
    return cid;
  }
}
