import { Matrix } from '../structures/matrix/matrix';

export interface Transformable {
  transform: (matrix: Matrix) => void;
}
