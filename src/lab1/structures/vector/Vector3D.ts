import {
  transformVector,
  transformations,
} from '../../../lab3/structures/matrix/transformation-factories';
import { Transformable } from '../../../lab3/types/Transformable';
import Vertex3D from '../vertex/Vertex3D';

export default class Vector3D implements Transformable {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    const transformed = transformVector(
      this,
      transformations.rotate3d(angleX, angleY, angleZ)
    );
    this.x = transformed.x;
    this.y = transformed.y;
    this.z = transformed.z;
  }

  public translate(x: number, y: number, z: number): void {
    const transformed = transformVector(
      this,
      transformations.translate3d(x, y, z)
    );
    this.x = transformed.x;
    this.y = transformed.y;
    this.z = transformed.z;
  }

  public scale(x: number, y: number, z: number): void {
    const transformed = transformVector(this, transformations.scale3d(x, y, z));
    this.x = transformed.x;
    this.y = transformed.y;
    this.z = transformed.z;
  }

  public getRotated(angleX: number, angleY: number, angleZ: number): Vector3D {
    const copy = new Vector3D(this.x, this.y, this.z);
    copy.rotate(angleX, angleY, angleZ);
    return copy;
  }

  public getScaled(x: number, y: number, z: number): Vector3D {
    return transformVector(this, transformations.scale3d(x, y, z));
  }

  public add(vector: Vector3D): Vector3D {
    return new Vector3D(
      this.x + vector.x,
      this.y + vector.y,
      this.z + vector.z
    );
  }

  public subtract(vector: Vector3D): Vector3D {
    return new Vector3D(
      this.x - vector.x,
      this.y - vector.y,
      this.z - vector.z
    );
  }

  public multiply(number: number): Vector3D {
    return new Vector3D(this.x * number, this.y * number, this.z * number);
  }

  public dotProduct(vector: Vector3D): number {
    return this.x * vector.x + this.y * vector.y + this.z * vector.z;
  }

  public angleBetweenRads(vector: Vector3D): number {
    return Math.acos(this.dotProduct(vector) / (this.length * vector.length));
  }

  public crossProduct(vector: Vector3D): Vector3D {
    return new Vector3D(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  public get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  public toVertex3D(): Vertex3D {
    return new Vertex3D(this.x, this.y, this.z);
  }

  public normalize(): Vector3D {
    return this.multiply(1 / this.length);
  }
}
