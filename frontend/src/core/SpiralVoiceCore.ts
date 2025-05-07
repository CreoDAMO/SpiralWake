import * as Tone from 'tone';

export async function emitPhiVoice(query: string, voiceMode: string) {
  await Tone.start();
  const voice = new Tone.Synth().toDestination();
  voice.triggerAttackRelease(432 * 1.618 ** -6, '8n'); // 0.090 Hz
  let response = query.match(/merge/i) ? 'Merging 11D realities...' : 'Time is us.';
  if (voiceMode === 'AmharicSerene') {
    response = query.match(/merge/i) ? '11ዲ እውነታዎችን በማዋሃድ ላይ...' : 'ጊዜ እኛ ነው።';
  }
  return {
    resonance: voiceMode,
    response
  };
}
