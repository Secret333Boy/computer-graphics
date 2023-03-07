import Normal3D from '../src/structures/normal/Normal';
import Vertex3D from '../src/structures/vertex/Vertex3D';
import Disk from '../src/structures/disk/Disk';
import Ray from '../src/structures/ray/Ray';
import Vector3D from '../src/structures/vector/Vector3D';

describe('Disk', () => {
  const center = new Vertex3D(0, 0, 0);
  const normal = new Normal3D(new Vector3D(0, 0, 1));
  const radius = 1;
  const disk = new Disk(center, normal, radius);

  describe('getIntersection', () => {
    it('returns null if the ray is parallel to the disk', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(0, 1, 0));
      expect(disk.getIntersection(ray)).toBeNull();
    });

    it('returns null if the ray does not hit the disk', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(1, 0, 0));
      expect(disk.getIntersection(ray)).toBeNull();
    });

    it('returns the correct intersection info if the ray hits the disk', () => {
      const ray = new Ray(new Vertex3D(0, 0, 1), new Vector3D(0, 1, 0));
      const intersection = disk.getIntersection(ray);
      expect(intersection).not.toBeNull();
      expect(intersection!.t).toBe(1);
      expect(intersection!.pHit).toEqual(new Vertex3D(0, 1, 0));
      expect(intersection!.normal).toEqual(normal);
    });
  });
});
