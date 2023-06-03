import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';

export abstract class GenericTraceableGroup<T extends Traceable>
  implements Traceable
{
  constructor(protected traceableObjects: T[] = []) {}

  public abstract getIntersection(ray: Ray): Hit | null;

  public getTraceableObjects(): T[] {
    return this.traceableObjects;
  }
}

export class DumbTraceableGroup<
  T extends Traceable
> extends GenericTraceableGroup<T> {
  public getIntersection(ray: Ray): Hit | null {
    let closestHit: Hit | null = null;
    for (const traceableObject of this.traceableObjects) {
      const currentHit = traceableObject.getIntersection(ray);

      if (!currentHit) continue;

      closestHit = closestHit
        ? findCloserHit(currentHit, closestHit)
        : currentHit;
    }

    return closestHit;
  }
}
