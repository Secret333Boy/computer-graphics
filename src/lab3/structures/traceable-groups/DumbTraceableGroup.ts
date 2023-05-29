import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';
import { GenericTraceableGroup } from './GenericTraceableGroup';

export class DumbTraceableGroup<
  T extends Traceable = Traceable
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
