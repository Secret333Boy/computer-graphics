import Normal3D from '../src/structures/normal/Normal';
import Vector3D from '../src/structures/vector/Vector3D';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import { Hit } from '../src/types/Hit';
import { findClosestHit } from '../src/utils/findClosestHit';

describe('utils', () => {
  const normal = new Normal3D(new Vector3D(0, 0, 1));
  const hits: Hit[] = [
    {
      normal,
      vertex: new Vertex3D(0, 0, 2),
      t: 2,
    },
    {
      normal,
      vertex: new Vertex3D(0, 0, 1),
      t: 1,
    },
    {
      normal,
      vertex: new Vertex3D(0, 0, 3),
      t: 3,
    },
  ];
  it('should compute the closest hit of several hits', () => {
    const closestHit = findClosestHit(hits);
    expect(closestHit).toBe(hits[1]);
  });
});
