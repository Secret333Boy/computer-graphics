import CommonRenderer from '../lab3/structures/renderers/CommonRenderer';
import {
  GenericTraceableGroup,
  ShadowTraceableGroupFactory,
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
    >,
    shadowTraceableGroupFactory: ShadowTraceableGroupFactory<
      GenericTraceableGroup & PreRenderHookable
    >
  ) {
    let shadowTraceableGroup: GenericTraceableGroup & PreRenderHookable;
    super({
      scene,
      onHit: (hit) => {
        this.line += this.getChar(
          hit,
          shadowTraceableGroup as GenericTraceableGroup
        );
      },
      onRowStart: () => {
        this.line = '';
      },
      onRowEnd: () => console.log(this.line),
      onRenderStart: (baseGroup) => {
        shadowTraceableGroup = shadowTraceableGroupFactory(
          scene.objects,
          baseGroup
        );
        shadowTraceableGroup.onPreRender?.();
      },
      traceableGroupFactory,
    });
  }

  private getChar(hit: Hit | null, traceableGroup: GenericTraceableGroup) {
    if (!hit) return ' ';

    const appliedColors: Color[] = [];
    for (const light of this.scene.lights) {
      if (light.checkShadow(hit, traceableGroup)) continue;

      appliedColors.push(light.getAppliedColor(hit));
    }

    if (appliedColors.length === 0) {
      hit.color = { r: 0, g: 0, b: 0 };
    } else {
      hit.color = appliedColors.reduce((acc, color) => ({
        r: acc.r + color.r,
        g: acc.g + color.g,
        b: acc.b + color.b,
      }));
    }
    const dotProduct = (hit.color.r + hit.color.g + hit.color.b) / 3;
    return ConsoleRenderer.dotProductSymbolMap(dotProduct);
  }
}
