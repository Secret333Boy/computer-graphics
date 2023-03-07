import Vector3D from '../src/structures/vector/Vector3D';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Plane from '../src/structures/plane/Plane';
import Ray from '../src/structures/ray/Ray';

describe('Plane', () => {
  const vector = new Vector3D(1, 1, 1);
  const point = new Vertex3D(0, 0, 0);
  const plane = new Plane(vector, point);

  test('constructor initializes vector and point', () => {
    expect(plane.normal.vector.length).toEqual(1);
    expect(plane.normal.vector.x).toEqual(plane.normal.vector.y);
    expect(plane.normal.vector.y).toEqual(plane.normal.vector.z);
    expect(plane.normal.vector.x).toBeGreaterThan(0);
    expect(plane.point).toEqual(point);
  });

  describe('intersection', () => {
    it('should return null if the ray is parallel to the plane', () => {
      const vector = new Vector3D(1, 0, 0);
      const point = new Vertex3D(0, 0, 0);
      const plane = new Plane(vector, point);
      const ray = new Ray(new Vertex3D(1, 1, 1), new Vector3D(0, 1, 0));
      expect(plane.intersection(ray)).toBeNull();
    });
  
    it('should return null if the intersection is behind the ray origin', () => {
      const vector = new Vector3D(1, 0, 0);
      const point = new Vertex3D(0, 0, 0);
      const plane = new Plane(vector, point);
      const ray = new Ray(new Vertex3D(-1, 1, 0), new Vector3D(0, 1, 0));
      expect(plane.intersection(ray)).toBeNull();
    });
  
    it('should return the angle between the plane normal and the ray vector', () => {
      const vector = new Vector3D(1, 0, 0);
      const point = new Vertex3D(0, 0, 0);
      const plane = new Plane(vector, point);
      const ray = new Ray(new Vertex3D(0, 1, 0), new Vector3D(1, 1, 0));
      expect(plane.intersection(ray)).toBeCloseTo(Math.PI / 4);
    });
  });
});

