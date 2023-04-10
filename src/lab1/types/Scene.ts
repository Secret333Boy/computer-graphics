import { TraceableTransformable } from '../../lab3/types/Transformable';
import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';

export class Scene {
  constructor(
    public objects: TraceableTransformable[],
    public camera: Camera,
    public light: DirectionalLight
  ) {}

  public translate(x: number, y: number, z: number): void {
    for (const object of this.objects) {
      object.translate(x, y, z);
    }
  }

  public rotate(angleX: number, angleY: number, angleZ: number): void {
    for (const object of this.objects) {
      object.rotate(angleX, angleY, angleZ);
    }
  }

  public scale(x: number, y: number, z: number): void {
    for (const object of this.objects) {
      object.scale(x, y, z);
    }
  }
}
