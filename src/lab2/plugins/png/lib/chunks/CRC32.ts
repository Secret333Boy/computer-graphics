const crcTable = new Uint32Array(256);

let isCrcTableComputed = false;

const computeCRCTable = () => {
  if (isCrcTableComputed) return;
  let c;
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }
  isCrcTableComputed = true;
  return crcTable;
};

export const crc = (buffer: Uint8Array) => {
  computeCRCTable();
  let crc = 0 ^ -1;

  for (let i = 0; i < buffer.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buffer[i]) & 0xff];
  }

  return (crc ^ -1) >>> 0;
};
