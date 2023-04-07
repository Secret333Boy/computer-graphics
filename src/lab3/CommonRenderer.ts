import Ray from './structures/ray/Ray';
import { Renderer } from './types/Renderer';
import { Scene } from './types/Scene';

export class CommonRenderer implements Renderer {
  constructor(
    public readonly scene: Scene,
    private handleRay: (scene: Scene, ray: Ray) => void
  ) {}

  public render() {
    const { camera } = this.scene;

    for (let y = camera.vResolution - 1; y >= 0; y--) {
      for (let x = 0; x < camera.hResolution; x++) {
        const screenPixelPosition = camera.getScreenPixelCoordinates(x, y);
        const ray = new Ray(
          camera.focalPoint,
          screenPixelPosition.toVector().subtract(camera.focalPoint.toVector())
        );

        this.handleRay(this.scene, ray);
      }
    }
  }
}