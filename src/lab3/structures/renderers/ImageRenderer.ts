import { WriteStream } from 'fs';
import { PassThrough } from 'stream';
import { Scene } from '../../../lab1/types/Scene';
import { ImageBuffer } from '../../../lab2/ImageBuffer';
import { ImageWriter } from '../../../lab2/interfaces/ImageWriter';
import CommonRenderer from './CommonRenderer';
import { Color } from '../../../lab4/types/Color';
import {
  GenericTraceableGroup,
  ShadowTraceableGroupFactory,
  TraceableGroupFactory,
} from '../traceable-groups/GenericTraceableGroup';
import { PreRenderHookable } from '../../../lab4/types/PreRenderHookable';

export interface ImageRendererProps<
  TRendererGroup extends GenericTraceableGroup
> {
  scene: Scene;
  writeStream: WriteStream;
  imageWriter: ImageWriter;
  traceableGroupFactory: TraceableGroupFactory<
    TRendererGroup & PreRenderHookable
  >;
  shadowTraceableGroupFactory: ShadowTraceableGroupFactory<
    GenericTraceableGroup & PreRenderHookable,
    TRendererGroup
  >;
}

export default abstract class ImageRenderer<
  TRendererGroup extends GenericTraceableGroup
> extends CommonRenderer<TRendererGroup> {
  private linesRendered = 0;
  constructor(props: ImageRendererProps<TRendererGroup>) {
    const {
      scene,
      writeStream,
      imageWriter,
      traceableGroupFactory,
      shadowTraceableGroupFactory,
    } = props;

    const pixelsStream = new PassThrough({ objectMode: true });

    const imageBuffer = new ImageBuffer(
      {
        height: scene.camera.verticalResolution,
        width: scene.camera.horizontalResolution,
        maxColor: 255,
      },
      pixelsStream
    );

    const stream = imageWriter.write(imageBuffer);
    stream.pipe(writeStream);
    let shadowTraceableGroup: GenericTraceableGroup & PreRenderHookable;
    super({
      scene,
      onHit: (hit) => {
        if (!hit) {
          pixelsStream.push({ r: 0, g: 0, b: 0 });
          return;
        }

        const colorSum: Color = {
          r: 0,
          g: 0,
          b: 0,
        };
        for (const light of scene.lights) {
          if (
            light.checkShadow(
              hit,
              shadowTraceableGroup as GenericTraceableGroup
            )
          )
            continue;
          const appliedColor = light.getAppliedColor(hit);
          colorSum.r += appliedColor.r;
          colorSum.g += appliedColor.g;
          colorSum.b += appliedColor.b;
        }

        hit.color = colorSum;

        pixelsStream.push({
          r: hit.color.r > 1 ? 255 : Math.round(hit.color.r * 255),
          g: hit.color.g > 1 ? 255 : Math.round(hit.color.g * 255),
          b: hit.color.b > 1 ? 255 : Math.round(hit.color.b * 255),
        });
      },
      onRenderStart: (baseTraceableGroup) => {
        console.log('Rendering started');
        shadowTraceableGroup = shadowTraceableGroupFactory(
          scene.objects,
          baseTraceableGroup
        );
        shadowTraceableGroup.onPreRender?.();
        this.linesRendered = 0;
      },
      onRowEnd: () => {
        this.linesRendered++;
        if (this.linesRendered % 10 === 0) {
          console.log(`Rendered ${this.linesRendered} lines`);
        }
      },
      onRenderEnd: () => {
        pixelsStream.end();
      },
      traceableGroupFactory,
    });
  }
}
