import { noise } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
const log = logger('nodes.noise');
const node: PlantNode = {
  title: 'Noise',
  type: 'noise',
  outputs: ['plant'],

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
    size: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 20,
      step: 0.05,
      value: 1,
    },
    strength: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
  },

  computeSkeleton(parameters, ctx) {
    log(parameters);

    const { input } = parameters;

    const size = ctx.handleParameter(parameters.size);
    const strength = ctx.handleParameter(parameters.strength);

    const { skeletons } = input.result;

    skeletons.forEach((skelly, j) => {
      const pathLength = skelly.length / 4;

      const lastVec = [skelly[0], skelly[1], skelly[2]];
      let distance = 0;

      for (let i = 0; i < pathLength; i++) {
        const a = i / pathLength;

        distance +=
          (Math.abs(lastVec[0] - skelly[i * 4 + 0]) +
            Math.abs(lastVec[1] - skelly[i * 4 + 1]) +
            Math.abs(lastVec[2] - skelly[i * 4 + 2])) /
          3;

        lastVec[0] = skelly[i * 4 + 0];
        lastVec[1] = skelly[i * 4 + 1];
        lastVec[2] = skelly[i * 4 + 2];

        skelly[i * 4 + 0] =
          skelly[i * 4 + 0] +
          noise.n1d(distance * size + 0 + j * 500) * strength * a;
        skelly[i * 4 + 1] =
          skelly[i * 4 + 1] +
          noise.n1d(distance * size + 1000 + j * 500) * strength * a;
        skelly[i * 4 + 2] =
          skelly[i * 4 + 2] +
          noise.n1d(distance * size + 2000 + j * 500) * strength * a;
      }
    });

    return {
      skeletons,
      allSkeletons: input.result.allSkeletons,
    };
  },

  computeGeometry(parameters) {
    return parameters.input.result;
  },
};

export default node;
