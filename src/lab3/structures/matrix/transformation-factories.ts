import Vector3D from '../../../lab1/structures/vector/Vector3D';
import Vertex3D from '../../../lab1/structures/vertex/Vertex3D';
import { Matrix } from './matrix';

export const transformations = {
  // transformation in 3d space;
  // you can refer to https://www.brainvoyager.com/bv/doc/UsersGuide/CoordsAndTransforms/SpatialTransformationMatrices.html
  // and to this vid (more theoretical) https://www.youtube.com/watch?v=kYB8IZa5AuE
  translate3d: (x: number, y: number, z: number): Matrix => {
    return new Matrix([
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      // the last row is always this
      [0, 0, 0, 1],
    ]);
  },
  scale3d: (x: number, y: number, z: number): Matrix => {
    return new Matrix([
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1],
    ]);
  },
  // positive rotation angles cause a counterclockwise rotation about an axis as one looks inward from a point on the positive axis toward the origin
  rotate3dX: (angle: number): Matrix => {
    return new Matrix([
      [1, 0, 0, 0],
      [0, Math.cos(angle), Math.sin(angle), 0],
      [0, -Math.sin(angle), Math.cos(angle), 0],
      [0, 0, 0, 1],
    ]);
  },
  rotate3dY: (angle: number): Matrix => {
    return new Matrix([
      [Math.cos(angle), 0, -Math.sin(angle), 0],
      [0, 1, 0, 0],
      [Math.sin(angle), 0, Math.cos(angle), 0],
      [0, 0, 0, 1],
    ]);
  },
  rotate3dZ: (angle: number): Matrix => {
    return new Matrix([
      [Math.cos(angle), Math.sin(angle), 0, 0],
      [-Math.sin(angle), Math.cos(angle), 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  },
  // here you pass transformations as if they would occur in order, i.e. first arg matrix is applied first, second - second and so on
  compose: (...matrices: Matrix[]): Matrix => {
    // matrices have to be multiplied in reverse order to grant the intuitive approach above
    return matrices.reduceRight(
      (acc, matrix) => {
        return acc.multiply(matrix);
      },
      // indentity matrix
      new Matrix([
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ])
    );
  },
  rotate3d: (angleX: number, angleY: number, angleZ: number): Matrix => {
    return transformations.compose(
      transformations.rotate3dX(angleX),
      transformations.rotate3dY(angleY),
      transformations.rotate3dZ(angleZ)
    );
  },
} as const;

export const transformVertex = (
  vector: Vertex3D,
  transformation: Matrix
): Vertex3D => {
  const vectorMatrix = new Matrix([
    [vector.x],
    [vector.y],
    [vector.z],
    // for translation
    [1],
  ]);
  return transformation.multiply(vectorMatrix).toVertex3D();
};

export const transformVector = (
  vector: Vector3D,
  transformation: Matrix
): Vector3D => {
  const vectorMatrix = new Matrix([
    [vector.x],
    [vector.y],
    [vector.z],
    // for translation
    [0],
  ]);
  return transformation.multiply(vectorMatrix).toVector();
};

export const transformScalar = (
  scalar: number,
  transformation: Matrix
): number => {
  const scalarMatrix = new Matrix([[scalar], [0], [0], [0]]);
  return transformation.multiply(scalarMatrix).at(0, 0);
};
