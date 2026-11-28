// The drawings the games use: an animal cell, a plant cell and a compound microscope.
// Every part is its own SVG group with data-part, so it can be tapped, labelled or built up piece by piece.
import type { ReactNode } from 'react';
import type { Diagram } from '../../content/adventure';

type Spot = { x: number; y: number };

/** Where the number marker for each part sits, for labelling. */
export const SPOTS: Record<Diagram, Record<string, Spot>> = {
  'animal-cell': {
    membrane: { x: 26, y: 112 }, cytoplasm: { x: 98, y: 160 }, nucleus: { x: 190, y: 132 }, nucleolus: { x: 156, y: 98 },
    mitochondria: { x: 80, y: 70 }, ribosomes: { x: 236, y: 62 },
  },
  'plant-cell': {
    wall: { x: 160, y: 10 }, membrane: { x: 22, y: 150 }, cytoplasm: { x: 222, y: 128 }, vacuole: { x: 132, y: 100 },
    nucleus: { x: 274, y: 178 }, nucleolus: { x: 252, y: 156 }, chloroplasts: { x: 44, y: 42 }, mitochondria: { x: 236, y: 62 },
    ribosomes: { x: 108, y: 178 },
  },
  microscope: {
    // Beside each part, not on top of it, so the part stays visible.
    eyepiece: { x: 66, y: 34 }, nosepiece: { x: 54, y: 136 }, objectives: { x: 60, y: 170 }, stage: { x: 22, y: 200 },
    clips: { x: 59, y: 176 }, coarse: { x: 202, y: 108 }, fine: { x: 196, y: 152 }, light: { x: 126, y: 244 },
  },
};

export const VIEWBOX: Record<Diagram, string> = { 'animal-cell': '0 0 320 220', 'plant-cell': '0 0 320 220', microscope: '0 0 240 300' };

interface Props {
  diagram: Diagram;
  /** Only these parts are drawn (for building a cell). Left out, every part is drawn. */
  show?: ReadonlySet<string>;
  /** Makes every part tappable. */
  onTap?: (part: string) => void;
  /** Number markers on these parts (labelling): part → number. Each marker is a drop target. */
  markers?: Record<string, number>;
  /** Parts to outline in green (right) or orange (wrong). */
  mark?: Record<string, 'right' | 'wrong'>;
  /** The whole drawing is one drop target with this name (building a cell). */
  dropName?: string;
  label: string;
}

export function DiagramView({ diagram, show, onTap, markers, mark, dropName, label }: Props) {
  const has = (k: string) => !show || show.has(k);
  const part = (k: string, node: ReactNode) => has(k) && (
    <g key={k} data-part={k} className={`part${onTap ? ' tappable' : ''}${mark?.[k] ? ` mark-${mark[k]}` : ''}${show ? ' pop' : ''}`}
      onClick={onTap ? () => onTap(k) : undefined}
      role={onTap ? 'button' : undefined} aria-label={onTap ? k : undefined} tabIndex={onTap ? 0 : undefined}
      onKeyDown={onTap ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(k); } } : undefined}>
      {node}
    </g>
  );
  const drawing = diagram === 'animal-cell' ? animal(part, has) : diagram === 'plant-cell' ? plant(part, has) : scope(part);
  return (
    <svg viewBox={VIEWBOX[diagram]} className={`diagram ${diagram}`} role="img" aria-label={label}
      data-drop={dropName}>
      {drawing}
      {markers && Object.entries(markers).map(([k, n]) => {
        const s = SPOTS[diagram][k];
        return (
          <g key={`m-${k}`} data-drop={k} className="marker">
            <circle cx={s.x} cy={s.y} r="12" />
            <text x={s.x} y={s.y + 5} textAnchor="middle">{n}</text>
          </g>
        );
      })}
    </svg>
  );
}

type PartFn = (k: string, node: ReactNode) => ReactNode;

