// ar.js — step-based AR navigation (working)

const arrowEntity = document.getElementById("arrowEntity");

// Path: distance = steps to move, degrees = relative turn
const path = [
  { action: "move", distance: 10 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 8 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 6 }
];

let currentStep = 0;
let state = "walking"; // walking, turning
let lastAccel = null;
let heading = 0;

// -----------------------------
// Step detection
// -----------------------------
window.addEventListener('devicemotion', (event) => {
  if (state !== "walking") return; // don't count steps while turning

  const acc = event.accelerationIncludingGravity;
  if (!lastAccel) { lastAccel = acc; return; }

  const delta = Math.sqrt(
    Math.pow(acc.x - lastAccel.x, 2) +
    Math.pow(acc.y - lastAccel.y, 2) +
    Math.pow(acc.z - lastAccel.z, 2)
  );

  if (delta > 1.2) advanceStep(); // tweak threshold

  lastAccel = acc;
});

// -----------------------------
// Compass heading
// -----------------------------
window.addEventListener('deviceorientation', (event) => {
  heading = event.alpha || 0;
  if (state === "turning") checkTurnAlignment();
  updateArrowRotation();
});

// -----------------------------
// Advance walking step
// -----------------------------
function advanceStep() {
  const step = path[currentStep];
  if (!step || step.action !== "move") return;

  step.distance--;
  if (step.distance <= 0) {
    currentStep++;
    startNextStep();
  }
}

// -----------------------------
// Start next step (move or turn)
// -----------------------------
function startNextStep() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    state = "walking";
  } else if (step.action === "turn") {
    state = "turning";
  }
  updateArrowRotation();
}

// -----------------------------
// Update arrow rotation
// -----------------------------
function updateArrowRotation() {
  const step = path[currentStep];
  if (!step) return;

  if (state === "walking") {
    arrowEntity.setAttribute("rotation", "0 0 0"); // straight
  } else if (state === "turning") {
    arrowEntity.setAttribute("rotation", `0 ${step.degrees} 0`); // show turn
  }
}

// -----------------------------
// Check if user has physically turned
// -----------------------------
function checkTurnAlignment() {
  const step = path[currentStep];
  if (!step || step.action !== "turn") return;

  const targetHeading = (heading + step.degrees + 360) % 360;
  const diff = Math.abs(normalizeAngle(targetHeading - heading));

  if (diff < 20) { // user aligned within ±20°
    state = "walking";
    currentStep++;
    updateArrowRotation();
  }
}

// Normalize angle to [-180, 180]
function normalizeAngle(angle) {
  return ((angle + 180) % 360) - 180;
}

// -----------------------------
// Initialize first step
// -----------------------------
startNextStep();