import Vector3D from '../structures/vector/Vector3D';
import Vertex3D from '../structures/vertex/Vertex3D';

export const expectVector3DCloseTo = (
  received: Vector3D,
  expected: Vector3D,
  precision = 2
) => {
  expect(received.x).toBeCloseTo(expected.x, precision);
  expect(received.y).toBeCloseTo(expected.y, precision);
  expect(received.z).toBeCloseTo(expected.z, precision);
};

export const expectVertex3DCloseTo = (
  received: Vertex3D,
  expected: Vertex3D,
  precision = 2
) => {
  return expectVector3DCloseTo(
    received.toVector(),
    expected.toVector(),
    precision
  );
};
