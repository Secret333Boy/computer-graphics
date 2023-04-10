import Vector3D from '../vector/Vector3D';

export default class Normal3D {
  public readonly vector: Vector3D;
  constructor(vector: Vector3D) {
    this.vector = vector.normalize();
  }

  public rotate(angleX: number, angleY: number, angleZ: number): Normal3D {
    return new Normal3D(this.vector.rotate(angleX, angleY, angleZ));
  }

  public scale(x: number, y: number, z: number): Normal3D {
    return new Normal3D(this.vector.scale(x, y, z));
  }
}
