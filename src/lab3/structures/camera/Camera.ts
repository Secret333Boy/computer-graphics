import Vector3D from '../vector/Vector3D';
import Vertex3D from '../vertex/Vertex3D';

export default class Camera {
  public readonly rightVector: Vector3D;
  public readonly upVector: Vector3D;

  constructor(
    public readonly focalPoint: Vertex3D,
    public readonly viewVector: Vector3D,
    // like 16:9
    public readonly widthToHeightRatio: number,
    public readonly hFieldOfViewRads: number,
    // number of horizontal pixels
    public readonly hResolution: number
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

  public get vResolution(): number {
    return this.hResolution / this.widthToHeightRatio;
  }

  public get screenCenter(): Vertex3D {
    return this.focalPoint.toVector().add(this.viewVector).toVertex3D();
  }

  public get screenWidth(): number {
    return 2 * this.viewVector.length * Math.tan(this.hFieldOfViewRads / 2);
  }

  public get screenHeight(): number {
    return this.screenWidth / this.widthToHeightRatio;
  }

  // x = 0 and y = 0 means bottom left corner of the screen;
  // screen is a straight plane located at the end of viewVector, perpendicular to it
  public getScreenPixelCoordinates(x: number, y: number): Vertex3D {
    const fromFocalPointToPointOnScreen = this.viewVector
      .subtract(
        this.rightVector.multiply(
          ((x - this.hResolution / 2) * this.screenWidth) / this.hResolution
        )
      )
      .subtract(
        this.upVector.multiply(
          ((y - this.vResolution / 2) * this.screenHeight) / this.vResolution
        )
      );
    return new Vector3D(this.focalPoint.x, this.focalPoint.y, this.focalPoint.z)
      .add(fromFocalPointToPointOnScreen)
      .toVertex3D();
  }
}
