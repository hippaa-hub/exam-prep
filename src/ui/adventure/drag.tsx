// Drag and drop that works with a finger and a mouse, plus a tap-then-tap fallback:
// tap a card, then tap where it goes. Drop targets are any elements (HTML or SVG) with data-drop="name".
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

interface Drag { item: string; text: string; x: number; y: number; dx: number; dy: number; moved: boolean }

function targetAt(x: number, y: number): string | null {
  const el = document.elementFromPoint?.(x, y) as Element | null;
  const hit = el?.closest?.('[data-drop]');
  return hit?.getAttribute('data-drop') ?? null;
}

export function useDragDrop(onDrop: (item: string, target: string) => void) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  /** Props for a draggable card. */
  const card = (item: string, text: string) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      start.current = { x: e.clientX, y: e.clientY };
      setDrag({ item, text, x: e.clientX, y: e.clientY, dx: e.clientX - r.left, dy: e.clientY - r.top, moved: false });
      e.currentTarget.setPointerCapture?.(e.pointerId);
    },
    onPointerMove: (e: ReactPointerEvent<HTMLElement>) => {
      if (!drag || drag.item !== item || !start.current) return;
      const moved = drag.moved || Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 6;
      setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
      if (moved) setOver(targetAt(e.clientX, e.clientY));
    },
    onPointerUp: (e: ReactPointerEvent<HTMLElement>) => {
      if (!drag || drag.item !== item) return;
      const d = drag;
      setDrag(null);
      setOver(null);
      if (!d.moved) { setSelected((s) => (s === item ? null : item)); return; } // a tap: select the card
      const t = targetAt(e.clientX, e.clientY);
      setSelected(null);
      if (t) onDrop(item, t);
    },
    onPointerCancel: () => { setDrag(null); setOver(null); },
    // Keyboard: Enter selects, like a tap.
    onKeyDown: (e: { key: string; preventDefault: () => void }) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected((s) => (s === item ? null : item)); } },
    'aria-pressed': selected === item,
    'data-lifting': drag?.item === item && drag.moved ? 'true' : undefined,
  });

  /** Call from a drop target's onClick: places the selected card there. */
  const tapTarget = (target: string) => {
    if (!selected) return;
    onDrop(selected, target);
    setSelected(null);
  };

  const ghost = drag?.moved ? (
    <span className="drag-ghost" aria-hidden="true" style={{ left: drag.x - drag.dx, top: drag.y - drag.dy }}>{drag.text}</span>
  ) : null;

  return { card, tapTarget, ghost, over, selected, setSelected };
}
