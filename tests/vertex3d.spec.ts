import Vertex3D from '../src/structures/vertex/Vertex3D';
import Vector3D from '../src/structures/vector/Vector3D';
import Ray from '../src/structures/ray/Ray';

describe('Vertex3D', () => {
  const vertexA = new Vertex3D(0, 0, 0);
  const vertexB = new Vertex3D(1, 2, 3);

  describe('getLengthTo', () => {
    it('returns the correct length between two vertices', () => {
      const length = vertexA.getLengthTo(vertexB);
      expect(length).toBe(Math.sqrt(14));
    });
  });

  describe('toVector', () => {
    it('returns a Vector3D object with the same values as the vertex', () => {
      const vector = vertexA.toVector();
      expect(vector.x).toBe(0);
      expect(vector.y).toBe(0);
      expect(vector.z).toBe(0);
    });
  });

  describe('isInsideRay', () => {
    const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(1, 0, 0));

    it('returns true for a vertex that is on the ray', () => {
      const vertexC = new Vertex3D(3, 0, 0);
      expect(vertexC.isInsideRay(ray)).toBe(true);
    });

    it('returns true for a vertex that is in front of the ray', () => {
      const vertexD = new Vertex3D(3, 1, 1);
      expect(vertexD.isInsideRay(ray)).toBe(true);
    });

    it('returns false for a vertex that is behind the ray', () => {
      const vertexE = new Vertex3D(-1, 1, 1);
      expect(vertexE.isInsideRay(ray)).toBe(false);
    });
  });
});
