import { Matrix } from '../../../lab3/structures/matrix/matrix';
import {
  transformVector,
  transformVertex,
} from '../../../lab3/structures/matrix/transformation-factories';
import { Transformable } from '../../../lab3/types/Transformable';
import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Camera implements Transformable {
  public rightVector: Vector3D;
  public upVector: Vector3D;

  constructor(
    public focalPoint: Vertex3D,
    public viewVector: Vector3D,
    public readonly fov: number,
    // number of horizontal pixels
    public readonly horizontalResolution: number,
    public readonly verticalResolution: number,
    public readonly cameraTransformMatrix?: Matrix
  ) {
    if (this.viewVector.crossProduct(new Vector3D(0, 0, 1)).length === 0) {
      this.rightVector = new Vector3D(1, 0, 0);
    } else {
      this.rightVector = this.viewVector
        .crossProduct(new Vector3D(0, 0, 1))
        .normalize();
    }
    this.upVector = this.viewVector.crossProduct(this.rightVector).normalize();
  }
  public transform(matrix: Matrix): void {
    this.focalPoint = transformVertex(this.focalPoint, matrix);
    this.viewVector = transformVector(this.viewVector, matrix);
    this.rightVector = transformVector(this.rightVector, matrix);
    this.upVector = transformVector(this.upVector, matrix);
  }

  // like 16:9
  public get widthToHeightRatio(): number {
    return this.horizontalResolution / this.verticalResolution;
  }

  public get screenCenter(): Vertex3D {
    return this.focalPoint.toVector().add(this.viewVector).toVertex3D();
  }

  public get screenWidth(): number {
    return 2 * this.viewVector.length * Math.tan(this.fov / 2);
  }

  public get screenHeight(): number {
    return this.screenWidth / this.widthToHeightRatio;
  }

  public getScreenPixelVector(x: number, y: number): Vector3D {
    const screenPixelPosition = this.getScreenPixelCoordinates(x, y);
    let vector = screenPixelPosition
      .toVector()
      .subtract(this.focalPoint.toVector());
    if (this.cameraTransformMatrix) {
      vector = transformVector(vector, this.cameraTransformMatrix);
    }
    return vector;
  }

  // x = 0 and y = 0 means bottom left corner of the screen;
  // screen is a straight plane located at the end of viewVector, perpendicular to it
  public getScreenPixelCoordinates(x: number, y: number): Vertex3D {
    const fromFocalPointToPointOnScreen = this.viewVector
      .subtract(
        this.rightVector.multiply(
          ((x - this.horizontalResolution / 2) * this.screenWidth) /
            this.horizontalResolution
        )
      )
      .subtract(
        this.upVector.multiply(
          ((y - this.verticalResolution / 2) * this.screenHeight) /
            this.verticalResolution
        )
      );
    return new Vector3D(this.focalPoint.x, this.focalPoint.y, this.focalPoint.z)
      .add(fromFocalPointToPointOnScreen)
      .toVertex3D();
  }
}
