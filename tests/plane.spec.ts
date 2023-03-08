import Vector3D from '../src/structures/vector/Vector3D';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Plane from '../src/structures/plane/Plane';
import Ray from '../src/structures/ray/Ray';
import Normal3D from '../src/structures/normal/Normal';

describe('Plane', () => {
  const normal = new Vector3D(0, 0, 1);
  const point = new Vertex3D(0, 0, 0);
  const plane = new Plane(point, normal);

  test('constructor initializes vector and point', () => {
    expect(plane.normal.vector).toEqual(new Vector3D(0, 0, 1));
    expect(plane.vertex).toEqual(point);
  });

  describe('getIntersection', () => {
    it('should return null if the ray is parallel to the plane', () => {
      const ray = new Ray(new Vertex3D(1, 1, 1), new Vector3D(1, 0, 0));
      expect(plane.getIntersection(ray)).toBeNull();
    });

    it('should return null if the ray is pointing away from the plane', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(0, 0, 1));
      expect(plane.getIntersection(ray)).toBeNull();
    });

    it('should return the correct intersection point and normal', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(0, 0, -1));
      const intersection = plane.getIntersection(ray);
      expect(intersection).not.toBeNull();
      expect(intersection?.vertex).toEqual(new Vertex3D(0, 0, 0));
      expect(intersection?.normal).toEqual(new Normal3D(normal));
    });
  });
});
