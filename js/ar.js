// AR page placeholder: reads query params (start/dest) and displays them.
// Later you will replace the placeholder with AR initialization.

const params = new URLSearchParams(window.location.search);
const dest = params.get("dest");
const start = params.get("start");

const destLabel = document.getElementById("destLabel");
const startLabel = document.getElementById("startLabel");
const backBtn = document.getElementById("backBtn");
const openLandingBtn = document.getElementById("openLandingBtn");

destLabel.textContent = dest ? dest : "not provided";
startLabel.textContent = start ? start : "not provided";

// Back: keep params (handy during demo) and go to previous page
backBtn.addEventListener("click", () => {
  window.history.length > 1 ? window.history.back() : (window.location.href = "index.html");
});

// Change destination: return to landing and preserve start parameter
openLandingBtn.addEventListener("click", () => {
  const url = new URL("index.html", window.location.href);
  if (start) url.searchParams.set("start", start);
  window.location.href = url.toString();
});
