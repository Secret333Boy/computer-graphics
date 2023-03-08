import Vertex3D from '../src/structures/vertex/Vertex3D';
import Vector3D from '../src/structures/vector/Vector3D';
import Ray from '../src/structures/ray/Ray';

describe('Ray', () => {
  const position = new Vertex3D(0, 0, 0);
  const vector = new Vector3D(1, 0, 0);
  const ray = new Ray(position, vector);

  describe('hasInside', () => {
    it('returns true for a vertex that is on the ray', () => {
      const vertexA = new Vertex3D(3, 0, 0);
      expect(ray.hasInside(vertexA)).toBe(true);
    });

    it('returns true for a vertex that is in front of the ray', () => {
      const vertexB = new Vertex3D(3, 1, 1);
      expect(ray.hasInside(vertexB)).toBe(true);
    });

    it('returns false for a vertex that is behind the ray', () => {
      const vertexC = new Vertex3D(-1, 1, 1);
      expect(ray.hasInside(vertexC)).toBe(false);
    });
  });

  describe('angleBetweenRads', () => {
    it('should return a correct angle between another vector', () => {
      const v1 = new Vector3D(1, 0, 0);
      const v2 = new Vector3D(1, 1, 0);
      expect(
        new Ray(new Vertex3D(0, 3, 1), v1).angleBetweenRads(
          new Ray(new Vertex3D(13, 3, 2), v2)
        )
      ).toBeCloseTo(Math.PI / 4);
    });
  });
});
