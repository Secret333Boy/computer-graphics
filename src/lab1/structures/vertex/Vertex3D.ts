import {
  transformVector,
  transformations,
} from '../../../lab3/structures/matrix/transformation-factories';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';

export default class Vertex3D {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public translate(x: number, y: number, z: number): Vertex3D {
    const tranformed = transformVector(
      this.toVector(),
      transformations.translate3d(x, y, z)
    );
    return tranformed.toVertex3D();
  }

  public rotate(angleX: number, angleY: number, angleZ: number): Vertex3D {
    const tranformed = transformVector(
      this.toVector(),
      transformations.rotate3d(angleX, angleY, angleZ)
    );
    return tranformed.toVertex3D();
  }

  public scale(x: number, y: number, z: number): Vertex3D {
    const tranformed = transformVector(
      this.toVector(),
      transformations.scale3d(x, y, z)
    );
    return tranformed.toVertex3D();
  }

  public getLengthTo(vertex: Vertex3D) {
    return Math.sqrt(
      (this.x - vertex.x) * (this.x - vertex.x) +
        (this.y - vertex.y) * (this.y - vertex.y) +
        (this.z - vertex.z) * (this.z - vertex.z)
    );
  }

  public toVector() {
    return new Vector3D(this.x, this.y, this.z);
  }

  public isInsideRay(ray: Ray) {
    return ray.hasInside(this);
  }
}
