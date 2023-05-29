import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { Bounds3D } from '../../../lab4/structures/Bounds';

export abstract class GenericTraceableGroup<T extends Traceable = Traceable>
  implements Traceable
{
  constructor(protected traceableObjects: T[] = []) {}

  public abstract getIntersection(ray: Ray): Hit | null;
  public abstract getWorldBounds(): Bounds3D;
  public getTraceableObjects(): T[] {
    return this.traceableObjects;
  }
}

export type TraceableGroupFactory<T extends Traceable = Traceable> = (
  traceableObjects: T[]
) => GenericTraceableGroup<T>;
