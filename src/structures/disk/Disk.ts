import { HitInfo, Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';

export default class Disk implements Traceable {
  public readonly center: Vertex3D;
  public readonly normal: Normal3D;
  public readonly radius: number;

  constructor(center: Vertex3D, normal: Normal3D, radius: number) {
    this.center = center;
    this.normal = normal;
    this.radius = radius;
  }

  public getIntersection(
    ray: Ray
  ): { t: number; pHit: Vertex3D; normal: Normal3D } | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);
    if (Math.abs(denominator) < 0.0001) return null;

    const t =
      this.center
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t < 0) return null;

    const pHit = ray.position.toVector().add(ray.vector.multiply(t));
    const distanceToCenter = pHit.subtract(this.center.toVector()).length;

    if (distanceToCenter > this.radius) return null;

    return {
      //нормаль
      normal: this.normal,
      //точка перетину
      pHit: pHit.toVertex3D(),
      //відстанб від початку променя до точки перетину
      t: t,
    };
  }
}
