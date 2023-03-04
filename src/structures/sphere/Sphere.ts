import { Traceable } from '../../types/Traceable';
import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';

export class Sphere implements Traceable {
  public readonly center: Vertex3D;
  public readonly radius: number;

  constructor(center: Vertex3D, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  public isIntersecting(ray: Ray): boolean {
    const a = ray.vector.dotProduct(ray.vector);
    // o - c vector
    const ocVector = ray.position.toVector().subtract(this.center.toVector());
    //const b2 =
      //4 * ray.vector.dotProduct(ray.vector) * ocVector.dotProduct(ocVector);
    const b = 2 * ray.vector.dotProduct(ocVector);
    const c = ocVector.dotProduct(ocVector) - this.radius ** 2;
    const D = b * b - 4 * a * c
    //const D = b2 - 4 * a * c;
    if (D < 0) {
      return false;
    } else if (D === 0) {
      const t = -b / (2 * a);
      return t >= 0;
    } else {
      const t1 = (-b + Math.sqrt(D)) / (2 * a);
      const t2 = (-b - Math.sqrt(D)) / (2 * a);
      return t1 >= 0 || t2 >= 0;
    }
  }
}
