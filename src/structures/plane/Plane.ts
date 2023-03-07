import Normal3D from '../normal/Normal';
import Ray from '../ray/Ray';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Plane {
  public readonly normal: Normal3D;
  public readonly point: Vertex3D;

  constructor(vector: Vector3D, point: Vertex3D) {
    this.normal = new Normal3D(vector);
    this.point = point;
  }

  public intersection(ray: Ray): number | null {
    const denominator = this.normal.vector.dotProduct(ray.vector);
    //accos a
    //cos α = (n · d) / (|n| |d|),

    const cosAngle =
      denominator / (this.normal.vector.length * ray.vector.length);
    if (denominator === 0) {
      //if the ray is paralel to the plane
      return null;
    } else if (cosAngle <= 0) {
      //the intersection is behind the ray origin
      return null;
    } else {
      return Math.acos(cosAngle);
    }
  }
}
