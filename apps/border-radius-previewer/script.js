const brBox = document.getElementById("br-box");
const brText = document.getElementById("br-text");
const cssOutput = document.getElementById("css-output");
const copyBtn = document.getElementById("copy-btn");

// Get all sliders
const sliders = {
  tl: document.getElementById("tl"),
  tr: document.getElementById("tr"),
  br: document.getElementById("br"),
  bl: document.getElementById("bl"),
};

// Get value spans
const values = {
  tl: document.getElementById("tl-value"),
  tr: document.getElementById("tr-value"),
  br: document.getElementById("br-value"),
  bl: document.getElementById("bl-value"),
};

function updateBorderRadius() {
  const tl = sliders.tl.value;
  const tr = sliders.tr.value;
  const br = sliders.br.value;
  const bl = sliders.bl.value;

  // Update box style
  brBox.style.borderRadius = `${tl}% ${tr}% ${br}% ${bl}%`;

  // Update text
  brText.textContent = `${tl}% ${tr}% ${br}% ${bl}%`;

  // Update CSS output
  cssOutput.value = `border-radius: ${tl}% ${tr}% ${br}% ${bl}%;`;

  // Update value displays
  values.tl.textContent = `${tl}%`;
  values.tr.textContent = `${tr}%`;
  values.br.textContent = `${br}%`;
  values.bl.textContent = `${bl}%`;
}

function copyCSS() {
  cssOutput.select();
  document.execCommand("copy");
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy CSS";
  }, 2000);
}

// Initial update
updateBorderRadius();
