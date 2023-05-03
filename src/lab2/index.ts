import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { ImageProcessorLoader } from './ImageProcessorLoader';
import { ImageProcessorsMap } from './ImageProcessorsMap';
import { ImageConvertor } from './ImageConvertor';

const main = async () => {
  const loadingPath = process.argv[3];
  const imageProcessorLoader = new ImageProcessorLoader();
  const processors = await imageProcessorLoader.dynamicallyLoad(loadingPath);
  const imageMap = new ImageProcessorsMap();
  imageMap.fillMaps(processors.readers, processors.writers);
  const imageConverter = new ImageConvertor(imageMap);
  const { stream } = await imageConverter.convert(
    {
      getStream() {
        return createReadStream(path.resolve(__dirname, process.argv[5]));
      },
      disposeStream(stream) {
        stream.destroy();
      },
    },
    process.argv[7]
  );
  const writeStream = createWriteStream(
    path.resolve(__dirname, `file.${process.argv[7]}`)
  );
  stream.pipe(writeStream);
};
main();
