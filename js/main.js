// Landing page logic: reads optional start from URL, validates destination, then redirects to AR page.

const destinationSelect = document.getElementById("destination");
const generateBtn = document.getElementById("generateBtn");
const errorEl = document.getElementById("error");
const startInput = document.getElementById("start");

// Read query params from the landing page URL (e.g., index.html?start=lobby-qr-01)
const params = new URLSearchParams(window.location.search);
const startFromQR = params.get("start");

// Auto-fill start location if provided by QR
if (startFromQR) {
  startInput.value = startFromQR;
  startInput.readOnly = true;
  startInput.classList.add("readonly");
}

generateBtn.addEventListener("click", () => {
  const dest = destinationSelect.value;

  if (!dest) {
    errorEl.classList.remove("hidden");
    return;
  }
  errorEl.classList.add("hidden");

  // Carry start location forward if present
  const start = startInput.value ? startInput.value.trim() : "";
երս

  const url = new URL("ar.html", window.location.href);
  url.searchParams.set("dest", dest);
  if (start) url.searchParams.set("start", start);

  window.location.href = url.toString();
});
