import TraceableGroup from '../traceable-group/TraceableGroup';
import Triangle from '../triangle/Triangle';

export default class Mesh extends TraceableGroup<Triangle> {
  public readonly triangles = this.traceableObjects;
}
