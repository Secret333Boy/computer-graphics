import Normal3D from '../structures/normal/Normal';
import Vector3D from '../structures/vector/Vector3D';
import { expectVector3DCloseTo } from './helpers';

describe('Normal', () => {
  describe('transform', () => {
    const normal = new Normal3D(new Vector3D(0, 0, 1));

    it('should NOT scale the normal', () => {
      normal.scale(2, 2, 2);
      expectVector3DCloseTo(normal.vector, new Vector3D(0, 0, 1));
    });

    it('should rotate the normal', () => {
      normal.rotate(0, Math.PI / 2, 0);
      expectVector3DCloseTo(normal.vector, new Vector3D(0, 0, 1));
    });
  });
});
