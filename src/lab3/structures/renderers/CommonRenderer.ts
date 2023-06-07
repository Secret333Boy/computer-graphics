import Ray from '../../../lab1/structures/ray/Ray';
import { Hit } from '../../../lab1/types/Hit';
import { Renderer } from '../../../lab1/types/Renderer';
import { Scene } from '../../../lab1/types/Scene';
import { PreRenderHookable } from '../../../lab4/types/PreRenderHookable';
import {
  GenericTraceableGroup,
  TraceableGroupFactory,
} from '../traceable-groups/GenericTraceableGroup';

export interface CommonRendererProps<
  TTraceableGroup extends GenericTraceableGroup
> {
  scene: Scene;
  onHit: (hit: Hit | null, traceableGroup: TTraceableGroup) => Promise<void> | void;
  onRowStart?: () => Promise<void> | void;
  onRowEnd?: () => Promise<void> | void;
  onRenderStart?: (baseTraceableGroup: TTraceableGroup) => Promise<void> | void;
  onRenderEnd?: () => Promise<void> | void;
  traceableGroupFactory: TraceableGroupFactory<
    TTraceableGroup & PreRenderHookable
  >;
}

export default abstract class CommonRenderer<
  TTraceableGroup extends GenericTraceableGroup
> implements Renderer
{
  public readonly scene: Scene;
  private readonly onHit: (hit: Hit | null, traceableGroup: TTraceableGroup) => Promise<void> | void;
  private readonly onRowStart?: () => Promise<void> | void;
  private readonly onRowEnd?: () => Promise<void> | void;
  private readonly onRenderStart?: (
    baseTraceableGroup: TTraceableGroup
  ) => Promise<void> | void;
  private readonly onRenderEnd?: () => Promise<void> | void;
  private readonly traceableGroupFactory: TraceableGroupFactory<
    TTraceableGroup & PreRenderHookable
  >;

  constructor(props: CommonRendererProps<TTraceableGroup>) {
    const {
      scene,
      onHit,
      onRowStart,
      onRowEnd,
      onRenderStart,
      onRenderEnd,
      traceableGroupFactory,
    } = props;
    this.scene = scene;
    this.onHit = onHit;
    this.onRowStart = onRowStart;
    this.onRowEnd = onRowEnd;
    this.onRenderStart = onRenderStart;
    this.onRenderEnd = onRenderEnd;
    this.traceableGroupFactory = traceableGroupFactory;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async render() {
    const traceableGroup = this.traceableGroupFactory(this.scene.objects);
    traceableGroup.onPreRender?.();
    const { camera } = this.scene;

    await this.onRenderStart?.(traceableGroup);

    for (let y = 0; y < camera.verticalResolution; y++) {
      await this.onRowStart?.();
      for (let x = 0; x < camera.horizontalResolution; x++) {
        const screenPixelVector = camera.getScreenPixelVector(x, y);
        const ray = new Ray(camera.focalPoint, screenPixelVector);
        const hit = traceableGroup.getIntersection(ray);
        await this.onHit(hit, traceableGroup);
      }
      await this.onRowEnd?.();
    }

    await this.onRenderEnd?.();
  }
}
