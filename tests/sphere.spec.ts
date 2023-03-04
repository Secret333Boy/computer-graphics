import Vertex3D from '../src/structures/vertex/Vertex3D';
import {Sphere} from '../src/structures/sphere/Sphere';
import Ray from '../src/structures/ray/Ray';
import Vector3D from '../src/structures/vector/Vector3D';


describe('Sphere', () => {
  const center = new Vertex3D(0, 0, 0);
  const radius = 1;
  const sphere = new Sphere(center, radius);

  describe('constructor', () => {
    it('should set the center and radius properties', () => {
      expect(sphere.center).toEqual(center);
      expect(sphere.radius).toEqual(radius);
    });
  });

  describe('isIntersecting', () => {
    it('should return true when the ray intersects the sphere', () => {
      const ray = new Ray(new Vertex3D(0, 0, -2), new Vector3D(0, 0, 1));
      expect(sphere.isIntersecting(ray)).toBe(true);
    });

    it('should return false when the ray does not intersect the sphere', () => {
      const ray = new Ray(new Vertex3D(0, 0, -2), new Vector3D(1, 1, 1));
      expect(sphere.isIntersecting(ray)).toBe(false);
    });

    it('should return true when the ray is tangent to the sphere', () => {
      const ray = new Ray(new Vertex3D(0, 1, 0), new Vector3D(1, 0, 0));
      expect(sphere.isIntersecting(ray)).toBe(true);
    });

    it('should return true when the ray starts outside the sphere and goes through the center', () => {
      const ray = new Ray(new Vertex3D(0, 0, -2), new Vector3D(0, 0, 2));
      expect(sphere.isIntersecting(ray)).toBe(true);
    });
  });
});
