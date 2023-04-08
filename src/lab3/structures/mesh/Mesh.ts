import { SceneObjectGroup } from '../traceable-group/TraceableGroup';
import Triangle from '../triangle/Triangle';

export default class Mesh extends SceneObjectGroup<Triangle> {
  public readonly triangles = this.traceableObjects;
}
