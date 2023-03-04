import Ray from './structures/ray/Ray';
import { Renderer } from './types/Renderer';
import { Scene } from './types/Scene';

export default class ConsoleRenderer implements Renderer {
  constructor(public readonly scene: Scene) {}

  public render() {
    const { camera, objects } = this.scene;

    for (let y = 0; y < camera.vResolution; y++) {
      let result = '';
      for (let x = 0; x < camera.hResolution; x++) {
        const screenPixelPosition = camera.getScreenPixelCoordinates(x, y);
        const ray = new Ray(
          camera.focalPoint,
          screenPixelPosition.toVector().subtract(camera.focalPoint.toVector())
        );

        result += objects.some((object) => object.isIntersecting(ray))
          ? '#'
          : ' ';
      }
      console.log(result);
    }
  }
}
