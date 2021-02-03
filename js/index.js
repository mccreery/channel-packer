const CHANNELS = "rgba";

addInputListeners(document.getElementById("red-file"), document.getElementById("red-canvas"));

function addInputListeners(fileInput, canvas) {
  fileInput.addEventListener("change", event => {
    if (fileInput.files.length > 0) {
      createImageBitmap(fileInput.files[0]).then(image => {
        canvas.width = image.width;
        canvas.height = image.height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        canvas.style.visibility = "visible";
      });
    }
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
