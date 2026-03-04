// AR page: step-based navigation

const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

// Arrow entity
const arrowEntity = document.getElementById("arrowEntity");

// Hardcoded path: distance in steps
const path = [
  { action: "move", distance: 4 },   // walk 4 steps forward
  { action: "turn", degrees: 90 },   // turn right 90°
  { action: "move", distance: 8 },
  { action: "turn", degrees: -90 },  // turn left 90°
  { action: "move", distance: 6 }
];

let currentStep = 0;
let lastAccel = null;
let heading = 0;

// Step detection (simple)
window.addEventListener('devicemotion', (event) => {
  const acc = event.accelerationIncludingGravity;
  if (!lastAccel) {
    lastAccel = acc;
    return;
  }

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

// Get compass heading
window.addEventListener('deviceorientation', (event) => {
  heading = event.alpha || 0; // 0-360° compass heading
});

function advanceStep() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    step.distance--;
    if (step.distance <= 0) {
      currentStep++;
      updateArrow();
    }
  }
}

// Update arrow rotation
function updateArrow() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    // Arrow points forward (in user heading)
    arrowEntity.setAttribute("rotation", `0 0 0`);
  } else if (step.action === "turn") {
    // Show turn
    arrowEntity.setAttribute("rotation", `0 ${step.degrees} 0`);
  }
}

// Initialize
updateArrow();