import Vector3D from '../../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../../lab1/structures/vertex/Vertex3D';

export class Matrix {
  private arr: number[][];
  constructor(arr: number[][]) {
    this.arr = arr;
  }

  public at(row: number, col: number): number {
    return this.arr[row][col];
  }

  public multiply(other: Matrix): Matrix {
    // check for dimensions
    if (this.arr[0].length !== other.arr.length) {
      throw new Error('Dimensions of matrices are not compatible');
    }
    const result = new Matrix([]);
    for (let i = 0; i < this.arr.length; i++) {
      result.arr[i] = [];
      for (let j = 0; j < other.arr[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < this.arr[0].length; k++) {
          sum += this.arr[i][k] * other.arr[k][j];
        }
        result.arr[i][j] = sum;
      }
    }
    return result;
  }

  public static fromVector(vector: Vector3D): Matrix {
    return new Matrix([[vector.x], [vector.y], [vector.z]]);
  }

  public toVector(): Vector3D {
    return new Vector3D(this.arr[0][0], this.arr[1][0], this.arr[2][0]);
  }

  public toVertex3D(): Vertex3D {
    return new Vertex3D(this.arr[0][0], this.arr[1][0], this.arr[2][0]);
  }
}
