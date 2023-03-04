import Vector3D from '../src/structures/vector/Vector3D';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Plane from '../src/structures/plane/Plane';

describe('Plane', () => {
  const vector = new Vector3D(1, 1, 1);
  const point = new Vertex3D(0, 0, 0);
  const plane = new Plane(vector, point);

  test('constructor initializes vector and point', () => {
    expect(plane.vector).toEqual(vector);
    expect(plane.point).toEqual(point);
  });
});
