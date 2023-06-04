import { Traceable } from '../../../lab1/types/Traceable';
import { Transformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import { TransformableGroupFactory } from '../transformable-groups/GenericTransformableGroup';

// mesh is just a container for primitives, not Traceable, it shouldn't implement rendering logic (i.e. define how to
// traverse child triangles etc)
export default class Mesh<
  T extends Traceable & Transformable = Traceable & Transformable
> implements Transformable
{
  private transformableGroup: Transformable;
  public primitives: T[];
  constructor(primitives: T[], transformableGroup: TransformableGroupFactory) {
    this.transformableGroup = transformableGroup(primitives);
    this.primitives = primitives;
  }
  public transform(matrix: Matrix): void {
    this.transformableGroup.transform(matrix);
  }
}
