import curveToArray from "./helper/curveToArray";
import { tube } from "./geometry";
import noise from "./helper/noise";

let geometry: TransferGeometry;
let oldDescription: string;

function getStemDiameter(diameter: parameter, i: number) {
  let v = 0.1;

  if ("variation" in diameter) {
    v = diameter.value - diameter.value * diameter.variation * ((noise.n1d(93815 + i * 200) + 1) / 2);
  } else {
    v = diameter.value;
  }

  if (diameter.curve && diameter.curve.length) {
    return curveToArray(diameter.curve).map((_v: number) => v * _v);
  } else {
    return [0, 1 * v];
  }
}

export default function(stem: stemDescription, settings: settings, skeleton: Float32Array, i: number): TransferGeometry {
  //Check if we need to regenerate
  /*const newDescription = JSON.stringify(stem);
  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
    return geometry;
  }*/

  const diameter = getStemDiameter(stem.diameter, i);
  const resX = settings.stemResX || 3;

  return tube(skeleton, diameter, resX);
}
