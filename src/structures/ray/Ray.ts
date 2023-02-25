import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Ray {
  public readonly position: Vertex3D;
  public readonly vector: Vector3D;

  constructor(position: Vertex3D, vector: Vector3D) {
    this.position = position;
    this.vector = vector;
  }

  public hasInside(vertex: Vertex3D): boolean {
    // position + vector * t = vertex => solve for t; t = ((vertex - position) * vector) / (vector * vector)
    const t =
      vertex
        .toVector()
        .subtract(this.position.toVector())
        .dotProduct(this.vector) / this.vector.dotProduct(this.vector);

    return t >= 0;
  }
}
