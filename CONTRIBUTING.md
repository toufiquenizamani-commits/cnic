# Contributing to the Pakistani Utility App Suite 🇵🇰

We welcome contributions from developers, designers, and enthusiasts to make this utility suite more helpful, robust, and feature-rich for users across Pakistan!

---

## 🛠️ Development Setup

The repository is structured as a **Monorepo**:
```
cnic/
├── .github/workflows/   # CI/CD compiler scripts
└── projects/            # Individual application projects
    ├── bijli-nazar/     # Bijli Nazar - Electricity Audit
    ├── mandi-matrix/    # Mandi Matrix - Commodity chalkboard
    ├── pakcnic-decodex/ # PakCNIC Decodex - Identity tools
    ├── safar-saathi/    # Safar Saathi Pro - Route planner
    └── setu/            # Setu Verify - License Plate verifier
```

### Mobile/WebView Development
1. Each application contains its core front-end assets inside `app/src/main/assets/` (`index.html`, `style.css`, `app.js`).
2. You can preview, debug, or edit the interface by opening the `index.html` file in any desktop browser.
3. The native Android client wrapper runs in Java, using standard WebViews. You can import any subfolder inside `projects/` directly into **Android Studio** to compile locally.

### Desktop Development
Each application has a lightweight Python desktop client wrapped in `pywebview`:
*   Desktop wrappers are stored under `projects/<app-name>/desktop/main.py`.
*   To test locally, run:
    ```bash
    pip install pywebview fpdf pandas openpyxl
    python projects/<app-name>/desktop/main.py
    ```

---

## 🚀 How to Contribute

1. **Bug Fixes & Refactoring:**
   * Fork the repository.
   * Create a descriptive branch (e.g. `fix/setu-plate-recognition` or `feat/disco-pesco-tariffs`).
   * Test your changes locally in both browser views and the desktop script.
   * Submit a Pull Request targeting the `main` branch.

2. **Expanding Datasets (Highly Appreciated):**
   * **Bijli Nazar:** Update/add PESCO, HESCO, or K-Electric tariff rates inside the calculation engine tables in `projects/bijli-nazar/app/src/main/assets/app.js`.
   * **Safar Saathi:** Add more highways, checkpoints, or city options inside `projects/safar-saathi/app/src/main/assets/app.js`.
   * **Setu Verify:** Add support for regional license plate schemas (e.g. Balochistan, AJ&K, Gilgit-Baltistan).

---

## ⚖️ Code of Conduct
* Keep the code clean, document logic changes, and ensure haptic feedback points and prefers-color-scheme themes are fully supported.
* Ensure all applications operate **100% offline** where possible to respect consumer data privacy and limited local connectivity.
