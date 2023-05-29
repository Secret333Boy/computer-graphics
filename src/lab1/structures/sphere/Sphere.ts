import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';
import Normal3D from '../normal/Normal';
import { Hit } from '../../types/Hit';
import { Matrix } from '../../../lab3/structures/matrix/matrix';
import {
  transformScalar,
  transformVertex,
} from '../../../lab3/structures/matrix/transformation-factories';
import { Boundable } from '../../../lab4/types/Boundable';
import Vector3D from '../vector/Vector3D';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { Axis } from '../../../lab4/types/Axis';
import { Traceable } from '../../types/Traceable';
import { Transformable } from '../../../lab3/types/Transformable';

export class Sphere implements Traceable, Transformable, Boundable {
  public center: Vertex3D;
  public radius: number;

  constructor(center: Vertex3D, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  public transform(matrix: Matrix): void {
    this.center = transformVertex(this.center, matrix);
    this.radius = transformScalar(this.radius, matrix);
  }

  public getWorldBounds(): Bounds3D {
    const min = this.center
      .toVector()
      .subtract(new Vector3D(this.radius, this.radius, this.radius));
    const max = this.center
      .toVector()
      .add(new Vector3D(this.radius, this.radius, this.radius));

    return new Bounds3D({
      [Axis.X]: {
        min: min.x,
        max: max.x,
      },
      [Axis.Y]: {
        min: min.y,
        max: max.y,
      },
      [Axis.Z]: {
        min: min.z,
        max: max.z,
      },
    });
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
    if (t <= 0) return null;
    const pHit = ray.position.toVector().add(ray.vector.multiply(t));
    return {
      normal: new Normal3D(this.center.toVector().subtract(pHit)),
      vertex: pHit.toVertex3D(),
      t,
      object: this,
    };
  }
}
