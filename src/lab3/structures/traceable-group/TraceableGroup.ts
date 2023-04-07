import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';

export default class TraceableGroup<T extends Traceable> implements Traceable {
  constructor(private traceableObjects: T[] = []) {}

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
