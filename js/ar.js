// ar.js — step-based AR navigation

// Read query params (optional)
const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

// Arrow entity (A-Frame)
const arrowEntity = document.getElementById("arrowEntity");

// Hardcoded path: distance in steps, turn in degrees
const path = [
  { action: "move", distance: 10 },   // walk 4 steps forward
  { action: "turn", degrees: 90 },   // turn right 90°
  { action: "move", distance: 8 },
  { action: "turn", degrees: -90 },  // turn left 90°
  { action: "move", distance: 6 }
  { action: "turn", degrees: 90 }, // turn around
  { action: "move", distance: 6 }
];

let currentStep = 0;
let lastAccel = null;
let heading = 0; // compass heading (0-360°)

// Step detection
window.addEventListener('devicemotion', (event) => {
  const acc = event.accelerationIncludingGravity;
  if (!lastAccel) { lastAccel = acc; return; }

  const delta = Math.sqrt(
    Math.pow(acc.x - lastAccel.x, 2) +
    Math.pow(acc.y - lastAccel.y, 2) +
    Math.pow(acc.z - lastAccel.z, 2)
  );

  if (delta > 1.2) { // tweak threshold for sensitivity
    advanceStep();
  }

  lastAccel = acc;
});

// Compass heading
window.addEventListener('deviceorientation', (event) => {
  heading = event.alpha || 0; // 0-360°
  updateArrowRotation();
});

// Advance along the path
function advanceStep() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    step.distance--;
    if (step.distance <= 0) {
      currentStep++;
      updateArrowRotation();
    }
  }
}

// Update arrow based on path
function updateArrowRotation() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    // walking forward → arrow points straight
    arrowEntity.setAttribute("rotation", `0 0 0`);
  } else if (step.action === "turn") {
    // show turn arrow (left/right)
    arrowEntity.setAttribute("rotation", `0 ${step.degrees} 0`);
    waitForTurn(step.degrees);
  }
}

// Wait for user to physically turn
function waitForTurn(turnDegrees) {
  const targetHeading = (heading + turnDegrees + 360) % 360;

  const turnCheck = () => {
    const diff = Math.abs(normalizeAngle(targetHeading - heading));
    if (diff < 15) { // user aligned within ±15°
      currentStep++;
      updateArrowRotation(); // arrow straightens
      advanceStep();
    } else {
      requestAnimationFrame(turnCheck);
    }
  };
  turnCheck();
}

// Normalize angle to [-180, 180]
function normalizeAngle(angle) {
  angle = ((angle + 180) % 360) - 180;
  return angle;
}

// Initialize first step
updateArrowRotation();