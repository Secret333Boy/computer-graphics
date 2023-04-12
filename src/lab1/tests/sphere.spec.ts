import Vertex3D from '../structures/vertex/Vertex3D';
import { Sphere } from '../structures/sphere/Sphere';
import Ray from '../structures/ray/Ray';
import Vector3D from '../structures/vector/Vector3D';

describe('Sphere', () => {
  const center = new Vertex3D(0, 0, 0);
  const radius = 5;
  const sphere = new Sphere(center, radius);

  describe('constructor', () => {
    it('creating a sphere with a given center and radius', () => {
      expect(sphere.center).toEqual(center);
      expect(sphere.radius).toEqual(radius);
    });
  });

  describe('translating a sphere', () => {
    it('df', () => {
      // Translate the sphere
      sphere.translate(1, 2, 3);

      // Assertions
      expect(sphere.center.x).toEqual(1);
      expect(sphere.center.y).toEqual(2);
      expect(sphere.center.z).toEqual(3);
    });
  });

  describe('isIntersecting', () => {
    it('should return null when the ray intersects the sphere but only behind', () => {
      const ray = new Ray(new Vertex3D(0, 0, 2), new Vector3D(0, 0, 1));
      expect(sphere.getIntersection(ray)).toBe(null);
    });
  });

  it('should return null intersection when the ray starts inside the sphere', () => {
    const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, -1));
    const intersecion = sphere.getIntersection(ray);
    expect(intersecion).toBeNull();
  });
});
