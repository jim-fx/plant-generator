import msGraph from "./msGraph";
import debug3D from "./3d";
const wrapper = <HTMLElement>document.getElementById("overlay-wrapper");

const renderPerf = msGraph("render", 0, 0, wrapper);
const generatePerf = msGraph("generate", 0, 100, wrapper);

const pdDisplay = <HTMLElement>document.getElementById("pd-display");
let showPD = false;

export default {
  ms: (ms: number) => renderPerf(ms),
  gen: (ms: number) => generatePerf(ms),
  debug3d: debug3D,
  pd: (_pd: plantDescription) => {
    if (!showPD) return;
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
  },
  update: (s: settings) => {
    if (s["debug_generate_perf"]) {
      generatePerf.show();
    } else {
      generatePerf.hide();
    }

    if (s["debug_render_perf"]) {
      renderPerf.show();
    } else {
      renderPerf.hide();
    }

    if (s["debug_indices"]) {
      debug3D.show();
    } else {
      debug3D.hide();
    }

    if (s["debug_pd"]) {
      pdDisplay.style.display = "";
      showPD = true;
    } else {
      pdDisplay.style.display = "none";
      showPD = false;
    }
  }
};
