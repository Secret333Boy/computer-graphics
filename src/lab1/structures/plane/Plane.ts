import { TraceableTransformable } from '../../../lab3/types/Transformable';
import { Hit } from '../../types/Hit';
import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane implements TraceableTransformable {
  public normal: Normal3D;
  public vertex: Vertex3D;

  constructor(vertex: Vertex3D, normalVector: Vector3D) {
    this.normal = new Normal3D(normalVector);
    this.vertex = vertex;
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    this.normal = this.normal.rotate(angleX, angleY, angleZ);
    this.vertex = this.vertex.rotate(angleX, angleY, angleZ);
  }

  public translate(x: number, y: number, z: number): void {
    this.vertex = this.vertex.translate(x, y, z);
  }

  public scale(x: number, y: number, z: number): void {
    this.vertex = this.vertex.scale(x, y, z);
  }

  public getIntersection(ray: Ray): Hit | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);

    if (Math.abs(denominator) === 0) return null;

    const t =
      this.vertex
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t <= 0) return null;

    const pHit = ray.position
      .toVector()
      .add(ray.vector.multiply(t))
      .toVertex3D();

    return {
      normal: new Normal3D(
        denominator < 0 ? this.normal.vector.multiply(-1) : this.normal.vector
      ),
      vertex: pHit,
      t,
      object: this,
    };
  }
}
