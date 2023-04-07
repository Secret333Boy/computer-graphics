import { CommonRenderer } from './CommonRenderer';
import Ray from './structures/ray/Ray';
import { Renderer } from './types/Renderer';
import { Scene } from './types/Scene';

export class RendererFactory {
  public static createRenderer(
    scene: Scene,
    handleRay: (scene: Scene, ray: Ray) => void
  ): Renderer {
    return new CommonRenderer(scene, handleRay);
  }
}
