import { ImageProcessorsMap } from '../ImageProcessorsMap';
describe('ImageProcessorsMap', () => {
  it('Should correctly fill the map', () => {
    const map = new ImageProcessorsMap();
    const readers = [
      {
        format: 'png',
        read: jest.fn(),
      },
      {
        format: 'jpg',
        read: jest.fn(),
      },
    ];
    const writers = [
      {
        format: 'png',
        write: jest.fn(),
      },
      {
        format: 'jpg',
        write: jest.fn(),
      },
    ];
    map.fillMaps(readers, writers);
    expect(map.imageReaders).toEqual(readers);
    expect(map.writersMap).toEqual({
      png: writers[0],
      jpg: writers[1],
    });
  });
});
