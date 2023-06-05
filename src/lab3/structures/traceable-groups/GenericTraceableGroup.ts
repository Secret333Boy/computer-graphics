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

export type TraceableGroupFactory<
  TFactory extends GenericTraceableGroup = GenericTraceableGroup
> = (traceableObjects: Traceable[]) => TFactory;

export type ShadowTraceableGroupFactory<
  TFactory extends GenericTraceableGroup = GenericTraceableGroup,
  TBaseGroup extends GenericTraceableGroup = GenericTraceableGroup
> = (
  traceableObjects: Traceable[],
  baseTraceableGroup: TBaseGroup
) => TFactory;
