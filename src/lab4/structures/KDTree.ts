// https://www.pbr-book.org/3ed-2018/Primitives_and_Intersection_Acceleration/Kd-Tree_Accelerator

import Ray from '../../lab1/structures/ray/Ray';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';
import { Axis } from '../types/Axis';
import { Boundable } from '../types/Boundable';
import { AxisBounds, Bounds3D, unionAllBounds3D } from './Bounds';

export type KDTreeInitParams<T extends Traceable & Boundable> = {
  objects: T[];
  maxDepth?: number;
};

export class KDTreeBuilder<T extends Traceable & Boundable> {
  private readonly maxPrimitives: number;
  private readonly axisSplitter: KDAxisSplitter<T>;
  constructor({
    maxPrimitives,
    axisSplitter = new KDAxisSplitter({}),
  }: {
    maxPrimitives: number;
    axisSplitter: KDAxisSplitter<T>;
  }) {
    this.maxPrimitives = maxPrimitives;
    this.axisSplitter = axisSplitter;
  }
  public build({
    objects,
    maxDepth = 8 + 1.3 * Math.log2(objects.length),
  }: KDTreeInitParams<T>): KDNode {
    const { primitiveBounds, union } = unionAllBounds3D(objects);
    return this.buildRecursive({
      objects,
      maxDepth,
      allBounds: primitiveBounds,
      badRefineCount: 0,
      bounds: union,
    });
  }

  private buildRecursive({
    objects,
    maxDepth,
    bounds,
    allBounds,
    badRefineCount,
  }: {
    objects: T[];
    maxDepth: number;
    bounds: Bounds3D;
    allBounds: Bounds3D[];
    badRefineCount: number;
  }): KDNode {
    if (objects.length <= this.maxPrimitives || maxDepth <= 0) {
      return new KDLeaf({ objects });
    }
    const splitResult = this.axisSplitter.split({
      allBounds,
      bounds,
      primitives: objects,
      prevBadRefine: badRefineCount,
    });
    if (!splitResult) {
      return new KDLeaf({ objects });
    }
    const {
      newBadRefine,
      leftSplitMembers,
      rightSplitMembers,
      leftBounds,
      rightBounds,
      allLeftBounds,
      allRightBounds,
    } = splitResult;
    const leftChild = this.buildRecursive({
      objects: leftSplitMembers,
      maxDepth: maxDepth - 1,
      bounds: leftBounds,
      allBounds: allLeftBounds,
      badRefineCount: newBadRefine,
    });
    const rightChild = this.buildRecursive({
      objects: rightSplitMembers,
      maxDepth: maxDepth - 1,
      bounds: rightBounds,
      allBounds: allRightBounds,
      badRefineCount: newBadRefine,
    });
    return new KDInternal({
      left: leftChild,
      right: rightChild,
    });
  }
}

export type BinarySplitInfo<T extends Traceable & Boundable> =
  | {
      splitType: Axis;
      splitPosition: number;
      newBadRefine: number;
      leftSplitMembers: T[];
      rightSplitMembers: T[];
      leftBounds: Bounds3D;
      rightBounds: Bounds3D;
      allLeftBounds: Bounds3D[];
      allRightBounds: Bounds3D[];
    }
  | false;

