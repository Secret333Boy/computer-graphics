import Ray from '../lab1/structures/ray/Ray';
import { Renderer } from '../lab1/types/Renderer';
import { Scene } from '../lab1/types/Scene';
import { CommonRenderer } from './CommonRenderer';

export class RendererFactory {
  public static createRenderer(
    scene: Scene,
    handleRay: (scene: Scene, ray: Ray) => void
  ): Renderer {
    return new CommonRenderer(scene, handleRay);
  }
}
