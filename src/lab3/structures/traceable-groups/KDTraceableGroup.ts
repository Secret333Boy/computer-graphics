import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { IKDTreeBuilder, KDNode } from '../../../lab4/structures/KDTree';
import { GenericTraceableGroup } from './GenericTraceableGroup';

export class KDTraceableGroup<
  T extends Traceable = Traceable
> extends GenericTraceableGroup<T> {
  private bounds: Bounds3D;
  private root: KDNode;
  constructor(traceableObjects: T[] = [], builder: IKDTreeBuilder<T>) {
    super(traceableObjects);
    this.root = builder.build({
      objects: traceableObjects,
    });
    // getting bounds from KDTree comes naturally, as they are computed during building
    this.bounds = this.root.getWorldBounds();
  }
  public getWorldBounds(): Bounds3D {
    return this.bounds;
  }

  public getIntersection(ray: Ray): Hit | null {
    return this.root.getIntersection(ray);
  }
}
