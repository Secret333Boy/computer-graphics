import { TraceableTransformableGroup } from '../scene-object-group/TraceableTransformableGroup';
import Triangle from '../triangle/Triangle';

export default class Mesh extends TraceableTransformableGroup<Triangle> {
  public readonly triangles = this.traceableObjects;
}
