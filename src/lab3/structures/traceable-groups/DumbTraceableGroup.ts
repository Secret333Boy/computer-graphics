import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { findCloserHit } from '../../../lab1/utils/findCloserHit';
import { Bounds3D, unionAllBounds3D } from '../../../lab4/structures/Bounds';
import {
  AdditionalIntersectionParams,
  GenericTraceableGroup,
} from './GenericTraceableGroup';

export class DumbTraceableGroup<
  T extends Traceable = Traceable
> extends GenericTraceableGroup<T> {
  private bounds: Bounds3D;
  constructor(traceableObjects: T[] = []) {
    super(traceableObjects);
    this.bounds = unionAllBounds3D(traceableObjects).union;
  }
  public getWorldBounds(): Bounds3D {
    return this.bounds;
  }

  public getIntersection(
    ray: Ray,
    {
      avoidPrimitives = [],
      lookForClosest = true,
    }: AdditionalIntersectionParams<T> = {}
  ): Hit | null {
    let closestHit: Hit | null = null;
    for (const traceableObject of this.traceableObjects) {
      if (avoidPrimitives.includes(traceableObject)) continue;
      const currentHit = traceableObject.getIntersection(ray);
      if (!currentHit) continue;
      if (!lookForClosest) return currentHit;
      closestHit = closestHit
        ? findCloserHit(currentHit, closestHit)
        : currentHit;
    }

    return closestHit;
  }
}
