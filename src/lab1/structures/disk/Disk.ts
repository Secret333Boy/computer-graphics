import { Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import { Hit } from '../../types/Hit';

export default class Disk implements Traceable {
  public readonly center: Vertex3D;
  public readonly normal: Normal3D;
  public readonly radius: number;

  constructor(center: Vertex3D, normalVector: Vector3D, radius: number) {
    this.center = center;
    this.normal = new Normal3D(normalVector);
    this.radius = radius;
  }

  public getIntersection(ray: Ray): Hit | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);
    if (Math.abs(denominator) === 0) return null;

    const t =
      this.center
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t < 0) return null;

    const pHit = ray.position
      .toVector()
      .add(ray.vector.multiply(t))
      .toVertex3D();
    const distanceToCenter = pHit
      .toVector()
      .subtract(this.center.toVector()).length;

    if (distanceToCenter > this.radius) return null;

    return {
      // flip this.normal if it's pointing in the opposite direction of the ray
      normal: new Normal3D(
        denominator < 0 ? this.normal.vector.multiply(-1) : this.normal.vector
      ),
      vertex: pHit,
      t,
    };
  }
}
