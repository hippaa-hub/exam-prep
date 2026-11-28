// The pictures the games use: an animal cell, a plant cell and a compound microscope.
// The organelles and the microscope are illustrations (public/art, made with gpt-image-2.5 low and cut out with BiRefNet);
// the membrane, cytoplasm and cell wall are drawn with soft gradients, so a cell can still be built part by part.
// Every part is its own group with data-part, so it can be tapped, labelled or added. Gentle movement is CSS
// (turned off for people who ask for less motion).
import type { ReactNode } from 'react';
import type { Diagram } from '../../content/adventure';

type Spot = { x: number; y: number };
type Hot = { cx: number; cy: number; rx: number; ry: number };

/** Where the number marker for each part sits (beside the part, so the part stays visible). */
export const SPOTS: Record<Diagram, Record<string, Spot>> = {
  'animal-cell': {
    membrane: { x: 22, y: 112 }, cytoplasm: { x: 112, y: 176 }, nucleus: { x: 208, y: 76 }, nucleolus: { x: 164, y: 128 },
    mitochondria: { x: 56, y: 58 }, ribosomes: { x: 252, y: 50 },
  },
  'plant-cell': {
    wall: { x: 160, y: 9 }, membrane: { x: 22, y: 150 }, cytoplasm: { x: 226, y: 128 }, vacuole: { x: 128, y: 104 },
    nucleus: { x: 288, y: 150 }, nucleolus: { x: 250, y: 188 }, chloroplasts: { x: 48, y: 52 }, mitochondria: { x: 256, y: 70 },
    ribosomes: { x: 104, y: 190 },
  },
  microscope: {
    eyepiece: { x: 304, y: 56 }, nosepiece: { x: 40, y: 228 }, objectives: { x: 212, y: 330 }, stage: { x: 34, y: 446 },
    clips: { x: 262, y: 352 }, coarse: { x: 398, y: 404 }, fine: { x: 336, y: 566 }, light: { x: 206, y: 560 },
  },
};

/** The area of each part: for tapping, and for the green or orange ring after a tap. */
const HOT: Record<Diagram, Record<string, Hot>> = {
  'animal-cell': {
    membrane: { cx: 160, cy: 110, rx: 138, ry: 94 }, cytoplasm: { cx: 160, cy: 110, rx: 120, ry: 78 },
    nucleus: { cx: 166, cy: 108, rx: 40, ry: 40 }, nucleolus: { cx: 158, cy: 102, rx: 13, ry: 13 },
    mitochondria: { cx: 84, cy: 72, rx: 30, ry: 22 }, ribosomes: { cx: 236, cy: 70, rx: 26, ry: 22 },
  },
  'plant-cell': {
    wall: { cx: 160, cy: 110, rx: 156, ry: 106 }, membrane: { cx: 160, cy: 110, rx: 144, ry: 94 }, cytoplasm: { cx: 160, cy: 110, rx: 130, ry: 80 },
    vacuole: { cx: 128, cy: 102, rx: 78, ry: 56 }, nucleus: { cx: 258, cy: 160, rx: 28, ry: 28 }, nucleolus: { cx: 254, cy: 156, rx: 9, ry: 9 },
    chloroplasts: { cx: 46, cy: 44, rx: 22, ry: 16 }, mitochondria: { cx: 238, cy: 58, rx: 22, ry: 15 }, ribosomes: { cx: 106, cy: 176, rx: 20, ry: 14 },
  },
  microscope: {
    eyepiece: { cx: 236, cy: 72, rx: 42, ry: 52 }, nosepiece: { cx: 134, cy: 254, rx: 64, ry: 22 }, objectives: { cx: 122, cy: 316, rx: 76, ry: 38 },
    stage: { cx: 136, cy: 408, rx: 128, ry: 22 }, clips: { cx: 222, cy: 380, rx: 20, ry: 18 }, coarse: { cx: 340, cy: 458, rx: 48, ry: 48 },
    fine: { cx: 284, cy: 532, rx: 28, ry: 28 }, light: { cx: 124, cy: 530, rx: 56, ry: 26 },
  },
};

export const VIEWBOX: Record<Diagram, string> = { 'animal-cell': '0 0 320 220', 'plant-cell': '0 0 320 220', microscope: '0 0 424 700' };

interface Props {
  diagram: Diagram;
  /** Only these parts are drawn (for building a cell). Left out, every part is drawn. */
  show?: ReadonlySet<string>;
  /** Makes every part tappable. */
  onTap?: (part: string) => void;
  /** Number markers on these parts (labelling): part → number. Each marker is a drop target. */
  markers?: Record<string, number>;
  /** Parts to ring in green (right) or orange (wrong). */
  mark?: Record<string, 'right' | 'wrong'>;
  /** The whole drawing is one drop target with this name (building a cell). */
  dropName?: string;
  label: string;
}

