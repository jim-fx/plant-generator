import projectManager from "../project-manager";
const pdDisplay = <HTMLElement>document.getElementById("pd-display");
const dlAnchorElem = <HTMLAnchorElement>document.getElementById("downloadAnchorElem");

let pd: plantDescription;
let nextStage: Stage;

const exp = {
  set pd(_pd: plantDescription) {
    pd = _pd;
    pdDisplay.innerHTML = JSON.stringify(_pd, null, 2);
    projectManager.save(_pd);
  },
  get pd(): plantDescription {
    return pd;
  },
  init: function(_pd: plantDescription) {
    this.pd = _pd;
    if (nextStage) {
      nextStage.init(_pd);
    }
  },
  download: (_pd: plantDescription) => {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(_pd));
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", pd.meta.name + ".json");
    dlAnchorElem.click();
  },
  connect: (_nextStage: Stage) => {
    nextStage = _nextStage;
  }
};

export default exp;
