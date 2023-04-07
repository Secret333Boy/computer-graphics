import Vector3D from '../structures/vector/Vector3D';

export const expectVector3DCloseTo = (
  received: Vector3D,
  expected: Vector3D,
  precision = 2
) => {
  expect(received.x).toBeCloseTo(expected.x, precision);
  expect(received.y).toBeCloseTo(expected.y, precision);
  expect(received.z).toBeCloseTo(expected.z, precision);
};