const art = (name: string) => `./art/${name}.webp`;

export function DiagramView({ diagram, show, onTap, markers, mark, dropName, label }: Props) {
  const has = (k: string) => !show || show.has(k);
  const part = (k: string, node: ReactNode) => has(k) && (
    <g key={k} data-part={k} className={`part${onTap ? ' tappable' : ''}${show ? ' arrive' : ''}`}
      onClick={onTap ? () => onTap(k) : undefined}
      role={onTap ? 'button' : undefined} aria-label={onTap ? k : undefined} tabIndex={onTap ? 0 : undefined}
      onKeyDown={onTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(k); } } : undefined}>
      {node}
    </g>
  );
  const drawing = diagram === 'animal-cell' ? animal(part, has) : diagram === 'plant-cell' ? plant(part, has) : scope(part);
  const big = diagram === 'microscope';
  const r = big ? 20 : 12;
  return (
    <svg viewBox={VIEWBOX[diagram]} className={`diagram ${diagram}`} role="img" aria-label={label} data-drop={dropName}>
      <Defs />
      {drawing}
      {mark && Object.entries(mark).map(([k, m]) => {
        const h = HOT[diagram][k];
        return h && <ellipse key={`r-${k}`} className={`ring ring-${m}`} cx={h.cx} cy={h.cy} rx={h.rx + 4} ry={h.ry + 4} />;
      })}
      {markers && Object.entries(markers).map(([k, n]) => {
        const s = SPOTS[diagram][k];
        return (
          <g key={`m-${k}`} data-drop={k} className="marker">
            <circle cx={s.x} cy={s.y} r={r} />
            <text x={s.x} y={s.y + r * 0.42} textAnchor="middle" style={{ fontSize: r * 1.15 }}>{n}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Defs() {
  return (
    <defs>
      <radialGradient id="cyto-animal" cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor="#fff7ec" />
        <stop offset="60%" stopColor="#ffe2c4" />
        <stop offset="100%" stopColor="#ffc89b" />
      </radialGradient>
      <radialGradient id="cyto-plant" cx="45%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#f7fff0" />
        <stop offset="65%" stopColor="#dcf7c4" />
        <stop offset="100%" stopColor="#b9ec95" />
      </radialGradient>
      <linearGradient id="membrane" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#ffb347" />
        <stop offset="100%" stopColor="#ff7a3d" />
      </linearGradient>
      <linearGradient id="wall" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#8fe35b" />
        <stop offset="50%" stopColor="#4fbf2a" />
        <stop offset="100%" stopColor="#2f8f16" />
      </linearGradient>
    </defs>
  );
}

type PartFn = (k: string, node: ReactNode) => ReactNode;

/** Little specks drifting in the cytoplasm: it is a liquid where things happen. */
function Specks({ points, colour }: { points: [number, number][]; colour: string }) {
  return (
    <g className="specks">
      {points.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill={colour} style={{ animationDelay: `${(i % 5) * 0.8}s` }} />)}
    </g>
  );
}

function Img({ name, x, y, w, h, anim, delay = 0, rotate = 0 }: { name: string; x: number; y: number; w: number; h: number; anim?: string; delay?: number; rotate?: number }) {
  return (
    <g transform={rotate ? `rotate(${rotate} ${x + w / 2} ${y + h / 2})` : undefined}>
      <image href={art(name)} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet"
        className={anim} style={delay ? { animationDelay: `${delay}s` } : undefined} />
    </g>
  );
}

function animal(part: PartFn, has: (k: string) => boolean) {
  const outline = 'M24,110 C24,50 84,16 160,16 C238,16 298,52 298,108 C298,172 236,206 160,206 C80,206 24,172 24,110Z';
  return (
    <>
      {/* A faint outline while the cell is still being built. */}
      {!has('membrane') && !has('cytoplasm') && <path d={outline} fill="none" stroke="#c9c9d6" strokeWidth="2" strokeDasharray="6 6" />}
      {part('cytoplasm', (
        <>
          <path d={outline} fill="url(#cyto-animal)" />
          <Specks colour="#e8a26a" points={[[70, 120], [96, 160], [130, 186], [206, 176], [262, 140], [250, 96], [112, 54], [196, 40], [58, 92], [228, 188]]} />
        </>
      ))}
      {part('membrane', (
        <>
          <path d={outline} fill="none" stroke="url(#membrane)" strokeWidth="8" />
          <path d={outline} fill="none" stroke="#fff6e0" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 7" className="flow" />
        </>
      ))}
      {part('mitochondria', (
        <>
          <Img name="o-mito" x={56} y={52} w={58} h={42} rotate={-20} anim="bob" />
          <Img name="o-mito" x={214} y={138} w={58} h={42} rotate={24} anim="bob" delay={1.3} />
        </>
      ))}
      {part('ribosomes', (
        <>
          {[[222, 54], [242, 66], [226, 80], [60, 140], [104, 176], [270, 112], [196, 182]].map(([x, y], i) => (
            <Img key={i} name="o-ribosome" x={x} y={y} w={13} h={13} anim="twinkle" delay={i * 0.4} />
          ))}
        </>
      ))}
      {part('nucleus', <Img name="o-nucleus" x={124} y={66} w={84} h={84} anim="breathe" />)}
      {part('nucleolus', <Img name="o-nucleolus" x={145} y={89} w={26} h={26} anim="breathe" delay={0.5} />)}
    </>
  );
}

function plant(part: PartFn, has: (k: string) => boolean) {
  return (
    <>
      {!has('wall') && !has('membrane') && !has('cytoplasm') && <rect x="8" y="8" width="304" height="204" rx="12" fill="none" stroke="#c9c9d6" strokeWidth="2" strokeDasharray="6 6" />}
      {part('wall', (
        <>
          <rect x="6" y="6" width="308" height="208" rx="14" fill="none" stroke="url(#wall)" strokeWidth="12" />
          <rect x="6" y="6" width="308" height="208" rx="14" fill="none" stroke="#c9f7a8" strokeWidth="2" strokeDasharray="14 6" opacity="0.8" />
        </>
      ))}
      {part('cytoplasm', (
        <>
          <rect x="16" y="16" width="288" height="188" rx="8" fill="url(#cyto-plant)" />
          <Specks colour="#8fcf5a" points={[[40, 120], [80, 186], [150, 190], [232, 110], [286, 60], [220, 186], [44, 80], [180, 30], [290, 190], [250, 130]]} />
        </>
      ))}
      {part('membrane', (
        <>
          <rect x="16" y="16" width="288" height="188" rx="8" fill="none" stroke="url(#membrane)" strokeWidth="5" />
          <rect x="16" y="16" width="288" height="188" rx="8" fill="none" stroke="#fff6e0" strokeWidth="2" strokeLinecap="round" strokeDasharray="0.1 6" className="flow" />
        </>
      ))}
      {part('vacuole', <Img name="o-vacuole" x={50} y={46} w={156} h={112} anim="breathe-slow" />)}
      {part('chloroplasts', (
        <>
          {[[28, 30, -12], [266, 22, 14], [22, 160, 76], [146, 172, -6], [268, 96, 70], [140, 20, 6]].map(([x, y, r], i) => (
            <Img key={i} name="o-chloroplast" x={x} y={y} w={36} h={28} rotate={r} anim="sway" delay={i * 0.6} />
          ))}
        </>
      ))}
      {part('mitochondria', <Img name="o-mito" x={218} y={44} w={40} h={29} rotate={8} anim="bob" />)}
      {part('ribosomes', (
        <>
          {[[96, 168], [112, 180], [236, 104], [246, 120], [34, 110], [204, 178]].map(([x, y], i) => (
            <Img key={i} name="o-ribosome" x={x} y={y} w={11} h={11} anim="twinkle" delay={i * 0.4} />
          ))}
        </>
      ))}
      {part('nucleus', <Img name="o-nucleus" x={230} y={132} w={56} h={56} anim="breathe" />)}
      {part('nucleolus', <Img name="o-nucleolus" x={246} y={148} w={17} h={17} anim="breathe" delay={0.5} />)}
    </>
  );
}

function scope(part: PartFn) {
  const zone = (k: string) => {
    const h = HOT.microscope[k];
    return <ellipse cx={h.cx} cy={h.cy} rx={h.rx} ry={h.ry} className="zone" />;
  };
  return (
    <>
      <image href={art('x-microscope')} x="0" y="0" width="424" height="700" />
      {/* The light glows softly. */}
      <ellipse cx="124" cy="526" rx="40" ry="14" className="glow" />
      {/* Tap zones over the picture, in an order where small parts sit on top of big ones. */}
      {['stage', 'objectives', 'nosepiece', 'eyepiece', 'coarse', 'fine', 'light', 'clips'].map((k) => part(k, zone(k)))}
    </>
  );
}

/** Which illustration each molecule look uses. */
const MOLECULE: Record<string, string> = {
  small: 'm-water', fuel: 'm-glucose', gas: 'm-oxygen', waste: 'm-co2', toxin: 'm-toxin', fat: 'm-fat', mineral: 'm-mineral', big: 'm-toxin',
};

/** A molecule for the membrane gate. */
export function Molecule({ look }: { look: string }) {
  return <img className="molecule" src={art(MOLECULE[look] ?? 'm-water')} alt="" draggable={false} />;
}
