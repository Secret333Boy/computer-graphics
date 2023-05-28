import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { TraceableTransformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import { GenericTraceableGroup } from '../traceable-group/TraceableGroup';

export class TraceableTransformableGroup<T extends TraceableTransformable>
  implements TraceableTransformable
{
  constructor(protected group: GenericTraceableGroup<T>) {}
  getIntersection(ray: Ray): Hit | null {
    return this.group.getIntersection(ray);
  }

  public transform(matrix: Matrix): void {
    for (const traceableObject of this.group.getTraceableObjects()) {
      traceableObject.transform(matrix);
    }
  }
}
