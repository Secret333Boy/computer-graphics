import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { Bounds3D } from '../../../lab4/structures/Bounds';

export type AdditionalIntersectionParams<T extends Traceable = Traceable> = {
  avoidPrimitives?: T[];
  lookForClosest?: boolean;
};

export abstract class GenericTraceableGroup<T extends Traceable = Traceable> {
  constructor(protected traceableObjects: T[] = []) {}

  public abstract getIntersection(
    ray: Ray,
    options?: AdditionalIntersectionParams<T>
  ): Hit | null;
  public abstract getWorldBounds(): Bounds3D;
  public getTraceableObjects(): T[] {
    return this.traceableObjects;
  }
}

export type TraceableGroupFactory<
  TFactory extends GenericTraceableGroup = GenericTraceableGroup
> = (traceableObjects: Traceable[]) => TFactory;
