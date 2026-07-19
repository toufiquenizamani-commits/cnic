# 🔍 PakCNIC Decodex

An ultra-lightweight, 100% offline, privacy-first, and clutter-free single-screen utility app for Pakistan. Automatically detects and decodes **National Identity Cards (CNIC)** and **Mobile Numbers** instantly with immersive visual mockup animations and native haptic feedback.

---

## ✨ Features

*   **Smart Auto-Detection:** Automatically shifts between **CNIC Mode** (13 digits) and **Mobile Mode** (11 digits) as you type.
*   **Live Mockup Visualizer:**
    *   *CNIC Mode:* Renders a glassmorphic National Identity Card. Double-tap or click the flip button to reveal the card back (magnetic stripe, signature, official properties).
    *   *Mobile Mode:* Renders a SIM Card matching the operator's brand colors (Jazz, Zong, Telenor, Ufone, SCOM) with rotating chip sweeps.
*   **Tactile Haptic Feedback Bridge:** Native physical device vibrations (light typing ticks, mode shifts, success wave rhythms, and validation error rumbles) for a premium native app feel.
*   **Offline Decoder Grid:** Extracts Province, Division, District, Family Unit ID, and Gender Classification entirely client-side without internet.
*   **Swipe-to-Delete Scan History:** Swipe any recent scan item to the left to reveal a red trash icon and remove it from history with a physical haptic thump.
*   **Swipe-to-Dismiss Panels:** Slide history and utility drawers closed naturally using downward and leftward finger swipe gestures.
*   **In-App Web OSINT Search:** Quick Action Chips scan public registries for names, WhatsApp profiles, and spam reports inside a custom Native Web Inspector dialog.

---

## 🔒 Privacy First

*   **Zero Server Tracking:** The app contains **no external APIs** and does not transmit any digits or scanned codes to any server.
*   **100% Offline Processing:** All decoding algorithms operate strictly locally inside the WebView JavaScript engine.
*   **No Permissions Needed:** Requires no camera, contacts, or storage permissions to work.

---

## 🛠️ Technology Stack

*   **Frontend:** Plain HTML5, Vanilla CSS3 (OLED Midnight Green variables & glassmorphic layouts), and vanilla ES6 JavaScript (touch math, regex detectors).
*   **Android Native Wrapper:** Java WebView (`MainActivity.java`) optimized with hardware acceleration, native JavascriptInterfaces (vibrator hooks), and Google Safe Browsing integration.
*   **CI/CD:** Automated GitHub Actions build workflow to compile APK files on push.

---

## 📱 How to Get the App

### Option A: Install Pre-compiled APK (Free)
1. Go to the **Actions** tab at the top of this GitHub repository.
2. Click on the latest workflow run.
3. Scroll down to **Artifacts** and download the `PakCNIC-Decodex-Debug-APK` zip file.
4. Unzip and copy the `.apk` file to your Android phone, enable "Install from Unknown Sources", and run it!

### Option B: Build it Yourself (Android Studio)
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/pakcnic-decodex.git
   ```
2. Open the directory in **Android Studio**.
3. Let Gradle sync project files.
4. Click **Run > Run 'app'** to deploy it directly to your emulator or connected USB device.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
