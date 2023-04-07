import ReaderOBJ from './ReaderOBJ';

let filePath = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i] === '--objFile') {
    filePath = process.argv[i + 1];
  }
}

ReaderOBJ.read(filePath);
