const startStopBtn = document.getElementById("start-stop-btn");
const intervalInput = document.getElementById("interval-input");
const rowsInput = document.getElementById("rows-input");
const intensityInput = document.getElementById("intensity-input");
const lightsContainer = document.getElementById("lights-container");
const customizationDiv = document.getElementById("customization");
const snowContainer = document.getElementById("snow");

let intervalId = null;
let currentIndex = 0;
let isRunning = false;
let lights = [];
let lightConfigs = [];

// Christmas color palette
const christmasColors = [
  "#ff0000", // Red
  "#ffd700", // Gold
  "#00ff00", // Green
  "#0000ff", // Blue
  "#ff00ff", // Magenta
  "#ff4500", // Orange Red
  "#ffffff", // White
];

// Initialize snow effect
function createSnowflakes() {
  const snowflakeCount = 50;
  const snowflakeChars = ["❄", "❅", "✻", "✼", "❆"];

  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.textContent =
      snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];
    snowflake.style.left = Math.random() * 100 + "%";
    snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
    snowflake.style.animationDuration = Math.random() * 8 + 5 + "s";
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.opacity = Math.random() * 0.6 + 0.3;
    snowContainer.appendChild(snowflake);
  }
}

function generateLights() {
  const numRows = parseInt(rowsInput.value);
  lightsContainer.innerHTML = "";
  customizationDiv.innerHTML = "";
  lights = [];
  lightConfigs = [];

  for (let row = 0; row < numRows; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "light-row";

    // Add wire for this row
    const wire = document.createElement("div");
    wire.className = "wire";
    rowDiv.appendChild(wire);

    lightsContainer.appendChild(rowDiv);

    for (let i = 0; i < 7; i++) {
      const light = document.createElement("div");
      light.className = "light";
      const color = christmasColors[i];
      light.style.setProperty("--light-color", color);
      light.style.backgroundColor = color;
      rowDiv.appendChild(light);
      lights.push(light);

      // Store config
      lightConfigs.push({
        color: color,
        size: 40,
        row: row,
        col: i,
      });
    }
  }

  generateCustomizationControls();
}

function generateCustomizationControls() {
  customizationDiv.innerHTML = "";

  lights.forEach((light, index) => {
    const controlDiv = document.createElement("div");
    controlDiv.className = "light-control";

    const title = document.createElement("h4");
    const row = Math.floor(index / 7) + 1;
    const col = (index % 7) + 1;
    title.textContent = `Row ${row}, Light ${col}`;

    // Color picker container
    const colorContainer = document.createElement("div");
    colorContainer.className = "color-picker-container";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.className = "color-input";
    colorInput.value = lightConfigs[index].color;
    colorInput.addEventListener("change", () => {
      const newColor = colorInput.value;
      lightConfigs[index].color = newColor;
      light.style.setProperty("--light-color", newColor);
      light.style.backgroundColor = newColor;
    });

    colorContainer.appendChild(colorInput);

    // Size input container
    const sizeContainer = document.createElement("div");
    sizeContainer.className = "size-input-container";

    const sizeLabel = document.createElement("label");
    sizeLabel.className = "size-label";
    sizeLabel.textContent = "Size (px)";

    const sizeInput = document.createElement("input");
    sizeInput.type = "number";
    sizeInput.className = "size-input";
    sizeInput.value = lightConfigs[index].size;
    sizeInput.min = 20;
    sizeInput.max = 80;
    sizeInput.addEventListener("change", () => {
      const height = parseInt(sizeInput.value);
      const width = Math.round((height * 22) / 40);
      lightConfigs[index].size = height;
      light.style.width = `${width}px`;
      light.style.height = `${height}px`;
    });

    sizeContainer.appendChild(sizeLabel);
    sizeContainer.appendChild(sizeInput);

    controlDiv.appendChild(title);
    controlDiv.appendChild(colorContainer);
    controlDiv.appendChild(sizeContainer);
    customizationDiv.appendChild(controlDiv);
  });
}

function startLights() {
  if (isRunning) return;

  isRunning = true;
  startStopBtn.textContent = "🛑 Stop Display";
  startStopBtn.className = "stop-btn";

  const intensity = parseFloat(intensityInput.value);

  intervalId = setInterval(() => {
    // Reset all lights to dim
    lights.forEach((light) => {
      light.classList.remove("on");
    });

    // Brighten current light
    if (lights[currentIndex]) {
      lights[currentIndex].classList.add("on");
    }

    // Move to next light
    currentIndex = (currentIndex + 1) % lights.length;
  }, parseInt(intervalInput.value));
}

function stopLights() {
  if (!isRunning) return;

  isRunning = false;
  startStopBtn.textContent = "🎅 Start Display";
  startStopBtn.className = "start-btn";
  clearInterval(intervalId);

  // Reset all lights to dim
  lights.forEach((light) => {
    light.classList.remove("on");
  });
  currentIndex = 0;
}

function updateLights() {
  const wasRunning = isRunning;
  stopLights();
  generateLights();
  if (wasRunning) {
    setTimeout(startLights, 100);
  }
}

function updateSpeed() {
  if (isRunning) {
    stopLights();
    startLights();
  }
}

// Event listeners
startStopBtn.addEventListener("click", () => {
  if (isRunning) {
    stopLights();
  } else {
    startLights();
  }
});

intervalInput.addEventListener("change", updateSpeed);
intervalInput.addEventListener("input", updateSpeed);

rowsInput.addEventListener("change", updateLights);

intensityInput.addEventListener("input", () => {
  const intensity = parseFloat(intensityInput.value);
  document.documentElement.style.setProperty("--global-intensity", intensity);
});

// Keyboard controls
document.addEventListener("keydown", (e) => {
  switch (e.code) {
    case "Space":
      e.preventDefault();
      if (isRunning) {
        stopLights();
      } else {
        startLights();
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      intervalInput.value = Math.max(100, parseInt(intervalInput.value) - 50);
      updateSpeed();
      break;
    case "ArrowDown":
      e.preventDefault();
      intervalInput.value = Math.min(2000, parseInt(intervalInput.value) + 50);
      updateSpeed();
      break;
  }
});

// Initialize everything
createSnowflakes();
generateLights();

// Add some festive touches
document.title = "🎄 Christmas Lights Display 🎄";

// Add responsive behavior
window.addEventListener("resize", () => {
  // Regenerate lights on resize to maintain proper spacing
  if (window.innerWidth < 768) {
    // Adjust for mobile
    document.querySelector(".lightrope").style.transform = "scale(0.8)";
  } else {
    document.querySelector(".lightrope").style.transform = "scale(1)";
  }
});