function animal(part: PartFn, has: (k: string) => boolean) {
  const outline = 'M24,110 C24,52 82,18 160,18 C236,18 298,54 298,108 C298,170 236,204 160,204 C80,204 24,170 24,110Z';
  return (
    <>
      {/* A faint outline while the cell is still being built. */}
      {!has('membrane') && <path d={outline} fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="6 6" />}
      {part('cytoplasm', <path d={outline} fill="#fff1dc" stroke="none" />)}
      {part('membrane', <path d={outline} fill="none" stroke="#e08600" strokeWidth="5" />)}
      {part('mitochondria', (
        <>
          <Mito x={80} y={70} r={-20} />
          <Mito x={246} y={156} r={25} />
        </>
      ))}
      {part('ribosomes', <g fill="#1899d6">{[[236, 62], [220, 76], [252, 82], [68, 132], [116, 182], [214, 188], [276, 120]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" />)}</g>)}
      {part('nucleus', <circle cx="165" cy="110" r="38" fill="#eadcff" stroke="#a568cc" strokeWidth="3.5" />)}
      {part('nucleolus', <circle cx="156" cy="100" r="12" fill="#a568cc" />)}
    </>
  );
}

function plant(part: PartFn, has: (k: string) => boolean) {
  return (
    <>
      {!has('wall') && !has('membrane') && <rect x="8" y="8" width="304" height="204" rx="10" fill="none" stroke="#ccc" strokeWidth="2" strokeDasharray="6 6" />}
      {part('wall', <rect x="7" y="7" width="306" height="206" rx="12" fill="#bfe89a" stroke="#46a302" strokeWidth="4" />)}
      {part('cytoplasm', <rect x="18" y="18" width="284" height="184" rx="7" fill="#f3ffe9" stroke="none" />)}
      {part('membrane', <rect x="18" y="18" width="284" height="184" rx="7" fill="none" stroke="#e08600" strokeWidth="3.5" />)}
      {part('vacuole', <rect x="62" y="46" width="148" height="112" rx="40" fill="#d6f0ff" stroke="#1cb0f6" strokeWidth="3" />)}
      {part('chloroplasts', (
        <g>
          {[[44, 42, -10], [282, 36, 15], [36, 176, 80], [160, 188, -5], [282, 120, 70], [150, 30, 5]].map(([x, y, r]) => (
            <ellipse key={`${x}${y}`} cx={x} cy={y} rx="14" ry="7" fill="#58cc02" stroke="#2f6e01" strokeWidth="1.8" transform={`rotate(${r} ${x} ${y})`} />
          ))}
        </g>
      ))}
      {part('mitochondria', <Mito x={236} y={62} r={10} small />)}
      {part('ribosomes', <g fill="#1899d6">{[[108, 178], [96, 186], [228, 104], [244, 116], [40, 110], [214, 186]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.2" />)}</g>)}
      {part('nucleus', <circle cx="258" cy="162" r="24" fill="#eadcff" stroke="#a568cc" strokeWidth="3" />)}
      {part('nucleolus', <circle cx="252" cy="156" r="8" fill="#a568cc" />)}
    </>
  );
}

function scope(part: PartFn) {
  return (
    <>
      {/* The arm and base are not parts she is asked about: always drawn, never tappable. */}
      <path d="M150,262 C150,230 172,200 172,150 C172,100 150,80 124,74 L124,92 C142,98 154,116 154,150 C154,192 132,222 132,262Z" fill="#dfe6f3" stroke="#8a97ad" strokeWidth="2" />
      <rect x="40" y="258" width="160" height="26" rx="9" fill="#3d5a99" />
      <rect x="84" y="52" width="32" height="80" rx="4" fill="#4f74c4" />
      {part('eyepiece', <rect x="89" y="16" width="22" height="38" rx="3" fill="#2b2b2b" />)}
      {part('nosepiece', <path d="M70,130 L130,130 L122,146 L78,146Z" fill="#9aa3b2" stroke="#5f6878" strokeWidth="2" />)}
      {part('objectives', (
        <g fill="#c9a227" stroke="#7a6214" strokeWidth="1.5">
          <rect x="78" y="146" width="11" height="22" rx="2" />
          <rect x="95" y="146" width="11" height="32" rx="2" />
          <rect x="112" y="146" width="11" height="26" rx="2" />
        </g>
      ))}
      {part('stage', <rect x="36" y="194" width="132" height="10" rx="2" fill="#222" />)}
      {part('clips', (
        <g fill="#9aa3b2" stroke="#5f6878" strokeWidth="1.2">
          <rect x="46" y="186" width="26" height="6" rx="2" />
          <rect x="128" y="186" width="26" height="6" rx="2" />
        </g>
      ))}
      {part('coarse', <circle cx="172" cy="110" r="15" fill="#4f74c4" stroke="#2c4a8a" strokeWidth="3" />)}
      {part('fine', <circle cx="172" cy="147" r="9" fill="#7d9be0" stroke="#2c4a8a" strokeWidth="2.5" />)}
      {part('light', <circle cx="96" cy="246" r="12" fill="#ffd84a" stroke="#c9a227" strokeWidth="2" />)}
    </>
  );
}

function Mito({ x, y, r, small = false }: { x: number; y: number; r: number; small?: boolean }) {
  const rx = small ? 16 : 24;
  const ry = small ? 8 : 12;
  const zig = Array.from({ length: 7 }, (_, i) => `${x - rx + 6 + i * ((rx * 2 - 12) / 6)},${y + (i % 2 ? -ry / 2 : ry / 2)}`).join(' ');
  return (
    <g transform={`rotate(${r} ${x} ${y})`}>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#ffc9bf" stroke="#e0604d" strokeWidth="2.5" />
      <polyline points={zig} fill="none" stroke="#e0604d" strokeWidth="1.8" />
    </g>
  );
}

/** A molecule for the membrane gate, drawn by its look. */
export function Molecule({ look }: { look: string }) {
  const style: Record<string, { r: number; fill: string; stroke: string; dots?: number }> = {
    small: { r: 12, fill: '#7cc8ff', stroke: '#1899d6' },
    big: { r: 26, fill: '#ff9a62', stroke: '#c8551d', dots: 6 },
    fuel: { r: 18, fill: '#ffd84a', stroke: '#c9a227', dots: 4 },
    gas: { r: 14, fill: '#e3f7ff', stroke: '#1cb0f6' },
    waste: { r: 16, fill: '#9aa3b2', stroke: '#5f6878' },
    toxin: { r: 20, fill: '#b06ad9', stroke: '#6b2d91', dots: 5 },
    fat: { r: 16, fill: '#fff2b0', stroke: '#c9a227' },
    mineral: { r: 13, fill: '#c7d0dc', stroke: '#5f6878' },
  };
  const s = style[look] ?? style.small;
  return (
    <svg viewBox="0 0 64 64" className="molecule" aria-hidden="true">
      <circle cx="32" cy="32" r={s.r} fill={s.fill} stroke={s.stroke} strokeWidth="3" />
      {Array.from({ length: s.dots ?? 0 }, (_, i) => {
        const a = (i / (s.dots ?? 1)) * Math.PI * 2;
        return <circle key={i} cx={32 + Math.cos(a) * s.r * 0.55} cy={32 + Math.sin(a) * s.r * 0.55} r="3" fill={s.stroke} opacity="0.6" />;
      })}
    </svg>
  );
}
