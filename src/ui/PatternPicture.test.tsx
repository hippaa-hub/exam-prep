// The drawings have exactly as many sticks, tiles or dots as the teacher's rules say.
import { describe, expect, it } from 'vitest';
import { countOf, shapeOf } from './PatternPicture';

describe('pattern pictures', () => {
  it.each(['matchsticks', 'toothpicks', 'tile-cross', 'dot-triangles', 'dot-squares', 'mosaic'] as const)('%s', (kind) => {
    for (let n = 1; n <= 6; n++) expect(shapeOf(kind, n).body.length, `figure ${n}`).toBe(countOf(kind, n));
  });
});
