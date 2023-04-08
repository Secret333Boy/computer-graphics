import { createReadStream } from 'fs';
import ReaderOBJ from '../ReaderOBJ';
import Mesh from '../structures/mesh/Mesh';
import path from 'path';

describe('ReaderOBJ', () => {
  const testOBJFilePath = path.resolve(__dirname, './cow.obj');

  describe('read()', () => {
    it('should read an OBJ file and return a Mesh object', async () => {
      const mesh = await ReaderOBJ.read(testOBJFilePath);

      expect(mesh).toBeInstanceOf(Mesh);
      expect(mesh.triangles).toBeInstanceOf(Array);
      expect(mesh.triangles.length).toBeGreaterThan(0);
    });

    it('should throw an error if the file path is invalid', async () => {
      await expect(ReaderOBJ.read('invalid/path.obj')).rejects.toThrow();
    });
  });

  describe('readStream()', () => {
    it('should read an OBJ stream and return a Mesh object', async () => {
      const stream = createReadStream(testOBJFilePath);
      const mesh = await ReaderOBJ.readStream(stream);

      expect(mesh).toBeInstanceOf(Mesh);
      expect(mesh.triangles).toBeInstanceOf(Array);
      expect(mesh.triangles.length).toBeGreaterThan(0);
    });

    it('should throw an error if the stream is invalid', async () => {
      const invalidStream = createReadStream('invalid/path.obj');
      await expect(ReaderOBJ.readStream(invalidStream)).rejects.toThrow();
    });
  });
});
