This repository contains a first iteration of demo code from Spring 2026.
This iteration uses the phone's accelerometer to gauge the user's distance along a
predefined path. 

NOTE: This version was scrapped due to considerable drift and inaccuracies with the
accelerometer approach. The team and sponsor decided to abandon this version in favor of a
more reliable approach using AR codes. As such, this repository is provided only for
educational purposes, not to continue implementation.

Below is a breakdown of each file and its contents.

ar_only.html - setup for AR components 

index.html - main AR guidance page with UI overlay

webpage.html - sample landing page for selecting destination and generating AR wayfinding (not deployed at this time)

assets/styles.css - CSS stylesheet for global styling

js/ar.js - AR navigation using device motion to detect steps

js/main.js - logic for webpage.html landing page (not deployed at this time)

Code is deployed using vercel at ar-wayfinding.vercel.app
