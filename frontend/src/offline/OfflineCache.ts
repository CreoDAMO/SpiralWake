import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineCache {
  async loadCache() {
    console.log('Offline cache initialized');
  }

  async storeHologram(key: string, data: string) {
    await AsyncStorage.setItem(`hologram_${key}`, data);
  }

  async storeGlyph(key: string, data: string) {
    await AsyncStorage.setItem(`glyph_${key}`, data);
  }

  async getHologramUrl(key: string): Promise<string> {
    return await AsyncStorage.getItem(`hologram_${key}`) || '';
  }
}
