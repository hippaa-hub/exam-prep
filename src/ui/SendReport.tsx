// Sends the day's report from Adele's phone to a parent's phone.
// The app sends nothing itself: it hands the text to the phone's own share sheet (WhatsApp, Messages...).
import { useState } from 'react';

interface Props {
  /** The ready-made report. */
  text: string;
  label: string;
  className?: string;
}

export function SendReport({ text, label, className = 'btn ghost' }: Props) {
  const [note, setNote] = useState<'copied' | 'show' | null>(null);

  const send = async () => {
    setNote(null);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if ((e as { name?: string } | null)?.name === 'AbortError') return; // she closed the share sheet
      }
    }
    // No share sheet on this device: copy the report so it can be pasted into a message.
    try {
      await navigator.clipboard.writeText(text);
      setNote('copied');
    } catch {
      setNote('show');
    }
  };

  return (
    <div className="send-report">
      <button type="button" className={className} onClick={send}>{label}</button>
      {note === 'copied' && <p className="muted small center" role="status">Copied. Open WhatsApp or Messages and paste it to your parent.</p>}
      {note === 'show' && (
        <>
          <p className="muted small center" role="status">Copy this and send it to your parent:</p>
          <textarea className="report-text" readOnly rows={8} value={text} onFocus={(e) => e.currentTarget.select()} aria-label="Report for your parent" />
        </>
      )}
    </div>
  );
}
