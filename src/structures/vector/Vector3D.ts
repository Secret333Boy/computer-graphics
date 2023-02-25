export default class Vector3D {
  public readonly x: number;
  public readonly y: number;
  public readonly z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
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

  public crossProduct(vector: Vector3D): Vector3D {
    return new Vector3D(
      this.y * vector.z - this.z * vector.y,
      this.z * vector.x - this.x * vector.z,
      this.x * vector.y - this.y * vector.x
    );
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
}