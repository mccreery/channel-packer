const CHANNELS = "rgba";

function addInputListeners(button, canvas) {
  button.addEventListener("click", event => {

  });
}

function packChannels(dst, srcR, srcG, srcB, srcA) {
  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = srcR[i];
    dst[i + 1] = srcG[i];
    dst[i + 2] = srcB[i];
    dst[i + 3] = srcA[i];
  }
}
