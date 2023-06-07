import { Matrix } from '../../../lab3/structures/matrix/matrix';
import { transformVertex } from '../../../lab3/structures/matrix/transformation-factories';
import { Transformable } from '../../../lab3/types/Transformable';
import { Bounds3D } from '../../../lab4/structures/Bounds';
import { Axis } from '../../../lab4/types/Axis';
import { Boundable } from '../../../lab4/types/Boundable';
import { Hit } from '../../types/Hit';
import { Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane implements Traceable, Transformable, Boundable {
  public normal: Normal3D;
  public vertex: Vertex3D;

  constructor(vertex: Vertex3D, normalVector: Vector3D) {
    this.normal = new Normal3D(normalVector);
    this.vertex = vertex;
  }

  public getWorldBounds(): Bounds3D {
    const extents = {
      [Axis.X]: {
        min: -Infinity,
        max: Infinity,
      },
      [Axis.Y]: {
        min: -Infinity,
        max: Infinity,
      },
      [Axis.Z]: {
        min: -Infinity,
        max: Infinity,
      },
    };
    return new Bounds3D(extents);
  }

  public transform(matrix: Matrix): void {
    this.normal = this.normal.getTranformed(matrix);
    this.vertex = transformVertex(this.vertex, matrix);
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
      color: { r: 1, g: 1, b: 1 },
    };
  }
}
