import { WriteStream } from 'fs';
import { Scene } from '../../../lab1/types/Scene';
import ImageRenderer from './ImageRenderer';
import { WriterBMP } from '../../../lab2/plugins/bmp/bmp.writer';
import {
  GenericTraceableGroup,
  TraceableGroupFactory,
} from '../traceable-groups/GenericTraceableGroup';
import { PreRenderHookable } from '../../../lab4/types/PreRenderHookable';

export default class BMPRenderer extends ImageRenderer {
  constructor(
    scene: Scene,
    writeStream: WriteStream,
    traceableGroupFactory: TraceableGroupFactory<
      GenericTraceableGroup & PreRenderHookable
    >
  ) {
    const writerBMP = new WriterBMP();
    super({
      scene,
      writeStream,
      imageWriter: writerBMP,
      traceableGroupFactory,
    });
  }
}
