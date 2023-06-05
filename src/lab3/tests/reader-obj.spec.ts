import { createReadStream } from 'fs';
import ReaderOBJ from '../ReaderOBJ';
import Mesh from '../structures/mesh/Mesh';
import path from 'path';
import { DumbTransformableGroup } from '../structures/transformable-groups/DumbTransformableGroup';

describe('ReaderOBJ', () => {
  const testOBJFilePath = path.resolve(__dirname, './cow.obj');
  const reader = new ReaderOBJ((obj) => new DumbTransformableGroup(obj));

  describe('readStream()', () => {
    it('should read an OBJ stream and return a Mesh object', async () => {
      const stream = createReadStream(testOBJFilePath);
      const mesh = await reader.readStream(stream);

      expect(mesh).toBeInstanceOf(Mesh);
      expect(mesh.primitives).toBeInstanceOf(Array);
      expect(mesh.primitives.length).toBeGreaterThan(0);
    });

    it('should throw an error if the stream is invalid', async () => {
      const invalidStream = createReadStream('invalid/path.obj');
      await expect(reader.readStream(invalidStream)).rejects.toThrow();
    });
  });
});
