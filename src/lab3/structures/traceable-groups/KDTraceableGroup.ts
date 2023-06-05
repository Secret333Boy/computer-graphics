import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { IKDTreeBuilder, KDNode } from '../../../lab4/structures/KDTree';
import { PreRenderHookable } from '../../../lab4/types/PreRenderHookable';
import {
  GenericTraceableGroup,
  ShadowTraceableGroupFactory,
  TraceableGroupFactory,
} from './GenericTraceableGroup';

export class KDTraceableGroup<T extends Traceable = Traceable>
  extends GenericTraceableGroup<T>
  implements PreRenderHookable
{
  private bounds: Bounds3D | undefined;
  private root: KDNode | undefined;
  constructor(traceableObjects: T[] = [], private builder: IKDTreeBuilder<T>) {
    super(traceableObjects);
  }
  public getWorldBounds(): Bounds3D {
    if (!this.bounds) throw new Error('KDTree not built');
    return this.bounds;
  }

  private build(): void {
    this.root = this.builder.build({
      objects: this.traceableObjects,
    });
    // getting bounds from KDTree comes naturally, as they are computed during building
    this.bounds = this.root.getWorldBounds();
  }

  public onPreRender(): void {
    if (!this.root) {
      this.build();
    }
  }

  public getIntersection(ray: Ray): Hit | null {
    return this.genericGetIntersection(ray, false);
  }

  public genericGetIntersection(ray: Ray, lookForClosest: boolean): Hit | null {
    if (!this.root) throw new Error('KDTree not built');
    return this.root.getIntersection(ray, lookForClosest);
  }
}

export class ShadowKDTraceableGroup<
  T extends Traceable = Traceable
> extends GenericTraceableGroup<T> {
  constructor(private baseGroup: KDTraceableGroup<T>) {
    super(baseGroup.getTraceableObjects());
  }

  public getWorldBounds(): Bounds3D {
    return this.baseGroup.getWorldBounds();
  }

  public getIntersection(ray: Ray): Hit | null {
    return this.baseGroup.genericGetIntersection(ray, true);
  }
}

export const closestKdTraceableGroupFactory: ShadowTraceableGroupFactory<
  GenericTraceableGroup,
  KDTraceableGroup
> = (objects: Traceable[], kdTraceableGroup: KDTraceableGroup<Traceable>) =>
  new ShadowKDTraceableGroup(kdTraceableGroup);
