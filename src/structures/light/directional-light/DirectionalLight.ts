import Vector3D from '../../vector/Vector3D';

export class DirectionalLight {
  public readonly vector: Vector3D;
  constructor(vector: Vector3D) {
    this.vector = vector.normalize();
  }
}
