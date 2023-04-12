import Vector3D from '../structures/vector/Vector3D';
import Vertex3D from '../structures/vertex/Vertex3D';
import Plane from '../structures/plane/Plane';
import Ray from '../structures/ray/Ray';
import Normal3D from '../structures/normal/Normal';
import { expectVector3DCloseTo, expectVertex3DCloseTo } from './helpers';

describe('Plane', () => {
  const normal = new Vector3D(0, 0, -1);
  const point = new Vertex3D(0, 0, 0);
  const plane = new Plane(point, normal);

  test('constructor initializes vector and point', () => {
    expect(plane.normal.vector).toEqual(new Vector3D(0, 0, -1));
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

  describe('transforms', () => {
    let mutablPlane: Plane;
    beforeEach(() => {
      mutablPlane = new Plane(point, normal);
    });

    it('should translate the plane', () => {
      mutablPlane.translate(1, 1, 1);
      expectVertex3DCloseTo(mutablPlane.vertex, new Vertex3D(1, 1, 1));
    });

    it('should scale the plane', () => {
      mutablPlane.scale(2, 2, 2);
      expectVertex3DCloseTo(mutablPlane.vertex, new Vertex3D(0, 0, 0));
    });

    it('should rotate the plane', () => {
      mutablPlane.rotate(0, Math.PI / 2, 0);
      expectVertex3DCloseTo(mutablPlane.vertex, new Vertex3D(0, 0, 0));
      expectVector3DCloseTo(mutablPlane.normal.vector, new Vector3D(1, 0, 0));
    });
  });
});
