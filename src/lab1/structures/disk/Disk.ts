import Normal3D from '../normal/Normal';
import Vertex3D from '../vertex/Vertex3D';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import { Hit } from '../../types/Hit';
import { Matrix } from '../../../lab3/structures/matrix/matrix';
import { transformVertex } from '../../../lab3/structures/matrix/transformation-factories';
import { Boundable } from '../../../lab4/types/Boundable';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { Axis } from '../../../lab4/types/Axis';
import { Traceable } from '../../types/Traceable';
import { Transformable } from '../../../lab3/types/Transformable';

export default class Disk implements Traceable, Transformable, Boundable {
  public center: Vertex3D;
  public normal: Normal3D;
  public radius: number;

  constructor(center: Vertex3D, normalVector: Vector3D, radius: number) {
    this.center = center;
    this.normal = new Normal3D(normalVector);
    this.radius = radius;
  }

  // courtesy of https://gist.github.com/fahickman/8b05e7e43bf0798b3709
  public getWorldBounds(): Bounds3D {
    const normal = this.normal.vector;
    const x2 = normal.x * normal.x;
    const y2 = normal.y * normal.y;
    const z2 = normal.z * normal.z;

    const half = new Vector3D(
      this.radius * Math.sqrt(y2 + z2),
      this.radius * Math.sqrt(z2 + x2),
      this.radius * Math.sqrt(x2 + y2)
    );

    const min = this.center.toVector().subtract(half);
    const max = this.center.toVector().add(half);

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

  public transform(matrix: Matrix): void {
    this.center = transformVertex(this.center, matrix);
    this.normal = this.normal.getTranformed(matrix);
  }

  public getIntersection(ray: Ray): Hit | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);
    if (Math.abs(denominator) === 0) return null;

    const t =
      this.center
        .toVector()
        .subtract(ray.position.toVector())
        .dotProduct(this.normal.vector) / denominator;

    if (t <= 0) return null;

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
      object: this,
      color: { r: 1, g: 1, b: 1 },
    };
  }
}
