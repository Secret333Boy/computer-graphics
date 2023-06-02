import CommonRenderer from '../lab3/structures/renderers/CommonRenderer';
import { Hit } from './types/Hit';
import { Scene } from './types/Scene';

export default class ConsoleRenderer extends CommonRenderer {
  private line = '';

  private static dotProductSymbolMap(dotProduct: number): string {
    if (dotProduct > 0.8) {
      return '#';
    }
    if (dotProduct > 0.5) {
      return 'O';
    }
    if (dotProduct > 0.2) {
      return '*';
    }
    if (dotProduct > 0) {
      return '.';
    }
    return ' ';
  }

  constructor(scene: Scene) {
    super({
      scene,
      onHit: (hit) => {
        this.line += this.getChar(hit);
      },
      onRowStart: () => {
        this.line = '';
      },
      onRowEnd: () => console.log(this.line),
    });
  }

  private getChar(hit: Hit | null) {
    if (!hit) return ' ';

    for (const light of this.scene.lights) {
      if (light.checkShadow(hit, this.scene.objects)) continue;

      light.applyColor(hit);
    }

    const dotProduct =
      (hit.color.r / 255 + hit.color.g / 255 + hit.color.b / 255) / 3;
    return ConsoleRenderer.dotProductSymbolMap(dotProduct);
  }
}
