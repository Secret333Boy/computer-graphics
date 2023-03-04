import { Traceable } from "../../types/Traceable";
import Vertex3D from "../vertex/Vertex3D";
import Ray from "../ray/Ray"

export class Sphere implements Traceable {
  public readonly center: Vertex3D;
  public readonly radius: number;

  constructor(center: Vertex3D, radius: number){
    this.center = center;
    this.radius = radius;
  }

  public isIntersecting(ray: Ray): boolean {
    let a = ray.vector.dotProduct(ray.vector);
    // o - c vector
    let ocVector = ray.position.toVector().subtract(this.center.toVector());
    let b2 = 4 * ray.vector.dotProduct(ray.vector) * ocVector.dotProduct(ocVector);
    let c = ocVector.dotProduct(ocVector) - this.radius**2;
    let D = b2 - 4 * a * c;
    return D >= 0;
  }

}