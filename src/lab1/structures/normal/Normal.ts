import { Matrix } from '../../../lab3/structures/matrix/matrix';
import { transformVector } from '../../../lab3/structures/matrix/transformation-factories';
import Vector3D from '../vector/Vector3D';

export default class Normal3D {
  public readonly vector: Vector3D;
  constructor(vector: Vector3D) {
    this.vector = vector.normalize();
  }

  public getTranformed(matrix: Matrix): Normal3D {
    return new Normal3D(transformVector(this.vector, matrix));
  }
}
