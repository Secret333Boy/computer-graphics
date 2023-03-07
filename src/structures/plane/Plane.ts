import { Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane implements Traceable {
  public readonly normal: Normal3D;
  public readonly point: Vertex3D;

  constructor(vector: Vector3D, point: Vertex3D) {
    this.normal = new Normal3D(vector);
    this.point = point;
  }

  public getIntersection(
    ray: Ray
  ): { t: number; pHit: Vertex3D; normal: Normal3D } | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);

    if (Math.abs(denominator) < 0.0001) return null;

    //відстань від точки початку до перетина
    const t =
      this.point
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t < 0) return null;

    const pHit = ray.position.toVector().add(ray.vector.multiply(t));
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