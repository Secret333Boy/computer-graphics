import fs, { ReadStream } from 'fs';
import Mesh from './structures/mesh/Mesh';
import path from 'path';
import readline from 'readline';
import Vertex3D from '../lab1/structures/vertex/Vertex3D';
import Triangle from './structures/triangle/Triangle';

export default class ReaderOBJ {
  public static async read(pathToFile: string): Promise<Mesh> {
    const stream = fs.createReadStream(path.resolve(__dirname, pathToFile));
    return ReaderOBJ.readStream(stream);
  }

  public static async readStream(stream: ReadStream): Promise<Mesh> {
    const lines = readline.createInterface({
      input: stream,
      crlfDelay: Infinity,
    });

    const vertices: Vertex3D[] = [];
    const triangles: Triangle[] = [];

    for await (const line of lines) {
      if (/^v\s[0-9.-]+\s[0-9.-]+\s[0-9.-]+/.test(line)) {
        const lineParts = line.split(/\s/);
        const x = +lineParts[1];
        const y = +lineParts[2];
        const z = +lineParts[3];

        vertices.push(new Vertex3D(x, y, z));
      }

      if (
        /^f\s\d+(\/\d*)?(\/\d+)?\s\d+(\/\d*)?(\/\d+)?\s\d+(\/\d*)?(\/\d+)?/.test(
          line
        )
      ) {
        const lineParts = line.split(/\s/);
        const part1 = lineParts[1];
        const part2 = lineParts[2];
        const part3 = lineParts[3];

        const [v1, v2, v3] = [part1, part2, part3].map(
          (part) => vertices[+part.split('/')[0] - 1]
        );

        triangles.push(new Triangle(v1, v2, v3));
      }
    }

    lines.close();

    return new Mesh(triangles);
  }
}
