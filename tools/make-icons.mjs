// Generates the app icons (no image libraries needed).
// A violet square with a three-quarter white progress ring - the app's readiness ring.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const BG = [0x5b, 0x5b, 0xd6];
const RING = [0xff, 0xff, 0xff];

const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function png(size) {
  const S = 4; // supersampling
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.3;
  const half = size * 0.045; // half the ring stroke width
  const raw = Buffer.alloc(size * (size * 3 + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      let cover = 0;
      let litSamples = 0;
      for (let sy = 0; sy < S; sy++) {
        for (let sx = 0; sx < S; sx++) {
          const px = x + (sx + 0.5) / S - cx;
          const py = y + (sy + 0.5) / S - cy;
          const d = Math.abs(Math.hypot(px, py) - radius);
          if (d <= half) {
            cover++;
            // Angle from the top, going clockwise, as a fraction of the circle.
            const t = (Math.atan2(px, -py) / (Math.PI * 2) + 1) % 1;
            if (t < 0.75) litSamples++;
          }
        }
      }
      const total = S * S;
      let r = BG[0], g = BG[1], b = BG[2];
      if (cover > 0) {
        // The ring's finished part is solid white, the rest a faint white.
        const strength = (litSamples + (cover - litSamples) * 0.28) / total;
        r = Math.round(BG[0] + (RING[0] - BG[0]) * strength);
        g = Math.round(BG[1] + (RING[1] - BG[1]) * strength);
        b = Math.round(BG[2] + (RING[2] - BG[2]) * strength);
      }
      raw[p++] = r;
      raw[p++] = g;
      raw[p++] = b;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

for (const [name, size] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(new URL(`../public/${name}`, import.meta.url), png(size));
  console.log('wrote public/' + name);
}
