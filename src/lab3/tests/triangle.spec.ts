import Ray from '../../lab1/structures/ray/Ray';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Triangle from '../structures/triangle/Triangle';

describe('Triangle', () => {
  const v1 = new Vertex3D(0, 0, 0);
  const v2 = new Vertex3D(1, 0, 0);
  const v3 = new Vertex3D(0, 1, 0);
  const triangle = new Triangle(v1, v2, v3);

  describe('getIntersection', () => {
    it('should return null if the ray does not intersect the triangle', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(0, 0, 1));
      expect(triangle.getIntersection(ray)).toBeNull();
    });

    it('should return the correct hit if the ray intersects the triangle', () => {
      const ray = new Ray(new Vertex3D(0.5, 0.5, 1), new Vector3D(0, 0, -1));
      const hit = triangle.getIntersection(ray);
      expect(hit).not.toBeNull();
      expect(hit?.t).toBe(1);
      expect(hit?.vertex.x).toBe(0.5);
      expect(hit?.vertex.y).toBe(0.5);
      expect(hit?.vertex.z).toBe(0);
    });

    it('should return the correct hit if the ray starts inside the triangle', () => {
      const ray = new Ray(new Vertex3D(0.5, 0.5, 0), new Vector3D(0, 0, -1));
      const hit = triangle.getIntersection(ray);
      expect(hit).not.toBeNull();
      expect(hit?.t).toBe(0);
      expect(hit?.vertex.x).toBe(0.5);
      expect(hit?.vertex.y).toBe(0.5);
      expect(hit?.vertex.z).toBe(0);
    });
  });
});
