import { transformations } from '../../lab3/structures/matrix/transformation-factories';
import Normal3D from '../structures/normal/Normal';
import Vector3D from '../structures/vector/Vector3D';
import { expectVector3DCloseTo } from './helpers';

describe('Normal', () => {
  describe('transform', () => {
    const normal = new Normal3D(new Vector3D(0, 0, 1));

    it('should NOT scale the normal', () => {
      const transformed = normal.getTranformed(
        transformations.scale3d(2, 2, 2)
      );
      expectVector3DCloseTo(transformed.vector, new Vector3D(0, 0, 1));
    });

    it('should rotate the normal', () => {
      const transformed = normal.getTranformed(
        transformations.rotate3d(0, Math.PI / 2, 0)
      );
      expectVector3DCloseTo(transformed.vector, new Vector3D(-1, 0, 0));
    });
  });
});
