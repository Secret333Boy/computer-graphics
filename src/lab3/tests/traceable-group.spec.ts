import Ray from '../../lab1/structures/ray/Ray';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';
import { DumbTraceableGroup } from '../../lab3/structures/traceable-groups/DumbTraceableGroup';
import { Bounds3D } from '../../lab4/structures/Bounds';
import { Axis } from '../../lab4/types/Axis';

class MockObject implements Traceable {
  public getIntersection(): Hit | null {
    return null;
  }
  public getWorldBounds() {
    return new Bounds3D({
      [Axis.X]: { min: 0, max: 0 },
      [Axis.Y]: { min: 0, max: 0 },
      [Axis.Z]: { min: 0, max: 0 },
    });
  }
}

describe('DumbTraceableGroup', () => {
  describe('getIntersection', () => {
    it('should return null for an empty group', () => {
      const group = new DumbTraceableGroup();
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1));

      expect(group.getIntersection(ray)).toBeNull();
    });

    it('should return null if no objects intersect the ray', () => {
      const group = new DumbTraceableGroup([
        new MockObject(),
        new MockObject(),
      ]);
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

        getWorldBounds: jest.fn().mockReturnValue({
          [Axis.X]: { min: 0, max: 0 },
          [Axis.Y]: { min: 0, max: 0 },
          [Axis.Z]: { min: 0, max: 0 },
        }),
      };

      const object2 = {
        getIntersection: jest.fn().mockReturnValueOnce({ t: 1 }),
        getWorldBounds: jest.fn().mockReturnValue({
          [Axis.X]: { min: 0, max: 0 },
          [Axis.Y]: { min: 0, max: 0 },
          [Axis.Z]: { min: 0, max: 0 },
        }),
      };

      const traceableGroup = new DumbTraceableGroup([object1, object2]);
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
        getWorldBounds: jest.fn().mockReturnValue({
          [Axis.X]: { min: 0, max: 0 },
          [Axis.Y]: { min: 0, max: 0 },
          [Axis.Z]: { min: 0, max: 0 },
        }),
      };

      const object2 = {
        getIntersection: jest.fn().mockReturnValueOnce(null),
        getWorldBounds: jest.fn().mockReturnValue({
          [Axis.X]: { min: 0, max: 0 },
          [Axis.Y]: { min: 0, max: 0 },
          [Axis.Z]: { min: 0, max: 0 },
        }),
      };

      const traceableGroup = new DumbTraceableGroup([object1, object2]);
      const hit = traceableGroup.getIntersection(ray);

      expect(object1.getIntersection).toHaveBeenCalledWith(ray);
      expect(object2.getIntersection).toHaveBeenCalledWith(ray);

      expect(hit).toBeNull();
    });
  });
});
