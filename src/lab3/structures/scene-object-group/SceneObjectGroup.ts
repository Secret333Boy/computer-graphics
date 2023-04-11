import { TraceableTransformable } from '../../types/Transformable';
import TraceableGroup from '../traceable-group/TraceableGroup';

export class TraceableTransformableGroup<T extends TraceableTransformable>
  extends TraceableGroup<T>
  implements TraceableTransformable
{
  public translate(x: number, y: number, z: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.translate(x, y, z);
    }
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.rotate(angleX, angleY, angleZ);
    }
  }

  public scale(x: number, y: number, z: number): void {
    for (const traceableObject of this.traceableObjects) {
      traceableObject.scale(x, y, z);
    }
  }
}
