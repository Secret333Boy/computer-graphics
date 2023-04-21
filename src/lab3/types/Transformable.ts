import { Traceable } from '../../lab1/types/Traceable';
import { Matrix } from '../structures/matrix/matrix';

export interface Transformable {
  transform: (matrix: Matrix) => void;
}

export interface TraceableTransformable extends Transformable, Traceable {}
