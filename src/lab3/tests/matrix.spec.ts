import { Matrix } from '../structures/matrix/matrix';
import Vector3D from '../../lab1/structures/vector/Vector3D';

describe('matrix', () => {
  it('should be able to multiply two matrices', () => {
    const matrix1 = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const matrix2 = new Matrix([
      [5, 6],
      [7, 8],
    ]);
    const result = matrix1.multiply(matrix2);
    expect(result).toEqual(
      new Matrix([
        [19, 22],
        [43, 50],
      ])
    );
  });
  it('should convert a vector to a matrix', () => {
    const vector = new Vector3D(1, 2, 3);
    const matrix = Matrix.fromVector(vector);
    expect(matrix).toEqual(new Matrix([[1], [2], [3]]));
  });
  it('should convert a matrix to a vector', () => {
    const matrix = new Matrix([[1], [2], [3]]);
    const vector = matrix.toVector();
    expect(vector).toEqual(new Vector3D(1, 2, 3));
  });
  it('should throw an error if the dimensions of the matrices are not compatible', () => {
    const matrix1 = new Matrix([
      [1, 2],
      [3, 4],
    ]);
    const matrix2 = new Matrix([
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
    expect(() => matrix1.multiply(matrix2)).toThrow();
  });
});
