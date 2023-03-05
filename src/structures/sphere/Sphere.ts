import { Traceable } from '../../types/Traceable';
import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';
import Normal3D from '../normal/Normal';

export class Sphere implements Traceable {
  public readonly center: Vertex3D;
  public readonly radius: number;

  constructor(center: Vertex3D, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  public getIntersection(ray: Ray) {
    const a = ray.vector.dotProduct(ray.vector);
    // o - c vector
    const ocVector = ray.position.toVector().subtract(this.center.toVector());
    const b = 2 * ray.vector.dotProduct(ocVector);
    const c = ocVector.dotProduct(ocVector) - this.radius ** 2;
    const D = b * b - 4 * a * c;

    if (D < 0) {
      return null;
    }
    const t1 = (-b + Math.sqrt(D)) / (2 * a);
    const t2 = (-b - Math.sqrt(D)) / (2 * a);
    if (t1 < 0 && t2 < 0) {
      return null;
    }
    let t;
    if (t1 < 0) {
      t = t2;
    } else if (t2 < 0) {
      t = t1;
    } else {
      t = Math.min(t1, t2);
    }
    const pHit = ray.position.toVector().add(ray.vector.multiply(t));
    return {
      normal: new Normal3D(pHit.subtract(this.center.toVector())),
      pHit: pHit.toVertex3D(),
      t: t / ray.vector.length,
    };
  }
}
