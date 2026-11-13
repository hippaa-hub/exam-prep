// "Hear it again" and the on/off switch for reading aloud.
import { setReadAloud, speak, speechAvailable, stopSpeaking } from './speech';

interface Props {
  /** What to read. */
  text: string;
  /** Whether reading aloud is switched on. */
  aloud: boolean;
  onAloud: (on: boolean) => void;
  /** The label of the main button. */
  label?: string;
}

export function ListenRow({ text, aloud, onAloud, label = 'Hear it again' }: Props) {
  if (!speechAvailable()) return null;

  const toggle = () => {
    const on = !aloud;
    setReadAloud(on);
    onAloud(on);
    if (on) speak(text); else stopSpeaking();
  };

  return (
    <div className="listen">
      <button type="button" className="listen-btn" onClick={() => speak(text)}>
        <span aria-hidden="true">🔊</span> {label}
      </button>
      <button type="button" className="listen-toggle" aria-pressed={aloud} onClick={toggle}>
        Read aloud: {aloud ? 'on' : 'off'}
      </button>
    </div>
  );
}
