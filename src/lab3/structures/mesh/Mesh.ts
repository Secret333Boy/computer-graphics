import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Traceable } from '../../../lab1/types/Traceable';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { Transformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import { TraceableGroupFactory } from '../traceable-groups/GenericTraceableGroup';
import { TransformableGroupFactory } from '../transformable-groups/GenericTransformableGroup';

export default class Mesh<
  T extends Traceable & Transformable = Traceable & Transformable
> implements Traceable, Transformable
{
  private traceableGroup: Traceable;
  private transformableGroup: Transformable;
  constructor(
    primitives: T[],
    traceableGroupFactory: TraceableGroupFactory,
    transformableGroup: TransformableGroupFactory
  ) {
    this.traceableGroup = traceableGroupFactory(primitives);
    this.transformableGroup = transformableGroup(primitives);
  }
  public getWorldBounds(): Bounds3D {
    return this.traceableGroup.getWorldBounds();
  }

  public getIntersection(ray: Ray): Hit | null {
    return this.traceableGroup.getIntersection(ray);
  }
  public transform(matrix: Matrix): void {
    this.transformableGroup.transform(matrix);
  }
}
