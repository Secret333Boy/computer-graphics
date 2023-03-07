import Ray from './structures/ray/Ray';
import { Renderer } from './types/Renderer';
import { Scene } from './types/Scene';
import { HitInfo } from './types/Traceable';
import { findClosestHit } from './utils/findClosestHit';

export default class ConsoleRenderer implements Renderer {
  constructor(public readonly scene: Scene) {}

  private static dotProductSymbolMap(dot: number): string {
    if (dot < -0.8) {
      return '#';
    }
    if (dot < -0.5) {
      return 'O';
    }
    if (dot < -0.2) {
      return '*';
    }
    if (dot < 0) {
      return '.';
    }
    return ' ';
  }

  public render() {
    const { camera, objects } = this.scene;

    for (let y = camera.vResolution - 1; y >= 0; y--) {
      let result = '';
      for (let x = 0; x < camera.hResolution; x++) {
        const screenPixelPosition = camera.getScreenPixelCoordinates(x, y);
        const ray = new Ray(
          camera.focalPoint,
          screenPixelPosition.toVector().subtract(camera.focalPoint.toVector())
        );
        const hits = objects
          .map((object) => object.getIntersection(ray))
          .filter((hit): hit is HitInfo => hit !== null);
        if (hits.length === 0) {
          result += ' ';
          continue;
        }
        const closestHit = findClosestHit(hits);
        const dot = this.scene.light.vector.dotProduct(
          closestHit.normal.vector
        );
        result += ConsoleRenderer.dotProductSymbolMap(dot);
      }
      console.log(result);
    }
  }
}
