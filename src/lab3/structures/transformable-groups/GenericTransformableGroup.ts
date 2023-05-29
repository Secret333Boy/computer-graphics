import { Transformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';

export abstract class GenericTransformableGroup<
  T extends Transformable = Transformable
> implements Transformable
{
  constructor(protected objects: T[]) {}
  public abstract transform(matrix: Matrix): void;
}

export type TransformableGroupFactory<T extends Transformable = Transformable> =
  (transformableObjects: T[]) => GenericTransformableGroup<T>;
