import {
  transformVector,
  transformations,
} from '../structures/matrix/transformation-factories';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { expectVector3DCloseTo } from '../../lab1/tests/helpers';

describe('transformation-factories', () => {
  const initialVector = new Vector3D(1, 2, 3);
  it('should be able to create a correct translation matrix', () => {
    const translationMatrix = transformations.translate3d(1, 2, 3);
    const translatedVector = transformVector(initialVector, translationMatrix);
    expectVector3DCloseTo(translatedVector, new Vector3D(2, 4, 6));
  });
  it('should be able to create a correct scaling matrix', () => {
    const scalingMatrix = transformations.scale3d(1, 2, 3);
    const scaledVector = transformVector(initialVector, scalingMatrix);
    expectVector3DCloseTo(scaledVector, new Vector3D(1, 4, 9));
  });
  it('should be able to create a correct rotation matrix around X', () => {
    const rotationMatrix = transformations.rotate3dX(Math.PI / 2);
    const rotatedVector = transformVector(initialVector, rotationMatrix);
    expectVector3DCloseTo(rotatedVector, new Vector3D(1, 3, -2));
  });
  it('should be able to create a correct rotation matrix around Y', () => {
    const rotationMatrix = transformations.rotate3dY(Math.PI / 2);
    const rotatedVector = transformVector(initialVector, rotationMatrix);
    expectVector3DCloseTo(rotatedVector, new Vector3D(-3, 2, 1));
  });
  it('should be able to create a correct rotation matrix around Z', () => {
    const rotationMatrix = transformations.rotate3dZ(Math.PI / 2);
    const rotatedVector = transformVector(initialVector, rotationMatrix);
    expectVector3DCloseTo(rotatedVector, new Vector3D(2, -1, 3));
  });
  it('should be able to correctly compose rotation around 3 axes', () => {
    const rotationMatrix = transformations.rotate3d(
      Math.PI / 2,
      Math.PI / 2,
      Math.PI / 2
    );
    const rotatedVector = transformVector(initialVector, rotationMatrix);
    expectVector3DCloseTo(rotatedVector, new Vector3D(3, -2, 1));
  });
  it('should be able to correctly compose rotation, scaling and transform', () => {
    const transformation = transformations.compose(
      transformations.rotate3dX(Math.PI / 2),
      transformations.rotate3dY(Math.PI / 2),
      transformations.rotate3dZ(Math.PI / 2),
      transformations.scale3d(1, 2, 3),
      transformations.translate3d(1, 2, 3)
    );
    const translatedVector = transformVector(initialVector, transformation);
    expectVector3DCloseTo(translatedVector, new Vector3D(4, -2, 6));
  });
});
