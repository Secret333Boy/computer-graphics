import Ray from '../../lab1/structures/ray/Ray';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';
import TraceableGroup from '../structures/traceable-group/TraceableGroup';

class MockObject implements Traceable {
  public getIntersection(): Hit | null {
    return null;
  }
}

describe('TraceableGroup', () => {
  describe('getIntersection', () => {
    it('should return null for an empty group', () => {
      const group = new TraceableGroup();
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1));

      expect(group.getIntersection(ray)).toBeNull();
    });

    it('should return null if no objects intersect the ray', () => {
      const group = new TraceableGroup([new MockObject(), new MockObject()]);
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1));

      expect(group.getIntersection(ray)).toBeNull();
    });

    it('should return the closest hit among multiple objects in the group', () => {
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, -1));

      const object1 = {
        getIntersection: jest
          .fn()
          .mockReturnValueOnce(null)
          .mockReturnValueOnce({ t: 2 }),
      };

      const object2 = {
        getIntersection: jest.fn().mockReturnValueOnce({ t: 1 }),
      };

      const traceableGroup = new TraceableGroup([object1, object2]);
      const hit = traceableGroup.getIntersection(ray);

      expect(object1.getIntersection).toHaveBeenCalledWith(ray);
      expect(object2.getIntersection).toHaveBeenCalledWith(ray);

      expect(hit).not.toBeNull();
      expect(hit?.t).toBe(1);
    });

    it('should return null when all objects miss the ray', () => {
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, -1));

      const object1 = {
        getIntersection: jest.fn().mockReturnValueOnce(null),
      };

      const object2 = {
        getIntersection: jest.fn().mockReturnValueOnce(null),
      };

      const traceableGroup = new TraceableGroup([object1, object2]);
      const hit = traceableGroup.getIntersection(ray);

      expect(object1.getIntersection).toHaveBeenCalledWith(ray);
      expect(object2.getIntersection).toHaveBeenCalledWith(ray);

      expect(hit).toBeNull();
    });
  });
});
