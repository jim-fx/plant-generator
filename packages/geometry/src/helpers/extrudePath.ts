import { mat4, vec3 } from "gl-matrix";

const { identity, rotate } = mat4;
const { add, cross, dot, mul, normalize, subtract, scale, transformMat4 } = vec3;

function createCircle(res: number) {
  const angle = (2 * Math.PI) / res;

  return new Array(res).fill(null).map((_, i) => {
    return [Math.cos(angle * i), Math.sin(angle * i)];
  });
}

function createIndeces(resX: number, stemLength = 1) {
  const index = new Uint16Array(resX * (Math.max(stemLength, 1) - 1) * 6);

  for (let i = 0; i < stemLength; i++) {
    const indexOffset = i * resX * 6;
    const positionOffset = i * resX;
    for (let j = 0; j < resX; j++) {
      const _indexOffset = indexOffset + j * 6;
      const _positionOffset = positionOffset + j;

      index[_indexOffset + 0] = _positionOffset;
      index[_indexOffset + 1] = _positionOffset - resX + 1;
      index[_indexOffset + 2] = _positionOffset + 1;

      index[_indexOffset + 3] = _positionOffset + 1;
      index[_indexOffset + 4] = _positionOffset + resX;
      index[_indexOffset + 5] = _positionOffset;

      if (j === resX - 1) {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset - resX + 1;
        index[_indexOffset + 2] = _positionOffset + 1;

        index[_indexOffset + 3] = _positionOffset + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 5] = _positionOffset;
      } else {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset + 1;
        index[_indexOffset + 2] = _positionOffset + resX + 1;

        index[_indexOffset + 3] = _positionOffset + resX + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 5] = _positionOffset;
      }
    }
  }

  return index;
}

export default function(path: [number, number, number, number][], resolution = 3) {
  const mat = [],
    v = [],
    axis = [];

  const mesh = { position: [], normals: [], index: createIndeces(resolution, path.length) };

  const position = createCircle(resolution);

  const positionAmount = position.length,
    pathLength = path.length;

  for (let i = 0; i < pathLength; i++) {
    const n = [0, 0, 1];
    if (i === 0) {
      subtract(v, path[i], path[i + 1]);
    } else if (i === pathLength - 1) {
      subtract(v, path[i - 1], path[i]);
    } else {
      subtract(v, path[i - 1], path[i + 1]);
    }
    normalize(v, v);
    cross(axis, n, v);
    const angle = Math.acos(dot(n, v));
    identity(mat);
    rotate(mat, mat, angle, axis);

    for (let j = 0; j < positionAmount; j++) {
      const p = position[j];
      const pt = [p[0], p[1], 0];
      const thicc = path[i][3];
      mul(pt, pt, [thicc, thicc, 1]);
      transformMat4(pt, pt, mat);
      const normal = []
      normalize(normal, pt)
      scale(normal, [-0, -0, -0]);
      mesh.normals.push(normal);
      add(pt, pt, path[i]);
      mesh.position.push(pt);
    }
  }

  return mesh;
}
