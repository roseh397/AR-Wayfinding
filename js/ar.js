// AR page placeholder: reads query params (start/dest) and displays them.
// Later you will replace the placeholder with AR initialization.

const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

// Get the arrow entity (A-Frame component)
const arrowEntity = document.getElementById("arrowEntity");
let arrowRotation = 0; // 0 = pointing right, 180 = pointing left

// Hardcoded path.
const path = [
  { action: "move", distance: 4 },
  { action: "turn", degrees: 90 },
  { action: "move", distance: 8 },
  { action: "turn", degrees: -90 },
  { action: "move", distance: 6 }
];
let currentStep = 0;

function updateArrow() {
  const step = path[currentStep];
  if (!step) return;

  if (step.action === "move") {
    // Arrow points forward
    arrowEntity.setAttribute("rotation", "0 0 0");
  }

  if (step.action === "turn") {
    // Rotate arrow right or left
    arrowEntity.setAttribute("rotation", `0 ${step.degrees} 0`);
  }
}

// Adding "Next Step" button
document.getElementById("nextStepBtn").addEventListener("click", () => {
  currentStep++;
  updateArrow();
});

// Initialize first step
updateArrow();