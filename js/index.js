const redInputCanvas = document.getElementById("red-canvas");

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
        updateOutput();
      });
    }
  });
}

const channels = "rgba";

function getInputChannel(outputChannel) {
  return document.querySelector(`input[name=${outputChannel}input]:checked`).value;
}

const outputCanvas = document.getElementById("output-canvas");

function updateOutput() {
  outputCanvas.width = redInputCanvas.width;
  outputCanvas.height = redInputCanvas.height;

  const outputData = getData(outputCanvas);
  const redData = getData(redInputCanvas);

  const inputChannel = getInputChannel("r");
  const channelOffset = channels.indexOf(inputChannel);

  packChannels(outputData.data, redData.data.subarray(channelOffset), redData.data.subarray(channelOffset), redData.data.subarray(channelOffset), redData.data.subarray(channelOffset));
  outputCanvas.getContext("2d").putImageData(outputData, 0, 0);
}

function getData(canvas) {
  return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

function packChannels(dst, srcR, srcG, srcB, srcA) {
  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = srcR[i];
    dst[i + 1] = srcG[i];
    dst[i + 2] = srcB[i];
    dst[i + 3] = srcA[i];
  }
}

document.getElementById("download-button").addEventListener("click", event => {
  event.target.disabled = true;

  outputCanvas.toBlob(blob => {
    event.target.disabled = false;

    const link = document.createElement("a");
    link.download = "packed.png";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
});
