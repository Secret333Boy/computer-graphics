import { PassThrough, Readable, Writable } from 'stream';
import { crc } from './CRC32';

export class Chunk {
  public readonly length: number;
  public readonly type: string;
  public readonly data: Buffer;
  public readonly crc: number;

  constructor(type: string, data: Buffer) {
    this.length = data.length;
    this.type = type;
    this.data = data;
    this.crc = this.calculateCRC();
  }

  private calculateCRC() {
    const buf = Buffer.alloc(this.length + 4);
    buf.write(this.type, 0, 4, 'ascii');
    this.data.copy(buf, 4);
    return crc(buf);
  }

  public write(stream: Writable) {
    const buffer = this.toBuffer();
    stream.write(buffer);
  }

  public toBuffer(): Buffer {
    const buf = Buffer.alloc(this.length + 12);
    buf.writeUInt32BE(this.length, 0);
    buf.write(this.type, 4, 4, 'ascii');
    this.data.copy(buf, 8);
    buf.writeUInt32BE(this.crc, this.length + 8);
    return buf;
  }

  public toStream(): Readable {
    const stream = new PassThrough();
    this.write(stream);
    return stream;
  }
}
