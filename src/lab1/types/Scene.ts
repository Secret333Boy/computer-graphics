import { SceneObject, Transformable } from '../../lab3/types/Transformable';
import Camera from '../structures/camera/Camera';
import { DirectionalLight } from '../structures/light/directional-light/DirectionalLight';

export interface IScene extends Transformable {
  objects: SceneObject[];
  camera: Camera;
  // to add an ability for many sources in the future
  light: DirectionalLight;
}

export class Scene implements IScene {
  constructor(
    public objects: SceneObject[],
    public camera: Camera,
    public light: DirectionalLight
  ) {}

  translate(x: number, y: number, z: number): void {
    for (const object of this.objects) {
      object.translate(x, y, z);
    }
  }

  rotate(angleX: number, angleY: number, angleZ: number): void {
    for (const object of this.objects) {
      object.rotate(angleX, angleY, angleZ);
    }
  }

  scale(x: number, y: number, z: number): void {
    for (const object of this.objects) {
      object.scale(x, y, z);
    }
  }
}
