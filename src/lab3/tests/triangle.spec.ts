import Ray from '../../lab1/structures/ray/Ray';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Triangle from '../structures/triangle/Triangle';
import { expectVertex3DCloseTo } from '../../lab1/tests/helpers';
import { transformations } from '../structures/matrix/transformation-factories';

describe('Triangle', () => {
  const v1 = new Vertex3D(0, 0, 0);
  const v2 = new Vertex3D(1, 0, 0);
  const v3 = new Vertex3D(0, 1, 0);
  const triangle = new Triangle(v1, v2, v3);

  it('constructor sets vertices correctly', () => {
    expect(triangle.vertex1).toBe(v1);
    expect(triangle.vertex2).toBe(v2);
    expect(triangle.vertex3).toBe(v3);
  });

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

    it('should return null if the ray hits the back side of the triangle', () => {
      const ray = new Ray(new Vertex3D(0.5, 0.5, 1), new Vector3D(0, 0, 1));
      expect(triangle.getIntersection(ray)).toBeNull();
    });

    it('should return null if the ray intersects outside the triangle', () => {
      const ray = new Ray(new Vertex3D(2, 2, 1), new Vector3D(0, 0, -1));
      expect(triangle.getIntersection(ray)).toBeNull();
    });
  });

  describe('transforms', () => {
    let mutableTriangle: Triangle;
    beforeEach(() => {
      mutableTriangle = new Triangle(v1, v2, v3);
    });

    it('should translate the triangle', () => {
      mutableTriangle.transform(transformations.translate3d(1, 1, 1));
      expectVertex3DCloseTo(mutableTriangle.vertex1, new Vertex3D(1, 1, 1));
      expectVertex3DCloseTo(mutableTriangle.vertex2, new Vertex3D(2, 1, 1));
      expectVertex3DCloseTo(mutableTriangle.vertex3, new Vertex3D(1, 2, 1));
    });

    it('should scale the triangle', () => {
      mutableTriangle.transform(transformations.scale3d(2, 2, 2));
      expectVertex3DCloseTo(mutableTriangle.vertex1, new Vertex3D(0, 0, 0));
      expectVertex3DCloseTo(mutableTriangle.vertex2, new Vertex3D(2, 0, 0));
      expectVertex3DCloseTo(mutableTriangle.vertex3, new Vertex3D(0, 2, 0));
    });

    it('should rotate the triangle', () => {
      mutableTriangle.transform(transformations.rotate3d(0, 0, Math.PI / 2));
      expectVertex3DCloseTo(mutableTriangle.vertex1, new Vertex3D(0, 0, 0));
      expectVertex3DCloseTo(mutableTriangle.vertex2, new Vertex3D(0, -1, 0));
      expectVertex3DCloseTo(mutableTriangle.vertex3, new Vertex3D(1, 0, 0));
    });
  });
});
