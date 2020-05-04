import { Vec3 } from "ogl";
import { interpolateArray, draw } from "../helper";
import ring from "./ring";

function mergeRings(rings: Float32Array[], position: Float32Array) {
  let offset = 0;
  const l = rings.length;
  for (let i = 0; i < l; i++) {
    const r = rings[i];
    const _l = r.length;
    for (let j = 0; j < _l; j++) position[offset + j] = r[j];
    offset += _l;
  }
}

export default function(
  skeleton: Float32Array,
  diameter: number[],
  resX: number
): TransferGeometry {
  const resY = skeleton.length / 3;

  const numPosition = resY * resX * 3;
  const numIndices = resY * resX * 6 - resX * 6;
  const numUV = resY * resX * 2;

  const position = new Float32Array(numPosition);
  const normal = new Float32Array(numPosition);
  const uv = new Float32Array(numUV);
  const index =
    numIndices > 65536
      ? new Uint32Array(numIndices)
      : new Uint16Array(numIndices);

  const rings = [];

  //Create all rings
  let axis: Vec3;
  for (let i = 0; i < resY; i++) {
    const _diameter = interpolateArray(diameter, 1 - i / (resY - 1));

    //create the uvs
    for (let j = 0; j < resX; j++) {
      const offset = i * resX * 2 + j * 2;
      uv[offset + 0] = -0.5 - j / resX;
      uv[offset + 1] = i / resY;
    }

    //Current point along line
    const origin = new Vec3(
      skeleton[i * 3 + 0],
      skeleton[i * 3 + 1],
      skeleton[i * 3 + 2]
    );

    if (i < resY - 1) {
      //Next point along line
      const next = new Vec3(
        skeleton[i * 3 + 3],
        skeleton[i * 3 + 4],
        skeleton[i * 3 + 5]
      );
      axis = next.sub(origin);
      rings[i] = ring(origin, axis, _diameter, resX);
    } else {
      rings[i] = ring(origin, axis, _diameter, resX);
    }
  }

  mergeRings(rings, position);

  //Create the indeces
  for (let i = 0; i < resY; i++) {
    const indexOffset = i * resX * 6;
    const positionOffset = i * resX;
    for (let j = 0; j < resX; j++) {
      const _indexOffset = indexOffset + j * 6;
      const _positionOffset = positionOffset + j;

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

  return {
    position,
    normal,
    uv,
    index
  };
}
