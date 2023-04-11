import Normal3D from '../../../lab1/structures/normal/Normal';
import Ray from '../../../lab1/structures/ray/Ray';
import Vertex3D from '../../../lab1/structures/vertex/Vertex3D';
import { Hit } from '../../../lab1/types/Hit';
import { TraceableTransformable } from '../../types/Transformable';

export default class Triangle implements TraceableTransformable {
  constructor(
    public vertex1: Vertex3D,
    public vertex2: Vertex3D,
    public vertex3: Vertex3D
  ) {}

  public translate(x: number, y: number, z: number): void {
    this.vertex1 = this.vertex1.getTranslated(x, y, z);
    this.vertex2 = this.vertex2.getTranslated(x, y, z);
    this.vertex3 = this.vertex3.getTranslated(x, y, z);
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    this.vertex1 = this.vertex1.getRotated(angleX, angleY, angleZ);
    this.vertex2 = this.vertex2.getRotated(angleX, angleY, angleZ);
    this.vertex3 = this.vertex3.getRotated(angleX, angleY, angleZ);
  }

  public scale(x: number, y: number, z: number): void {
    this.vertex1 = this.vertex1.getScaled(x, y, z);
    this.vertex2 = this.vertex2.getScaled(x, y, z);
    this.vertex3 = this.vertex3.getScaled(x, y, z);
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
    if (t < 0) return null;

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
    };
  }
}
