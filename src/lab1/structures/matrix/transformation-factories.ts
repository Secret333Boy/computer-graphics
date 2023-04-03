import Vector3D from "../vector/Vector3D";
import { Matrix } from "./matrix";

export const transformations = {
    // transformation in 3d space
    translate3d: (x: number, y: number, z: number): Matrix => {
        return new Matrix([
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
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

} as const;

export const transformVector = (vector: Vector3D, transformation: Matrix): Vector3D => {
    return transformation.multiplyWithVector(vector);
}