export class KDAxisSplitter<T extends Traceable & Boundable> {
  private readonly intersectCost: number;
  private readonly traversalCost: number;
  private readonly emptyBonus: number;
  constructor({
    intersectCost = 80,
    traversalCost = 1,
    emptyBonus = 0.5,
  }: {
    intersectCost?: number;
    traversalCost?: number;
    emptyBonus?: number;
  }) {
    this.intersectCost = intersectCost;
    this.traversalCost = traversalCost;
    this.emptyBonus = emptyBonus;
  }
  public split({
    allBounds,
    bounds,
    primitives,
    prevBadRefine,
  }: {
    allBounds: Bounds3D[];
    bounds: Bounds3D;
    primitives: T[];
    prevBadRefine: number;
  }): BinarySplitInfo<T> {
    let bestAxis: -1 | Axis = -1;
    let bestOffset = -1;
    let bestCost = Infinity;
    const oldCost = this.intersectCost * primitives.length;
    const totalSurfaceArea = bounds.surfaceArea;
    const invTotalSurfaceArea = 1 / totalSurfaceArea;
    const diagonal: Vector3D = bounds.diagonal;
    let axis = bounds.maximumExtentAxis;
    let retries = 0;
    const edges: BoundEdge<T>[][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 2 * primitives.length })
    );
    while (bestAxis === -1 && retries < 2) {
      this.computeEdges({ edges, axis, primitives, bounds: allBounds });
      let nBelow = 0,
        nAbove = primitives.length;
      for (let i = 0; i < 2 * primitives.length; i++) {
        if (edges[axis][i].type == EdgeType.End) --nAbove;
        const edgeT = edges[axis][i].t;
        if (edgeT > bounds[axis].min && edgeT < bounds[axis].max) {
          // Compute cost for split at ith edge
          // Compute child surface areas for split at edgeT
          const otherAxis0: Axis = (axis + 1) % 3,
            otherAxis1: Axis = (axis + 2) % 3;
          const belowSA =
            2 *
            (diagonal[otherAxis0] * diagonal[otherAxis1] +
              (edgeT - bounds[axis].min) *
                (diagonal[otherAxis0] + diagonal[otherAxis1]));
          const aboveSA =
            2 *
            (diagonal[otherAxis0] * diagonal[otherAxis1] +
              (bounds[axis].max - edgeT) *
                (diagonal[otherAxis0] + diagonal[otherAxis1]));

          const pBelow = belowSA * invTotalSurfaceArea;
          const pAbove = aboveSA * invTotalSurfaceArea;
          const eb = nAbove == 0 || nBelow == 0 ? this.emptyBonus : 0;
          const cost =
            this.traversalCost +
            this.intersectCost * (1 - eb) * (pBelow * nBelow + pAbove * nAbove);
          // Update best split if this is lowest cost so far
          if (cost < bestCost) {
            bestCost = cost;
            bestAxis = axis;
            bestOffset = i;
          }
        }
        if (edges[axis][i].type == EdgeType.Start) ++nBelow;
      }
      retries++;
      axis = (axis + 1) % 3;
    }
    if (bestCost > oldCost) {
      prevBadRefine++;
    }
    if (
      (bestCost > 4 * oldCost && primitives.length < 16) ||
      bestAxis == -1 ||
      prevBadRefine == 3
    ) {
      return false;
    }
    const leftSplitMembers: T[] = [];
    const allLeftBounds: Bounds3D[] = [];
    for (let i = 0; i < bestOffset; i++) {
      if (edges[bestAxis][i].type == EdgeType.Start) {
        leftSplitMembers.push(edges[bestAxis][i].primitive);
        allLeftBounds.push(allBounds[edges[bestAxis][i].primitiveInd]);
      }
    }
    const rightSplitMembers: T[] = [];
    const allRightBounds: Bounds3D[] = [];
    for (let i = bestOffset + 1; i < 2 * primitives.length; i++) {
      if (edges[bestAxis][i].type == EdgeType.End) {
        rightSplitMembers.push(edges[bestAxis][i].primitive);
        allRightBounds.push(allBounds[edges[bestAxis][i].primitiveInd]);
      }
    }
    const tSplit = edges[bestAxis][bestOffset].t;
    const leftBounds = {
      [Axis.X]: { min: bounds[Axis.X].min, max: bounds[Axis.X].max },
      [Axis.Y]: { min: bounds[Axis.Y].min, max: bounds[Axis.Y].max },
      [Axis.Z]: { min: bounds[Axis.Z].min, max: bounds[Axis.Z].max },
    };
    const rightBounds = {
      [Axis.X]: { min: bounds[Axis.X].min, max: bounds[Axis.X].max },
      [Axis.Y]: { min: bounds[Axis.Y].min, max: bounds[Axis.Y].max },
      [Axis.Z]: { min: bounds[Axis.Z].min, max: bounds[Axis.Z].max },
    };
    leftBounds[bestAxis].max = rightBounds[bestAxis].min = tSplit;
    return {
      splitType: bestAxis,
      splitPosition: tSplit,
      newBadRefine: prevBadRefine,
      leftSplitMembers,
      rightSplitMembers,
      leftBounds: new Bounds3D(leftBounds),
      rightBounds: new Bounds3D(rightBounds),
      allLeftBounds,
      allRightBounds,
    };
  }

  private computeEdges({
    edges,
    axis,
    primitives,
    bounds,
  }: {
    edges: BoundEdge<T>[][];
    axis: Axis;
    primitives: T[];
    bounds: Bounds3D[];
  }): void {
    for (let i = 0; i < primitives.length; i++) {
      const primitive = primitives[i];
      const primBounds = bounds[i];
      edges[axis][2 * i] = new BoundEdge(
        primBounds[axis].min,
        primitive,
        EdgeType.Start,
        i
      );
      edges[axis][2 * i + 1] = new BoundEdge(
        primBounds[axis].max,
        primitive,
        EdgeType.End,
        i
      );
    }

    edges[axis].sort((e0, e1) => {
      if (e0.t === e1.t) {
        return e0.type - e1.type;
      } else {
        return e0.t - e1.t;
      }
    });
  }
}

enum EdgeType {
  Start,
  End,
}

class BoundEdge<T extends Traceable & Boundable> {
  constructor(
    public t: number,
    public primitive: T,
    public type: EdgeType,
    public primitiveInd: number
  ) {}
}

export type KDNode = Traceable & {
  toString: () => string;
};

export class KDLeaf<T extends Traceable> implements KDNode {
  private objects: T[];

  constructor({ objects }: { objects: T[] }) {
    this.objects = objects;
  }

  public getIntersection(ray: Ray): Hit | null {
    throw new Error('Method not implemented.');
  }

  public get count(): number {
    return this.objects.length;
  }
}

export class KDInternal implements KDNode {
  public readonly left: KDNode;
  public readonly right: KDNode;

  constructor({ left, right }: { left: KDNode; right: KDNode }) {
    this.left = left;
    this.right = right;
  }

  public getIntersection(ray: Ray): Hit | null {
    throw new Error('Method not implemented.');
  }
}

// for debugging only
export const printKDTree = (root: KDNode, depth = 0) => {
  const indent = ' '.repeat(depth * 2);
  if (root instanceof KDLeaf) {
    console.log(`${indent}Leaf Node - Object count: ${root.count}`);
  } else if (root instanceof KDInternal) {
    console.log(`${indent}Internal Node`);
    printKDTree(root.left, depth + 1);
    printKDTree(root.right, depth + 1);
  }
};
