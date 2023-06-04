// https://www.pbr-book.org/3ed-2018/Primitives_and_Intersection_Acceleration/Kd-Tree_Accelerator

import Ray from '../../lab1/structures/ray/Ray';
import Vector3D from '../../lab1/structures/vector/Vector3D';
import { Hit } from '../../lab1/types/Hit';
import { Traceable } from '../../lab1/types/Traceable';
import { DumbTraceableGroup } from '../../lab3/structures/traceable-groups/DumbTraceableGroup';
import { Axis } from '../types/Axis';
import { Boundable } from '../types/Boundable';
import { Bounds3D, unionAllBounds3D, unionBounds3D } from './Bounds';

export interface IKDTreeBuilder<T extends Traceable & Boundable> {
  build(params: KDTreeInitParams<T>): KDNode;
}

export type KDTreeInitParams<T extends Traceable & Boundable> = {
  objects: T[];
  maxDepth?: number;
};

export class KDTreeBuilder<T extends Traceable & Boundable>
  implements IKDTreeBuilder<T>
{
  private readonly maxPrimitives: number;
  private readonly axisSplitter: IKDAxisSplitter<T>;
  constructor({
    maxPrimitives,
    axisSplitter = new KDAxisSplitter({}),
  }: {
    maxPrimitives: number;
    axisSplitter?: IKDAxisSplitter<T>;
  }) {
    this.maxPrimitives = maxPrimitives;
    this.axisSplitter = axisSplitter;
  }
  public build({
    objects,
    //maxDepth = 8 + 1.3 * Math.log2(objects.length),
    maxDepth = 1,
  }: KDTreeInitParams<T>): KDNode {
    const { primitiveBounds, union } = unionAllBounds3D(objects);
    console.log(`------BUILDING KDTREE WITH ${objects.length} OBJECTS------`);
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
      console.log(
        `[MAX DEPTH: ${maxDepth}, LEAF] Building node with ${
          objects.length
        } objects,
        bounds: X: [${bounds[Axis.X].min}, ${bounds[Axis.X].max}],
        Y: [${bounds[Axis.Y].min}, ${bounds[Axis.Y].max}],
        Z: [${bounds[Axis.Z].min}, ${bounds[Axis.Z].max}]`
      );
      return new KDLeaf({ objects });
    }
    console.log(
      `[MAX DEPTH: ${maxDepth}, INTERNAL] Building node with ${
        objects.length
      } objects, bounds: X: [${bounds[Axis.X].min}, ${
        bounds[Axis.X].max
      }], Y: [${bounds[Axis.Y].min}, ${bounds[Axis.Y].max}], Z: [${
        bounds[Axis.Z].min
      }, ${bounds[Axis.Z].max}]`
    );
    const splitResult = this.axisSplitter.split({
      allBounds,
      bounds,
      primitives: objects,
      prevBadRefine: badRefineCount,
    });
    if (!splitResult) {
      console.log(`[MAX DEPTH: ${maxDepth}, INTERNAL] No split found!`);
      return new KDLeaf({ objects });
    } else {
      console.log(
        `[MAX DEPTH: ${maxDepth}, INTERNAL] Split with ${splitResult.leftSplitMembers.length} left split members, ${splitResult.rightSplitMembers.length} right split members!`
      );
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
    console.log(
      `[RES, MAX DEPTH: ${maxDepth}] Left bounds X: [${
        leftBounds[Axis.X].min
      }, ${leftBounds[Axis.X].max}], Y: [${leftBounds[Axis.Y].min}, ${
        leftBounds[Axis.Y].max
      }], Z: [${leftBounds[Axis.Z].min}, ${leftBounds[Axis.Z].max}] (count ${
        leftSplitMembers.length
      }),
      Right bounds X: [${rightBounds[Axis.X].min}, ${
        rightBounds[Axis.X].max
      }], Y: [${rightBounds[Axis.Y].min}, ${rightBounds[Axis.Y].max}], Z: [${
        rightBounds[Axis.Z].min
      }, ${rightBounds[Axis.Z].max}], (count ${
        rightSplitMembers.length
      }) split type ${splitResult.splitType}, split pos ${
        splitResult.splitPosition
      }`
    );
    return new KDInternal({
      left: leftChild,
      right: rightChild,
      splitAxis: splitResult.splitType,
      splitPos: splitResult.splitPosition,
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

export interface IKDAxisSplitter<T extends Traceable & Boundable> {
  split({
    allBounds,
    bounds,
    primitives,
    prevBadRefine,
  }: {
    allBounds: Bounds3D[];
    bounds: Bounds3D;
    primitives: T[];
    prevBadRefine: number;
  }): BinarySplitInfo<T>;
}

export class KDAxisSplitter<T extends Traceable & Boundable>
  implements IKDAxisSplitter<T>
{
  private readonly intersectCost: number;
  private readonly traversalCost: number;
  private readonly emptyBonus: number;
  constructor({
    intersectCost = 80,
    traversalCost = 1,
    // the total cost will be multiplied by about 1 - this value, if one of split halves is empty
    emptyBonus = 0.01,
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
    console.log(`[SPLIT] Total SA: ${totalSurfaceArea}, Old cost: ${oldCost}`);
    const invTotalSurfaceArea = 1 / totalSurfaceArea;
    const diagonal: Vector3D = bounds.diagonal;
    let axis = bounds.maximumExtentAxis;
    console.log(`[SPLIT] Max extend Axis: ${axis}`);
    let retries = 0;
    const edges: BoundEdge<T>[][] = Array.from({ length: 3 }, () =>
      Array.from({ length: 2 * primitives.length })
    );
    while (bestAxis === -1 && retries < 2) {
      this.computeEdges({ edges, axis, primitives, bounds: allBounds });
      let nBelow = 0,
        nAbove = primitives.length;
      for (let i = 0; i < 2 * primitives.length; i++) {
        if (edges[axis][i].type == EdgeType.End) {
          --nAbove;
        }
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
            // console.log(
            //   `[SPLIT] New best cost: ${cost}, axis: ${axis}, nBelow: ${nBelow}, nAbove: ${nAbove}, belowSA: ${belowSA}, aboveSA: ${aboveSA}, edgeT: ${edgeT}`
            // );
            bestCost = cost;
            bestAxis = axis;
            bestOffset = i;
          } else {
            // console.log(
            //   `[SPLIT, MISS] Cost: ${cost}, axis: ${axis}, nBelow: ${nBelow}, nAbove: ${nAbove}, belowSA: ${belowSA}, aboveSA: ${aboveSA}, edgeT: ${edgeT}`
            // );
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
    console.log(`[SPLIT] Best offset: ${bestOffset}`);
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

export type KDNode = Traceable;

export class KDLeaf<T extends Traceable> implements KDNode {
  private readonly traceableGroup: DumbTraceableGroup<T>;
  private readonly bounds: Bounds3D;

  constructor({ objects }: { objects: T[] }) {
    this.traceableGroup = new DumbTraceableGroup(objects);
    this.bounds = this.traceableGroup.getWorldBounds();
  }
  public getWorldBounds(): Bounds3D {
    return this.bounds;
  }

  public getIntersection(ray: Ray): Hit | null {
    // console.log(
    //   `[KDLeaf, INTERSECT] Bounds: X: ${this.bounds[Axis.X].min}, ${
    //     this.bounds[Axis.X].max
    //   }, Y: ${this.bounds[Axis.Y].min}, ${this.bounds[Axis.Y].max}, Z: ${
    //     this.bounds[Axis.Z].min
    //   }, ${this.bounds[Axis.Z].max}`
    // );
    return this.traceableGroup.getIntersection(ray);
  }

  public get count(): number {
    return this.traceableGroup.getTraceableObjects().length;
  }
}

export class KDInternal implements KDNode {
  public readonly left: KDNode;
  public readonly right: KDNode;
  private readonly bounds: Bounds3D;
  private readonly splitAxis: Axis;
  private readonly splitPos: number;

  constructor({
    left,
    right,
    splitAxis,
    splitPos,
  }: {
    left: KDNode;
    right: KDNode;
    splitAxis: Axis;
    splitPos: number;
  }) {
    this.left = left;
    this.right = right;
    this.splitAxis = splitAxis;
    this.splitPos = splitPos;
    this.bounds = unionBounds3D(left.getWorldBounds(), right.getWorldBounds());
  }

  public getWorldBounds(): Bounds3D {
    return this.bounds;
  }

  public getIntersection(ray: Ray): Hit | null {
    if (!ray.vector.z.toString().startsWith('0.9584676')) {
      return null;
    }
    // console.log(
    //   `[KDInternal, INTERSECT] Bounds: X: ${this.bounds[Axis.X].min}, ${
    //     this.bounds[Axis.X].max
    //   }, Y: ${this.bounds[Axis.Y].min}, ${this.bounds[Axis.Y].max}, Z: ${
    //     this.bounds[Axis.Z].min
    //   }, ${this.bounds[Axis.Z].max}`
    // );
    console.log('meh');
    // intersection with the *bounds* of current node, initially self
    const intersection = this.bounds.pierceWith(ray);
    if (intersection === null) {
      return null;
    }
    // the distance to the current node, and to its exit
    let { tMax, tMin } = intersection;
    // console.log(`[KDInternal, INTERSECT] tMin: ${tMin}, tMax: ${tMax}`);
    // just to precompute division, and use multiplication later instead
    const invDir = new Vector3D(
      1 / ray.vector.x,
      1 / ray.vector.y,
      1 / ray.vector.z
    );
    // type not used anywhere else, so inlined here
    type KDTodo = {
      node: KDNode;
      tMin: number;
      tMax: number;
    };
    // it's possible to use recursion, but here it's implemented with a sort of stack
    const todo: KDTodo[] = [];
    // we start from the root (this) node, going deeper and deeper
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: KDNode | null = this;
    // the closest distance from ray origin to a hit (of a primitive, not node);
    // once we reach a node, that is strictly further than this, there's no point to continue
    let rayTMax = Infinity;
    let result: Hit | null = null;
    while (node != null) {
      if (rayTMax < tMin) {
        console.log('break')
        break;
      }
      // to avoid using recursion, we have to be able to determine the type of kd node, at least for other nodes;
      // otherwise, we'll get a ton of props that can be null of KDNode
      if (node instanceof KDLeaf) {
        console.log('leaf');
        const intersection = node.getIntersection(ray);
        if (intersection !== null && intersection.t < rayTMax) {
          rayTMax = intersection.t;
          result = intersection;
        }
        // this branch was perhaps dead-end, dequeue some further child
        if (todo.length > 0) {
          const nextTodo = todo.pop() as KDTodo;
          node = nextTodo.node;
          tMin = nextTodo.tMin;
          tMax = nextTodo.tMax;
        } else {
          node = null;
        }
      } else if (node instanceof KDInternal) {
        // interior node
        // see: accessing splitAxis here is possible because of the type guard above
        const axis = node.splitAxis;
        // distance to the splitting plane, necessary to determine which sub nodes get intersected
        const tPlane = (node.splitPos - ray.position[axis]) * invDir[axis];
        // Now it is necessary to determine the order in which the ray encounters the children nodes
        // so that the tree is traversed in front-to-back order along the ray.

        // NOTE: below is synonym to left (closest), above - right (furthest).
        // will determine whether the ray's origin starts below or above the splitting plane
        const belowFirst =
          ray.position[axis] < node.splitPos ||
          (ray.position[axis] === node.splitPos && ray.vector[axis] <= 0);
        //console.log(`[KDInternal, INTERSECT] belowFirst: ${belowFirst}`);
        let firstChild: KDNode;
        let secondChild: KDNode;
        if (belowFirst) {
          // here we designate the order in which we traverse the nodes: from the closest to the furthest
          firstChild = node.left;
          secondChild = node.right;
        } else {
          firstChild = node.right;
          secondChild = node.left;
        }
        if (tPlane > tMax || tPlane <= 0) {
          // the ray only hits the first child
          node = firstChild;
        } else if (tPlane < tMin) {
          // the ray only hits the second child
          node = secondChild;
        } else {
          // the ray hits both children, so we need to add the second child to the todo list
          // Enqueue secondChild in todo list;
          todo.push({
            node: secondChild,
            tMin: tPlane,
            tMax,
          });
          node = firstChild;
          tMax = tPlane;
        }
      }
    }
    return result;
  }
}
