// PakCNIC Decodex App Script Engine

document.addEventListener("DOMContentLoaded", () => {
  // Input & Visual HUD Elements
  const cnicInput = document.getElementById("cnic-input");
  const digitCounter = document.getElementById("digit-counter");
  const progressBar = document.getElementById("progress-bar");
  const validationStatus = document.getElementById("validation-status");
  const copyTools = document.getElementById("copy-tools");
  const digitInspector = document.getElementById("digit-inspector");

  // Output Elements
  const resultsWrapper = document.getElementById("results-wrapper");
  const valProvince = document.getElementById("val-province");
  const valDivision = document.getElementById("val-division");
  const valDistrict = document.getElementById("val-district");
  const valGender = document.getElementById("val-gender");
  const valFamily = document.getElementById("val-family");

  // Mockup Card Overlays
  const cardMockNumber = document.getElementById("card-mock-number");
  const cardMockGender = document.getElementById("card-mock-gender");
  const cardMockDistrict = document.getElementById("card-mock-district");

  // Interactive Inspector Spans
  const inspectorProv = document.getElementById("i-prov");
  const inspectorDiv = document.getElementById("i-div");
  const inspectorDist = document.getElementById("i-dist");
  const inspectorFam = document.getElementById("i-fam");
  const inspectorGen = document.getElementById("i-gen");

  // SMS buttons
  const sms8300 = document.getElementById("sms-8300");
  const sms668 = document.getElementById("sms-668");
  const sms8009 = document.getElementById("sms-8009");
  const sms7000 = document.getElementById("sms-7000");

  // Interactive UI buttons
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  const btnShare = document.getElementById("btn-share-details");
  const btnCopyFormatted = document.getElementById("btn-copy-formatted");
  const btnCopyRaw = document.getElementById("btn-copy-raw");
  
  // History Drawer Elements
  const historyContainer = document.getElementById("history-container");
  const btnClearHistory = document.getElementById("btn-clear-history");

  let currentDecodedText = ""; // To store current data for sharing

  // 1. Theme Configuration Logic
  const savedTheme = localStorage.getItem("app-theme") || "dark";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
  });

  function setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    } else {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    }
    localStorage.setItem("app-theme", theme);
  }

  // 2. Format Masking & Real-time Visual updates
  cnicInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Strip non-digits
    
    // Auto-mask hyphens
    let formattedValue = "";
    if (value.length > 0) {
      formattedValue += value.substring(0, 5);
    }
    if (value.length > 5) {
      formattedValue += "-" + value.substring(5, 12);
    }
    if (value.length > 12) {
      formattedValue += "-" + value.substring(12, 13);
    }

    cnicInput.value = formattedValue;
    
    // Character Progress Updates
    const digitLen = value.length;
    digitCounter.textContent = `${digitLen} / 13 Digits`;
    
    const percentage = Math.min((digitLen / 13) * 100, 100);
    progressBar.style.width = `${percentage}%`;

    // Process & Decode
    processCNIC(formattedValue);
  });

  function processCNIC(cnic) {
    const rawCnic = cnic.replace(/\D/g, "");

    // Live Mock Card update
    cardMockNumber.textContent = cnic || "00000-0000000-0";
    
    // Update structural breakdown display
    updateDigitInspector(rawCnic);

    if (rawCnic.length < 13) {
      setIncompleteState();
      return;
    }

    if (rawCnic.length === 13) {
      const isValidFormat = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnic);
      if (!isValidFormat) {
        setInvalidState("Format validation failed.");
        return;
      }

      const firstDigit = rawCnic.charAt(0);
      if (firstDigit < "1" || firstDigit > "8") {
        setInvalidState("Invalid province code prefix.");
        return;
      }

      // Successful Input - Parse details
      decodeDetails(rawCnic);
    }
  }

  function setIncompleteState() {
    validationStatus.className = "validation-badge status-incomplete";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>Enter complete 13-digit CNIC</span>`;
    
    resultsWrapper.classList.remove("visible");
    digitInspector.classList.remove("active");
    copyTools.style.display = "none";
    
    cardMockGender.textContent = "SELECT CARD";
    cardMockDistrict.textContent = "PAKISTAN";
  }

  function setInvalidState(msg) {
    validationStatus.className = "validation-badge status-invalid";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Invalid: ${msg}</span>`;
    
    resultsWrapper.classList.remove("visible");
    digitInspector.classList.add("active");
    copyTools.style.display = "none";
    
    cardMockGender.textContent = "INVALID";
    cardMockDistrict.textContent = "INVALID";
  }

  function updateDigitInspector(rawCnic) {
    inspectorProv.textContent = rawCnic.charAt(0) || "X";
    inspectorDiv.textContent = rawCnic.charAt(1) || "X";
    inspectorDist.textContent = rawCnic.charAt(2) || "X";
    
    const t1 = rawCnic.charAt(3) || "X";
    const t2 = rawCnic.charAt(4) || "X";
    document.getElementById("i-sub").textContent = t1 + t2;

    if (rawCnic.length > 5) {
      inspectorFam.textContent = rawCnic.substring(5, Math.min(12, rawCnic.length));
      if (rawCnic.length < 12) {
        inspectorFam.textContent += "X".repeat(12 - rawCnic.length);
      }
    } else {
      inspectorFam.textContent = "XXXXXXX";
    }

    if (rawCnic.length > 12) {
      inspectorGen.textContent = rawCnic.charAt(12);
    } else {
      inspectorGen.textContent = "X";
    }
  }

  function decodeDetails(rawCnic) {
    const prefix3 = rawCnic.substring(0, 3);
    const firstDigit = rawCnic.charAt(0);
    let decoded = null;

    if (CNIC_DATABASE && CNIC_DATABASE[prefix3]) {
      decoded = CNIC_DATABASE[prefix3];
    } else {
      const provinces = {
        "1": "Khyber Pakhtunkhwa",
        "2": "FATA (Merged with KP)",
        "3": "Punjab",
        "4": "Sindh",
        "5": "Balochistan",
        "6": "Islamabad Capital Territory",
        "7": "Gilgit-Baltistan",
        "8": "Azad Kashmir"
      };
      decoded = {
        province: provinces[firstDigit] || "Unknown Region",
        division: "Unassigned Division",
        district: "Unassigned District"
      };
    }

    // Gender check
    const lastDigit = parseInt(rawCnic.charAt(12));
    const isMale = lastDigit % 2 !== 0;
    const genderStr = isMale ? "Male" : "Female";
    const familyUnitNumber = rawCnic.substring(5, 12);

    // Update Output Cards
    valProvince.textContent = decoded.province;
    valDivision.textContent = decoded.division;
    valDistrict.textContent = decoded.district;
    valGender.textContent = genderStr;
    valFamily.textContent = familyUnitNumber;

    // Update Mockup Card Overlay
    cardMockGender.textContent = genderStr;
    cardMockDistrict.textContent = decoded.district;

    // Active status label
    validationStatus.className = "validation-badge status-valid";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>Valid Pakistani Identity Structure</span>`;

    // Dynamic sharing text compilation
    currentDecodedText = `CNIC Decoded Insights:\nDistrict: ${decoded.district}\nDivision: ${decoded.division}\nProvince/Territory: ${decoded.province}\nGender: ${genderStr}`;

    // Reveal insights
    resultsWrapper.classList.add("visible");
    digitInspector.classList.add("active");
    copyTools.style.display = "flex";

    // Set up native SMS intent links
    sms8300.href = `sms:8300?body=${rawCnic}`;
    sms668.href = `sms:668?body=${rawCnic}`;
    sms8009.href = `sms:8009?body=${rawCnic}`;
    sms7000.href = `sms:7000?body=${rawCnic}`;

    // Physical Native Vibrate Feedback (50ms tap vibration)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Save search details to local scan history log
    saveToHistory(decoded.district, decoded.province, genderStr);
  }

  // 3. Clipboard Handling
  const setupClipboardCopy = (element, getCnicString) => {
    element.addEventListener("click", () => {
      const textToCopy = getCnicString();
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        // Change text values dynamically inside the button to show success feedback
        const span = element.querySelector("span");
        const originalText = span.textContent;
        span.textContent = "Copied!";
        element.style.borderColor = "var(--success-color)";
        
        if (navigator.vibrate) {
          navigator.vibrate(25);
        }

        setTimeout(() => {
          span.textContent = originalText;
          element.style.borderColor = "";
        }, 1200);
      });
    });
  };

  setupClipboardCopy(btnCopyFormatted, () => cnicInput.value);
  setupClipboardCopy(btnCopyRaw, () => cnicInput.value.replace(/\D/g, ""));

  // 4. Native Sharing Drawer (Web Share API)
  btnShare.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: "PakCNIC Decodex Report",
        text: currentDecodedText
      }).catch(err => console.log("Sharing failed: ", err));
    } else {
      // Offline fallback: copy to clipboard
      navigator.clipboard.writeText(currentDecodedText).then(() => {
        const btnSpan = btnShare.querySelector("span");
        btnSpan.textContent = "Copied to clipboard!";
        setTimeout(() => {
          btnSpan.textContent = "Share Insights";
        }, 1500);
      });
    }
  });

  // 5. Offline Scan History Storage
  function saveToHistory(district, province, gender) {
    let history = JSON.parse(localStorage.getItem("scan-history")) || [];
    
    // Avoid redundant duplicates
    const duplicate = history.some(item => 
      item.district === district && item.province === province && item.gender === gender
    );
    if (duplicate) return;

    // Limit to last 5 records
    history.unshift({ district, province, gender, id: Date.now() });
    if (history.length > 5) history.pop();

    localStorage.setItem("scan-history", JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem("scan-history")) || [];
    historyContainer.innerHTML = "";

    if (history.length === 0) {
      historyContainer.innerHTML = '<div class="history-placeholder">No recent scans stored on this device.</div>';
      btnClearHistory.style.display = "none";
      return;
    }

    btnClearHistory.style.display = "block";
    history.forEach(item => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.innerHTML = `
        <div class="history-meta-loc">
          <span class="history-district-txt">${item.district}</span>
          <span class="history-province-txt">${item.province}</span>
        </div>
        <span class="history-badge-gender ${item.gender === "Male" ? "badge-male" : "badge-female"}">${item.gender}</span>
      `;
      historyContainer.appendChild(div);
    });
  }

  btnClearHistory.addEventListener("click", () => {
    localStorage.removeItem("scan-history");
    renderHistory();
  });

  // Initial render of storage history logs
  renderHistory();

  // 6. Interactive visual inspector highlighting triggers
  const setupHoverInspector = (cardId, highlights) => {
    const element = document.getElementById(cardId);
    if (!element) return;

    element.addEventListener("touchstart", () => {
      highlights.forEach(id => {
        const span = document.getElementById(id);
        if (span) {
          if (cardId.includes("prov")) span.classList.add("highlight-province");
          if (cardId.includes("div")) span.classList.add("highlight-division");
          if (cardId.includes("dist")) span.classList.add("highlight-district");
          if (cardId.includes("fam")) span.classList.add("highlight-family");
          if (cardId.includes("gen")) span.classList.add("highlight-gender");
        }
      });
      element.classList.add("active-hover");
    });

    element.addEventListener("touchend", () => {
      highlights.forEach(id => {
        const span = document.getElementById(id);
        if (span) {
          span.classList.remove("highlight-province", "highlight-division", "highlight-district", "highlight-family", "highlight-gender");
        }
      });
      element.classList.remove("active-hover");
    });
  };

  // Bind elements to visual Inspector
  setupHoverInspector("card-province", ["i-prov"]);
  setupHoverInspector("card-division", ["i-div"]);
  setupHoverInspector("card-district", ["i-dist", "i-sub"]);
  setupHoverInspector("card-gender", ["i-gen"]);
  setupHoverInspector("card-family", ["i-fam"]);
});
