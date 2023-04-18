import Normal3D from '../../../lab1/structures/normal/Normal';
import Ray from '../../../lab1/structures/ray/Ray';
import Vertex3D from '../../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../../lab1/types/Hit';
import { TraceableTransformable } from '../../types/Transformable';
import { Matrix } from '../matrix/matrix';
import { transformVertex } from '../matrix/transformation-factories';

export default class Triangle implements TraceableTransformable {
  private eps = 0.00000001;
  constructor(
    public vertex1: Vertex3D,
    public vertex2: Vertex3D,
    public vertex3: Vertex3D
  ) {}

  public transform(matrix: Matrix): void {
    this.vertex1 = transformVertex(this.vertex1, matrix);
    this.vertex2 = transformVertex(this.vertex2, matrix);
    this.vertex3 = transformVertex(this.vertex3, matrix);
  }

  public getIntersection(ray: Ray): Hit | null {
    const E1 = this.vertex2.toVector().subtract(this.vertex1.toVector());
    const E2 = this.vertex3.toVector().subtract(this.vertex1.toVector());
    const D = ray.vector;
    const O = ray.position.toVector();
    const T = O.subtract(this.vertex1.toVector());

    const P = D.crossProduct(E2);
    const Q = T.crossProduct(E1);

    const PE1 = P.dotProduct(E1);

    const t = Q.dotProduct(E2) / PE1;
    if (t <= this.eps) return null;

    const u = P.dotProduct(T) / PE1;
    if (u < 0) return null;

    const v = Q.dotProduct(D) / PE1;
    if (v < 0) return null;

    if (u + v > 1) return null;

    const pHit = O.add(D.multiply(t)).toVertex3D();

    const possibleNormal = E1.crossProduct(E2);

    return {
      t,
      vertex: pHit,
      normal: new Normal3D(
        possibleNormal.dotProduct(D) < 0
          ? possibleNormal.multiply(-1)
          : possibleNormal
      ),
      object: this,
    };
  }
}
