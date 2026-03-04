// ar.js — step-based AR navigation

// Read query params (optional)
const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

const arrowEntity = document.getElementById("arrowEntity");

const path = [
  { action: "move", distance: 4 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 8 },
  { action: "turn", degrees: -90 },
  { action: "move", distance: 6 }
];

let currentStep = 0;
let lastAccel = null;
let heading = 0;
let waitingForTurn = false;

// Step detection
window.addEventListener('devicemotion', (event) => {
  const acc = event.accelerationIncludingGravity;
  if (!lastAccel) { lastAccel = acc; return; }

  const delta = Math.sqrt(
    Math.pow(acc.x - lastAccel.x, 2) +
    Math.pow(acc.y - lastAccel.y, 2) +
    Math.pow(acc.z - lastAccel.z, 2)
  );

  if (delta > 1.2) advanceStep();

  lastAccel = acc;
});

// Compass
window.addEventListener('deviceorientation', (event) => {
  heading = event.alpha || 0;
  if (waitingForTurn) checkTurnAlignment();
  updateArrowRotation();
});

// Advance steps
function advanceStep() {
  if (waitingForTurn) return; // don’t count steps while waiting for turn

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

// Update arrow
function updateArrowRotation() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    arrowEntity.setAttribute("rotation", `0 0 0`);
  } else if (step.action === "turn" && !waitingForTurn) {
    arrowEntity.setAttribute("rotation", `0 ${step.degrees} 0`);
    waitingForTurn = true;
  }
}

// Turn alignment check
function checkTurnAlignment() {
  const step = path[currentStep];
  if (!step || step.action !== "turn") return;

  const targetHeading = (heading + step.degrees + 360) % 360;
  const diff = Math.abs(normalizeAngle(targetHeading - heading));

  if (diff < 15) {
    // Turn completed
    waitingForTurn = false;
    currentStep++;
    updateArrowRotation();
  }
}

function normalizeAngle(angle) {
  angle = ((angle + 180) % 360) - 180;
  return angle;
}

// Initialize
updateArrowRotation();