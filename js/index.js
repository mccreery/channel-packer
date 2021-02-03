// Constants

const channels = [ "red", "green", "blue", "alpha" ];
const output = document.getElementById("output-canvas");
const inputs = channels.map(channel => document.getElementById(`${channel}-input`));

// Functions

async function updateInputs(startIndex, files) {
  for (let i = 0; i < files.length; i++) {
    await drawImage(inputs[(startIndex + i) % inputs.length], files[i]);
  }
}

function drawImage(input, blob) {
  return createImageBitmap(blob).then(image => {
    const canvas = input.querySelector("canvas");

    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext("2d").drawImage(image, 0, 0);

    input.classList.add("present");
  });
}

function updateOutput() {
  const [ width, height ] = getInputSize();

  output.width = width;
  output.height = height;

  const inputData = inputs.map(input => {
    if (input.classList.contains("present")) {
      const context = input.querySelector("canvas").getContext("2d");
      const data = context.getImageData(0, 0, width, height).data;
      const selectedChannel = input.querySelector("form").elements["channel"].value;

      return data.subarray(channels.indexOf(selectedChannel));
    } else {
      return null;
    }
  });

  const context = output.getContext("2d");
  const outputData = context.createImageData(width, height);

  packChannels(outputData.data, inputData);
  context.putImageData(outputData, 0, 0);
}

function getInputSize() {
  let width, height;

  for (const input of inputs) {
    if (!input.classList.contains("present")) continue;
    const canvas = input.querySelector("canvas");

    if (width === undefined) {
      width = canvas.width;
      height = canvas.height;
    } else if (width !== canvas.width || height !== canvas.height) {
      throw `Input images are different sizes: ${width}x${height} and ${canvas.width}x${canvas.height}`;
    }
  }

  if (width === undefined || height === undefined) {
    throw "No images";
  }

  return [ width, height ];
}

function packChannels(outputData, inputData) {
  const defaultValues = [ 0, 0, 0, 255 ];

  for (let i = 0; i < 4; i++) {
    const data = inputData[i];

    if (data !== null) {
      copy(outputData, data, i, 4);
    } else {
      fill(outputData, defaultValues[i], i, 4);
    }
  }
}

function fill(outArray, value, start, stride) {
  for (let i = start; i < outArray.length; i += stride) {
    outArray[i] = value;
  }
}

function copy(outArray, inArray, start, stride) {
  for (let i = start; i < outArray.length; i += stride) {
    outArray[i] = inArray[i];
  }
}

// Entry point

for (let i = 0; i < inputs.length; i++) {
  const input = inputs[i];

  // Update output canvas when new file is added
  const fileInput = input.querySelector("input[type=file]");
  fileInput.addEventListener("change", event => {
    updateInputs(i, event.target.files).then(updateOutput);
  });

  // Update output canvas when different channel is selected
  const form = input.querySelector("form");
  form.addEventListener("change", updateOutput);
}

document.getElementById("download-button").addEventListener("click", event => {
  event.target.disabled = true;

  output.toBlob(blob => {
    event.target.disabled = false;

    const link = document.createElement("a");
    link.download = "packed.png";
    link.href = URL.createObjectURL(blob);
    link.click();
  });
});
