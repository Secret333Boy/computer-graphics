import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';
import Normal3D from '../normal/Normal';
import { Hit } from '../../types/Hit';
import { TraceableTransformable } from '../../../lab3/types/Transformable';

export class Sphere implements TraceableTransformable {
  public center: Vertex3D;
  public radius: number;

  constructor(center: Vertex3D, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  public translate(x: number, y: number, z: number): void {
    this.center = this.center.translate(x, y, z);
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    this.center = this.center.rotate(angleX, angleY, angleZ);
  }

  public scale(x: number, y: number, z: number): void {
    this.center = this.center.scale(x, y, z);
    this.radius *= Math.max(x, y, z);
  }

  public getIntersection(ray: Ray): Hit | null {
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
    // there are two options, t1 and t2 both < 0 which means ray hits the sphere but from behind,
    // or just t2 < 0 which means ray hits the sphere but starts inside it;
    // in both ways let's consider it as no hit
    if (t2 < 0) {
      return null;
    }
    const t = Math.min(t1, t2);
    const pHit = ray.position.toVector().add(ray.vector.multiply(t));
    return {
      normal: new Normal3D(this.center.toVector().subtract(pHit)),
      vertex: pHit.toVertex3D(),
      t,
    };
  }
}
