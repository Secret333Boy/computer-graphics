import path from 'path';
import fs from 'fs/promises';
import { ImageWriter } from './interfaces/ImageWriter';
import { ImageReader } from './interfaces/ImageReader';

export class ImageProcessorLoader {
  public async dynamicallyLoad(pluginDirPath: string): Promise<{
    readers: ImageReader[];
    writers: ImageWriter[];
  }> {
    const dirPath = path.resolve(pluginDirPath);
    console.log('Reading files from:', dirPath);

    const files = await fs.readdir(dirPath);

    const writerImports: ImageWriter[] = [];
    const readerImports: ImageReader[] = [];

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if ((await fs.stat(filePath)).isDirectory()) {
        const { readers, writers } = await this.dynamicallyLoad(filePath);
        writerImports.push(...writers);
        readerImports.push(...readers);
        continue;
      }

      const fileExt = path.extname(file);
      const fileName = path.basename(file, fileExt);

      if (fileExt === '.js') {
        if (fileName.endsWith('writer')) {
          const importedWriter = await import(filePath);
          writerImports.push(importedWriter.default);
        } else if (fileName.endsWith('reader')) {
          const importedReader = await import(filePath);
          readerImports.push(importedReader.default);
        }
      }
    }
    return {
      readers: readerImports,
      writers: writerImports,
    };
  }
}
