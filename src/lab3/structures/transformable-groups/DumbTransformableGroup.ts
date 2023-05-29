import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Transformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import { GenericTransformableGroup } from './GenericTransformableGroup';

export class DumbTransformableGroup<
  T extends Transformable
> extends GenericTransformableGroup<T> {
  public transform(matrix: Matrix): void {
    for (const traceableObject of this.objects) {
      traceableObject.transform(matrix);
    }
  }
}
