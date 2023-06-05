import { WriteStream } from 'fs';
import { Scene } from '../../../lab1/types/Scene';
import { WriterPPM } from '../../../lab2/plugins/ppm/WriterPPM.writer';
import ImageRenderer from './ImageRenderer';
import {
  GenericTraceableGroup,
  TraceableGroupFactory,
} from '../traceable-groups/GenericTraceableGroup';
import { PreRenderHookable } from '../../../lab4/types/PreRenderHookable';

export default class PPMRenderer extends ImageRenderer {
  constructor(
    scene: Scene,
    writeStream: WriteStream,
    traceableGroupFactory: TraceableGroupFactory<
      GenericTraceableGroup & PreRenderHookable
    >
  ) {
    const writerPPM = new WriterPPM();
    super({
      scene,
      writeStream,
      imageWriter: writerPPM,
      traceableGroupFactory,
    });
  }
}
