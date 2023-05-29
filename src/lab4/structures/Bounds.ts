import Vector3D from '../../lab1/structures/vector/Vector3D';
import { Axis } from '../types/Axis';
import { Boundable } from '../types/Boundable';

export type AxisBounds = {
  min: number;
  max: number;
};

export class Bounds3D implements Record<Axis, AxisBounds> {
  public readonly [Axis.X]: AxisBounds;
  public readonly [Axis.Y]: AxisBounds;
  public readonly [Axis.Z]: AxisBounds;
  public readonly surfaceArea: number;
  public readonly diagonal: Vector3D;
  public readonly maximumExtentAxis: Axis;

  constructor({
    [Axis.X]: x,
    [Axis.Y]: y,
    [Axis.Z]: z,
  }: {
    [Axis.X]: AxisBounds;
    [Axis.Y]: AxisBounds;
    [Axis.Z]: AxisBounds;
  }) {
    this[Axis.X] = x;
    this[Axis.Y] = y;
    this[Axis.Z] = z;
    this.diagonal = this.calcDiagonal();
    this.surfaceArea = this.calcSurfaceArea();
    this.maximumExtentAxis = this.calcMaximumExtentAxis();
  }

  private calcDiagonal(): Vector3D {
    return new Vector3D(
      this[Axis.X].max - this[Axis.X].min,
      this[Axis.Y].max - this[Axis.Y].min,
      this[Axis.Z].max - this[Axis.Z].min
    );
  }

  private calcSurfaceArea(): number {
    const diagonal = this.diagonal;
    return (
      2 *
      (diagonal.x * diagonal.y +
        diagonal.x * diagonal.z +
        diagonal.y * diagonal.z)
    );
  }

  public calcMaximumExtentAxis(): Axis {
    const d = this.diagonal;
    if (d.x > d.y && d.x > d.z) {
      return Axis.X;
    }
    if (d.y > d.z) {
      return Axis.Y;
    }
    return Axis.Z;
  }
}

export const unionAxisBounds = (
  bound1: AxisBounds,
  bound2: AxisBounds
): AxisBounds => ({
  min: Math.min(bound1.min, bound2.min),
  max: Math.max(bound1.max, bound2.max),
});

export const unionBounds3D = (bounds1: Bounds3D, bounds2: Bounds3D): Bounds3D =>
  new Bounds3D({
    [Axis.X]: unionAxisBounds(bounds1[Axis.X], bounds2[Axis.X]),
    [Axis.Y]: unionAxisBounds(bounds1[Axis.Y], bounds2[Axis.Y]),
    [Axis.Z]: unionAxisBounds(bounds1[Axis.Z], bounds2[Axis.Z]),
  });

export const unionAllBounds3D = (
  boundables: Boundable[]
): { union: Bounds3D; primitiveBounds: Bounds3D[] } => {
  let unionBounds = boundables[0].getWorldBounds();
  const primitiveBounds = [unionBounds];
  for (let i = 1; i < boundables.length; i++) {
    const bounds = boundables[i].getWorldBounds();
    unionBounds = unionBounds3D(unionBounds, bounds);
    primitiveBounds.push(bounds);
  }
  return { union: unionBounds, primitiveBounds };
};
