// Hands a short text to the phone's own share sheet (WhatsApp, Messages...), or copies it.
// Used in the parent view to get the private channel name onto the parent's own phone.
import { useState } from 'react';

interface Props {
  text: string;
  label: string;
  className?: string;
  /** Shown after the text was copied instead of shared. */
  copiedNote?: string;
}

export function ShareText({ text, label, className = 'btn ghost', copiedNote = 'Copied.' }: Props) {
  const [note, setNote] = useState<'copied' | 'show' | null>(null);

  const send = async () => {
    setNote(null);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if ((e as { name?: string } | null)?.name === 'AbortError') return; // the share sheet was closed
      }
    }
    // No share sheet on this device: copy the text so it can be pasted into a message.
    try {
      await navigator.clipboard.writeText(text);
      setNote('copied');
    } catch {
      setNote('show');
    }
  };

  return (
    <div className="share-text">
      <button type="button" className={className} onClick={send}>{label}</button>
      {note === 'copied' && <p className="muted small center" role="status">{copiedNote}</p>}
      {note === 'show' && <p className="muted small center" role="status">Could not share or copy it. Type the channel name by hand.</p>}
    </div>
  );
}
