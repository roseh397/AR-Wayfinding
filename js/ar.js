// ar.js — step-based AR navigation using virtual heading

const arrowEntity = document.getElementById("arrowEntity");

// Path: distance = steps to move, degrees = relative turn
const path = [
  { action: "move", distance: 10 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 8 },
  { action: "turn", degrees: -90 },
  { action: "move", distance: 6 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 6 }
];

let currentStep = 0;
let state = "walking"; // "walking" or "turning"
let lastAccel = null;
let virtualHeading = 0; // virtual orientation (degrees)

// -----------------------------
// Step detection
// -----------------------------
window.addEventListener('devicemotion', (event) => {
  if (state !== "walking") return;

  const acc = event.accelerationIncludingGravity;
  if (!lastAccel) { lastAccel = acc; return; }

  const delta = Math.sqrt(
    Math.pow(acc.x - lastAccel.x, 2) +
    Math.pow(acc.y - lastAccel.y, 2) +
    Math.pow(acc.z - lastAccel.z, 2)
  );

  if (delta > 1.2) advanceStep(); // tweak sensitivity

  lastAccel = acc;
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
    state = "walking"; // immediately start walking after turn
    virtualHeading = normalizeAngle(virtualHeading + step.degrees);
    currentStep++; // move to next step (must be move)
  }
  updateArrowRotation();
}

// -----------------------------
// Update arrow rotation
// -----------------------------
function updateArrowRotation() {
  // arrow always points along virtual heading
  arrowEntity.setAttribute("rotation", `0 ${virtualHeading} 0`);
}

// -----------------------------
// Normalize angle to [-180, 180]
function normalizeAngle(angle) {
  return ((angle + 180) % 360) - 180;
}

// -----------------------------
// Initialize first step
// -----------------------------
startNextStep();