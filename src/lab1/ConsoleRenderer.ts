import CommonRenderer from '../lab3/structures/renderers/CommonRenderer';
import { Hit } from './types/Hit';
import { Scene } from './types/Scene';

export default class ConsoleRenderer extends CommonRenderer {
  private line = '';

  private static dotProductSymbolMap(dotProduct: number): string {
    if (dotProduct < -0.8) {
      return '#';
    }
    if (dotProduct < -0.5) {
      return 'O';
    }
    if (dotProduct < -0.2) {
      return '*';
    }
    if (dotProduct < 0) {
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

    const dotProduct = this.scene.light.vector.dotProduct(hit.normal.vector);
    return ConsoleRenderer.dotProductSymbolMap(dotProduct);
  }
}
