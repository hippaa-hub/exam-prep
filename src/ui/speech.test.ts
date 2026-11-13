import { describe, expect, it } from 'vitest';
import { pickVoice } from './speech';

const v = (name: string, lang: string) => ({ name, lang });

describe("choosing a woman's voice", () => {
  it('uses Nicky when the phone has her, then Samantha', () => {
    const voices = [v('Daniel', 'en-GB'), v('Samantha', 'en-US'), v('Kate', 'en-GB'), v('Nicky (Enhanced)', 'en-US'), v('Martha', 'en-GB')];
    expect(pickVoice(voices)?.name).toBe('Nicky (Enhanced)');
    expect(pickVoice(voices.filter((x) => !x.name.startsWith('Nicky')))?.name).toBe('Samantha');
  });

  it('falls back to a British woman when neither is there', () => {
    const voices = [v('Daniel', 'en-GB'), v('Kate', 'en-GB'), v('Arthur', 'en-GB'), v('Amélie', 'fr-CA')];
    expect(pickVoice(voices)?.name).toBe('Kate');
  });

  it('tells "Female" from "Male" in Chrome\'s voice names', () => {
    const voices = [v('Google UK English Male', 'en-GB'), v('Google UK English Female', 'en-GB'), v('Google US English', 'en-US')];
    expect(pickVoice(voices)?.name).toBe('Google UK English Female');
  });

  it("takes a woman's voice in another English if there is no British one", () => {
    const voices = [v('Daniel', 'en-GB'), v('Karen', 'en-AU'), v('Alex', 'en-US')];
    expect(pickVoice(voices)?.name).toBe('Karen');
  });

  it('avoids a known man\'s voice when it cannot be sure', () => {
    const voices = [v('Daniel', 'en-GB'), v('English United Kingdom', 'en-GB')];
    expect(pickVoice(voices)?.name).toBe('English United Kingdom');
  });

  it('prefers a natural voice to a robotic one', () => {
    const mac = ['Daniel (English (United Kingdom))', 'Arthur', 'Eddy (English (United Kingdom))', 'Flo (English (United Kingdom))',
      'Grandma (English (United Kingdom))', 'Martha', 'Sandy (English (United Kingdom))', 'Shelley (English (United Kingdom))'];
    expect(pickVoice(mac.map((n) => v(n, 'en-GB')))?.name).toBe('Martha');
    // With no natural British woman, a natural woman in another English beats a robotic British one.
    expect(pickVoice([v('Flo (English (United Kingdom))', 'en-GB'), v('Karen', 'en-AU')])?.name).toBe('Karen');
    expect(pickVoice([v('Flo (English (United Kingdom))', 'en-GB'), v('Daniel', 'en-GB')])?.name).toBe('Flo (English (United Kingdom))');
  });

  it('recognises Android voice codes', () => {
    const voices = [v('en-gb-x-rjs-local', 'en_GB'), v('en-gb-x-gba-local', 'en_GB')];
    expect(pickVoice(voices)?.name).toBe('en-gb-x-gba-local');
  });

  it('skips joke voices and other languages', () => {
    const voices = [v('Bells', 'en-US'), v('Whisper', 'en-US'), v('Anna', 'de-DE'), v('Karen', 'en-AU')];
    expect(pickVoice(voices)?.name).toBe('Karen');
  });

  it('still reads with something if only a man\'s voice exists, and copes with no voices', () => {
    expect(pickVoice([v('Daniel', 'en-GB')])?.name).toBe('Daniel');
    expect(pickVoice([])).toBeUndefined();
    expect(pickVoice([v('Anna', 'de-DE')])).toBeUndefined();
  });
});
