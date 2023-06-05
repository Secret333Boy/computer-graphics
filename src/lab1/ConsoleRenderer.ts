import CommonRenderer from '../lab3/structures/renderers/CommonRenderer';
import {
  GenericTraceableGroup,
  TraceableGroupFactory,
} from '../lab3/structures/traceable-groups/GenericTraceableGroup';
import { PreRenderHookable } from '../lab4/types/PreRenderHookable';
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

  constructor(
    scene: Scene,
    traceableGroupFactory: TraceableGroupFactory<
      GenericTraceableGroup & PreRenderHookable
    >
  ) {
    super({
      scene,
      onHit: (hit) => {
        this.line += this.getChar(hit);
      },
      onRowStart: () => {
        this.line = '';
      },
      onRowEnd: () => console.log(this.line),
      traceableGroupFactory,
    });
  }

  private getChar(hit: Hit | null) {
    if (!hit) return ' ';

    const dotProduct = this.scene.light.vector.dotProduct(hit.normal.vector);
    return ConsoleRenderer.dotProductSymbolMap(dotProduct);
  }
}
