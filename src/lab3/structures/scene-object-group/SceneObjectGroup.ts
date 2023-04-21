import { TraceableTransformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import TraceableGroup from '../traceable-group/TraceableGroup';

export class TraceableTransformableGroup<T extends TraceableTransformable>
  extends TraceableGroup<T>
  implements TraceableTransformable
{
  public transform(matrix: Matrix): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.transform(matrix);
    }
  }
}
