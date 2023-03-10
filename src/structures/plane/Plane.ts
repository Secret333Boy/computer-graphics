import { Hit } from '../../types/Hit';
import { Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane implements Traceable {
  public readonly normal: Normal3D;
  public readonly vertex: Vertex3D;

  constructor(vertex: Vertex3D, normalVector: Vector3D) {
    this.normal = new Normal3D(normalVector);
    this.vertex = vertex;
  }

  public getIntersection(ray: Ray): Hit | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);

    if (Math.abs(denominator) === 0) return null;

    const t =
      this.vertex
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t < 0) return null;

    const pHit = ray.position
      .toVector()
      .add(ray.vector.multiply(t))
      .toVertex3D();

    return {
      normal: new Normal3D(
        denominator < 0 ? this.normal.vector : this.normal.vector.multiply(-1)
      ),
      vertex: pHit,
      t,
    };
  }
}
