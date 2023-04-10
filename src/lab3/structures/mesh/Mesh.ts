import { SceneObjectGroup } from '../scene-object-group/SceneObjectGroup';
import Triangle from '../triangle/Triangle';

export default class Mesh extends SceneObjectGroup<Triangle> {
  public readonly triangles = this.traceableObjects;
}
