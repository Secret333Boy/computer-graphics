import Normal3D from '../structures/normal/Normal';
import Vector3D from '../structures/vector/Vector3D';
import Vertex3D from '../structures/vertex/Vertex3D';
import { Hit } from '../types/Hit';
import { Traceable } from '../types/Traceable';
import { findCloserHit } from '../utils/findCloserHit';

describe('utils', () => {
  const normal = new Normal3D(new Vector3D(0, 0, 1));
  const hits: Hit[] = [
    {
      normal,
      vertex: new Vertex3D(0, 0, 2),
      t: 2,
      object: {} as Traceable,
    },
    {
      normal,
      vertex: new Vertex3D(0, 0, 1),
      t: 1,
      object: {} as Traceable,
    },
    {
      normal,
      vertex: new Vertex3D(0, 0, 3),
      t: 3,
      object: {} as Traceable,
    },
  ];
  it('should compute the closest hit of several hits', () => {
    const closestHit = findCloserHit(...hits);
    expect(closestHit).toBe(hits[1]);
  });
});
