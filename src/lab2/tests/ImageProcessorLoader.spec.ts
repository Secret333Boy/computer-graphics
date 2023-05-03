/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';
import { ImageProcessorLoader } from '../ImageProcessorLoader';
const ReaderPNG = require('./mock-processors/png/Png.reader.js');
const ReaderPPM = require('./mock-processors/ppm/Ppm.reader.js');
const WriterPNG = require('./mock-processors/png/Png.writer.js');
const WriterPPM = require('./mock-processors/ppm/Ppm.writer.js');

describe('ImageProcessorLoader', () => {
  let imageProcessorLoader: ImageProcessorLoader;
  beforeEach(() => {
    imageProcessorLoader = new ImageProcessorLoader();
  });
  it('Should correctly load plugins', async () => {
    const importPath = path.resolve(__dirname, 'mock-processors');
    const { readers, writers } = await imageProcessorLoader.dynamicallyLoad(
      importPath
    );
    const expectedReaders = [ReaderPNG, ReaderPPM];
    const expectedWriters = [WriterPNG, WriterPPM];
    expect(readers).toEqual(expect.arrayContaining(expectedReaders));
    expect(writers).toEqual(expect.arrayContaining(expectedWriters));
  });
});
