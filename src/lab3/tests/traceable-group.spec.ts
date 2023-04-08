import Normal3D from '../../lab1/structures/normal/Normal';
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

    it('should return the closest intersection if multiple objects intersect the ray', () => {
      const object1: Traceable = {
        getIntersection: () => ({
          t: 1,
          vertex: new Vertex3D(0, 0, 0),
          normal: new Normal3D(new Vector3D(0, 0, 1)),
        }),
      };
      const object2: Traceable = {
        getIntersection: () => ({
          t: 2,
          vertex: new Vertex3D(0, 0, 0),
          normal: new Normal3D(new Vector3D(0, 0, 1)),
        }),
      };
      const group = new TraceableGroup([object1, object2]);
      const ray = new Ray(new Vertex3D(0, 0, 0), new Vector3D(0, 0, 1));

      expect(group.getIntersection(ray)).toEqual({
        t: 1,
        vertex: new Vertex3D(0, 0, 0),
        normal: new Normal3D(new Vector3D(0, 0, 1)),
      });
    });
  });
});
