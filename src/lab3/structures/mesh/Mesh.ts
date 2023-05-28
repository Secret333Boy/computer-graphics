import { TraceableTransformableGroup } from '../scene-object-group/SceneObjectGroup';
import Triangle from '../triangle/Triangle';

export default class Mesh extends TraceableTransformableGroup<Triangle> {
  public readonly triangles = this.group.getTraceableObjects();
}
