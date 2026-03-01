// AR page placeholder: reads query params (start/dest) and displays them.
// Later you will replace the placeholder with AR initialization.

const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

// Get the arrow entity (A-Frame component)
const arrowEntity = document.getElementById("arrowEntity");
let arrowRotation = 0; // 0 = pointing right, 180 = pointing left

// Camera pan detection
let touchStartX = 0;

// Detect touch pan and update arrow direction
document.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
}, false);

document.addEventListener("touchmove", (e) => {
  if (touchStartX !== null) {
    const touchCurrentX = e.touches[0].clientX;
    const panDelta = touchCurrentX - touchStartX;
    
    // Pan to the right: arrow points left (180 degrees)
    if (panDelta > 10) {
      arrowRotation = 180;
    }
    // Pan to the left: arrow points right (0 degrees)
    else if (panDelta < -10) {
      arrowRotation = 0;
    }
    
    // Apply rotation to the A-Frame entity
    arrowEntity.setAttribute("rotation", `0 ${arrowRotation} 0`);
