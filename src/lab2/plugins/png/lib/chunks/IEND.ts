import { Chunk } from './Chunk';

export class IENDChunk extends Chunk {
  constructor() {
    super('IEND', Buffer.alloc(0));
  }
}
