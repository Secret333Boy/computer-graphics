import CommonRenderer from '../lab3/structures/renderers/CommonRenderer';
import {
  GenericTraceableGroup,
  TraceableGroupFactory,
} from '../lab3/structures/traceable-groups/GenericTraceableGroup';
import { Color } from '../lab4/types/Color';
import { PreRenderHookable } from '../lab4/types/PreRenderHookable';
import { Hit } from './types/Hit';
import { Scene } from './types/Scene';

export default class ConsoleRenderer<
  TRendererGroup extends GenericTraceableGroup
> extends CommonRenderer<TRendererGroup> {
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
      TRendererGroup & PreRenderHookable
    >
  ) {
    super({
      scene,
      onHit: (hit, group) => {
        this.line += this.getChar(hit, group);
      },
      onRowStart: () => {
        this.line = '';
      },
      onRowEnd: () => console.log(this.line),
      traceableGroupFactory,
    });
  }

  private getChar(hit: Hit | null, traceableGroup: GenericTraceableGroup) {
    if (!hit) return ' ';
    const colorSum: Color = {
      r: 0,
      g: 0,
      b: 0,
    };
    for (const light of this.scene.lights) {
      if (light.checkShadow(hit, traceableGroup as GenericTraceableGroup))
        continue;
      const appliedColor = light.getAppliedColor(hit);
      colorSum.r += appliedColor.r;
      colorSum.g += appliedColor.g;
      colorSum.b += appliedColor.b;
    }

    hit.color = colorSum;
    const dotProduct = (hit.color.r + hit.color.g + hit.color.b) / 3;
    return ConsoleRenderer.dotProductSymbolMap(dotProduct);
  }
}
