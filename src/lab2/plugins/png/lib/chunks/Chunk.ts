import { PassThrough, Readable, Writable } from 'stream';
import { crc } from './CRC32';
import { readNBytes } from '../../../helpers';

export class Chunk {
  public length: number;
  public type: string;
  public data: Buffer;
  public crc: number;

  constructor(type: string, data: Buffer, length?: number, crc?: number) {
    this.length = length ?? data.length;
    this.type = type;
    this.data = data;
    this.crc = crc ?? this.calculateCRC();
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

  public static async chunkFromStream(stream: Readable): Promise<Chunk> {
    const length: number = await readNBytes(4, stream).then((buf) => {
      console.log(buf);
      return buf.readUInt32BE();
    });
    console.log(length);
    const type: string = await readNBytes(4, stream).then((buf) =>
      buf.toString('ascii')
    );
    console.log(type);
    const data: Buffer = await readNBytes(length, stream);
    const crc: number = await readNBytes(4, stream).then((buf) =>
      buf.readUInt32BE()
    );
    return new Chunk(type, data, length, crc);
  }
}
