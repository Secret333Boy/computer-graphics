import { Hit } from '../../types/Hit';
import { Traceable } from '../../types/Traceable';
import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export class Triangle implements Traceable {
  constructor(
    public readonly vertex1: Vertex3D,
    public readonly vertex2: Vertex3D,
    public readonly vertex3: Vertex3D
  ) {}

  getIntersection(ray: Ray) {
    const E1 = this.vertex2.toVector().subtract(this.vertex1.toVector());
    const E2 = this.vertex3.toVector().subtract(this.vertex1.toVector());
    const D = ray.vector;
    const O = ray.position.toVector();
    const T = O.subtract(this.vertex1.toVector());

    const P = D.crossProduct(E2);
    const Q = T.crossProduct(E1);

    const PE1 = P.dotProduct(E1);

    const t = Q.dotProduct(E2) / PE1;
    if (t < 0) return null;

    const u = P.dotProduct(T) / PE1;
    if (u < 0) return null;

    const v = Q.dotProduct(D) / PE1;
    if (v < 0) return null;

    if (u + v > 1) return null;

    //TODO: vertex and normal
    const pHit: Hit = {
      t,
      vertex: O.add(D.multiply(t)).toVertex3D(),
      normal: new Normal3D(new Vector3D(0, 0, 0)),
    };

    return pHit;
  }
}
