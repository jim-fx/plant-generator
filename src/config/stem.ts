export default {
  title: "stem",
  type: "stage",
  children: [
    {
      type: "Number",
      title: "Amount",
      min: 1,
      max: 150,
      init: (pd: plantDescription) => {
        return pd.stem.amount;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.stem.amount = output.value;
      }
    },
    {
      type: "Slider",
      title: "Gravity",
      min: 0.001,
      max: 1,
      init: (pd: plantDescription) => {
        return pd.stem.gravity;
      },
      onUpdate: (output: parameter, originalState: plantDescription) => {
        originalState.stem.gravity = output.value;
      }
    },
    {
      title: "Origin",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Position",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.stem.originOffset.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.originOffset.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Position Variation",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.stem.originOffset.variation || 0;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.stem.originOffset.variation;
            } else {
              originalState.stem.originOffset.variation = output.value;
            }
          }
        },
        {
          type: "Slider",
          title: "Rotation",
          default: 0,
          min: 0,
          max: 360,
          init: (pd: plantDescription) => {
            return pd.stem.originRotation.value || 0;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.originRotation.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Rotation Variation",
          default: 0,
          min: 0,
          max: 360,
          init: (pd: plantDescription) => {
            return pd.stem.originRotation.variation || 0;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.stem.originRotation.variation;
            } else {
              originalState.stem.originRotation.variation = output.value;
            }
          }
        },
        {
          type: "Slider",
          title: "Angle",
          default: 0,
          min: 0,
          max: 90,
          init: (pd: plantDescription) => {
            return pd.stem.originAngle.value || 0;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.originAngle.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Angle Variation",
          default: 0,
          min: 0,
          max: 1.57,
          init: (pd: plantDescription) => {
            if ("variation" in pd.stem.originAngle) {
              return pd.stem.originAngle.variation;
            } else {
              return 0;
            }
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.stem.originAngle.variation;
            } else {
              originalState.stem.originAngle.variation = output.value;
            }
          }
        }
      ]
    },
    {
      title: "Thiccness",
      type: "Group",
      children: [
        {
          type: "Slider",
          title: "Diameter",
          min: 0.002,
          max: 0.1,
          init: (pd: plantDescription) => {
            return pd.stem.diameter.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.diameter.value = output.value;
          }
        },
        {
          type: "Slider",
          title: "Diameter Variation",
          default: 0,
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.stem.diameter.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.stem.diameter.variation;
            } else {
              originalState.stem.diameter.variation = output.value;
            }
          }
        },
        {
          type: "Curve",
          title: "Stem Diameter",
          init: (pd: plantDescription) => {
            return pd.stem.diameter.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.stem.diameter.curve;
            } else {
              originalState.stem.diameter.curve = output.curve;
            }
          }
        }
      ]
    },
    {
      type: "Group",
      title: "Noise",
      children: [
        {
          type: "Slider",
          title: "Scale",
          min: 1,
          max: 10,
          init: (pd: plantDescription) => {
            return pd.stem.noiseScale;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.noiseScale = output.value;
          }
        },
        {
          type: "Slider",
          title: "Strength",
          min: 0,
          max: 1,
          init: (pd: plantDescription) => {
            return pd.stem.noiseStrength.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.noiseStrength.value = output.value;
          }
        },
        {
          type: "Curve",
          title: "Strength Curve",
          init: (pd: plantDescription) => {
            return pd.stem.noiseStrength.curve;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.curve && output.curve.length <= 2) {
              delete originalState.stem.noiseStrength.curve;
            } else {
              originalState.stem.noiseStrength.curve = output.curve;
            }
          }
        }
      ]
    },
    {
      type: "Group",
      title: "Size",
      children: [
        {
          type: "Slider",
          title: "Size",
          min: 0.1,
          max: 4,
          init: (pd: plantDescription) => {
            return pd.stem.size.value;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            originalState.stem.size.value = output.value;
          }
        },
        {
          type: "Slider",
          default: 0,
          min: 0,
          max: 1,
          title: "Size Variation",
          init: (pd: plantDescription) => {
            return pd.stem.size.variation;
          },
          onUpdate: (output: parameter, originalState: plantDescription) => {
            if (output.value === 0) {
              delete originalState.stem.size.variation;
            } else {
              originalState.stem.size.variation = output.value;
            }
          }
        }
      ]
    }
  ]
};
