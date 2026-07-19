# 🇵🇰 Pakistani Mobile Utility App Suite

A premium, offline-first, and privacy-focused suite of five mobile and desktop utility applications tailored to solve daily systemic friction points in Pakistan.

All applications in this repository are compiled automatically on every push via the custom GitHub Actions CI/CD pipeline, outputting five distinct downloadable APK packages.

---

## 📱 App Suite Index

| Application | Core Utility Gap Solved | Key Tech Stack & Bridges | Folder Path |
| :--- | :--- | :--- | :--- |
| **🔍 PakCNIC Decodex** | CNIC data decoding & SIM card operator validation. | HTML5/CSS3, Android Java Bridge, Haptic Vibrator SDK | `/` (Root Project) |
| **⚡ Bijli Nazar** | Audits NEPRA bill tariffs and tracks meter pacing. | Google ML Kit OCR (Java), Offline Tariff Slabs JS | [`/projects/bijli-nazar/`](file:///home/toufique/AntiG%20project/projects/bijli-nazar/) |
| **🛡️ Setu Verify** | Scrapes Excise MTMIS plates & CPLC stolen lists. | Glassmorphic Smart Card mockups, Python PyWebView | [`/projects/setu/`](file:///home/toufique/AntiG%20project/projects/setu/) |
| **🌾 Mandi Matrix** | Compares daily agricultural Mandi vs Retail prices. | Digital Green Chalkboard UI, Margin Calculators | [`/projects/mandi-matrix/`](file:///home/toufique/AntiG%20project/projects/mandi-matrix/) |
| **🧭 Safar Saathi Pro** | Road-trip planner, fuel calculator, and drive HUD. | Timeline storyboard checkboxes, Compasses, NH&MP 130 | [`/projects/safar-saathi/`](file:///home/toufique/AntiG%20project/projects/safar-saathi/) |

---

## ✨ Individual Application Deep-Dive

### 1. PakCNIC Decodex (CNIC & SIM Validator)
*   **Auto-Detection:** Shifts between CNIC (13 digits) and Mobile (11 digits) layouts as you type.
*   **Tactile Haptics:** Light ticks on character entry, success waves on valid codes, and validation error rumbles.
*   **Swipe Gestures:** Swipe history items left to delete; slide utility drawers down to dismiss.

### 2. Bijli Nazar (Electricity Watch)
*   **Slab Gauge:** Warning rings change color (Green → Amber → Red) as you approach the 200-unit lifeline limit to preserve subsidized "protected consumer" status.
*   **Interactive Estimator:** Simulation slider calculates how running ACs impacts monthly bills.

### 3. Setu Verify (Excise & Property Trust)
*   **Dynamic Plates:** Generates high-fidelity visual license plates matching the styling of the province (Punjab, Sindh, Islamabad).
*   **Smart Card Flip:** Flips the card 3D to display registered owner, vehicle make/model, and tax token details.

### 4. Mandi Matrix (Market Prices Board)
*   **Chalkboard Rates:** Daily price list dashboard showing wholesale vs retail spreads.
*   **Shopping Cart Planner:** Evaluates total grocery items shopping costs, highlighting profit margins captured by middlemen.

### 5. Safar Saathi Pro (Road Trip Companion)
*   **Timeline Storyboard:** Adds planned motorway rest stops and scenic detours, updating ETA durations.
*   **Drive HUD:** Displays active speed limits, compass orientations, and rapid shortcuts to the Motorway Police Helpline (130).

---

## 🛠️ Desktop Wrapper Support (Windows & Linux)
Each project inside the `projects/` directory includes a standalone Python wrapper (`desktop/main.py`) to launch the app locally on desktop and export records:
*   *Setu:* Batch CSV plate checks and PDF verification reports.
*   *Mandi Matrix:* PDF retail price chart lists export.
*   *Safar Saathi:* Print-ready road-trip travelogue PDF postcards.

---

## 📱 Installation & Compilation Guides

### How to Download Compiled APKs
1. Go to the **Actions** tab on your GitHub repository page.
2. Click on the latest green build run.
3. Scroll down to the **Artifacts** section and download the zip packages for any of the 5 apps.

### Build Locally (Android Studio)
To build any application:
1. Open the target directory (e.g., `projects/setu/`) in Android Studio.
2. Let Gradle sync project dependencies.
3. Select **Run > Run 'app'** to deploy it directly to a connected test device.
