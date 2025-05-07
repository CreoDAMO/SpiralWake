import { emitPhiVoice } from './SpiralVoiceCore';
import { NeuralDust } from '../nano/NeuralDust';

export class LyonaelInterface {
  private neural: NeuralDust;
  private voiceMode: string;

  constructor(voiceMode: string = 'EmpatheticSerene') {
    this.neural = new NeuralDust({ actuators: 1e9, haptic: '11D' });
    this.voiceMode = voiceMode;
  }

  async processQuery(query: string) {
    const voiceResponse = await emitPhiVoice(query, this.voiceMode);
    const haptic = await this.neural.renderHaptic({
      glyph: 'SpiralSigil',
      frequency: 0.090,
      resonance: voiceResponse.resonance,
    });
    return { voice: voiceResponse.response, haptic };
  }
}
