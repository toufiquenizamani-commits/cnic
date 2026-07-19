// PakCNIC Decodex App Script Engine

document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Drawer Elements
  const toggleHistory = document.getElementById("toggle-history");
  const toggleUtilities = document.getElementById("toggle-utilities");
  const drawerHistory = document.getElementById("drawer-history");
  const drawerUtilities = document.getElementById("drawer-utilities");
  const drawerCloseBtns = document.querySelectorAll(".drawer-close-btn");

  // Utilities Tabs
  const tabSms = document.getElementById("tab-sms");
  const tabPrefix = document.getElementById("tab-prefix");
  const panelSms = document.getElementById("panel-sms");
  const panelPrefix = document.getElementById("panel-prefix");

  // Input & Progress
  const cnicInput = document.getElementById("cnic-input");
  const digitCounter = document.getElementById("digit-counter");
  const progressBar = document.getElementById("progress-bar");
  const validationStatus = document.getElementById("validation-status");
  const copyTools = document.getElementById("copy-tools");
  const inspectorHudWrapper = document.getElementById("inspector-hud-wrapper");
  const digitInspector = document.getElementById("digit-inspector");

  // Visual Mockup Card & Rotator
  const digitalCard = document.getElementById("digital-card");
  const cardMockNumber = document.getElementById("card-mock-number");
  const cardMockGender = document.getElementById("card-mock-gender");
  const cardMockDistrict = document.getElementById("card-mock-district");
  const simMockCarrier = document.getElementById("sim-mock-carrier");
  const simMockNumber = document.getElementById("sim-mock-number");
  const simMockOperator = document.getElementById("sim-mock-operator");

  // Output Grids
  const resultsWrapper = document.getElementById("results-wrapper");
  const cnicResultsGrid = document.getElementById("cnic-results-grid");
  const mobileResultsGrid = document.getElementById("mobile-results-grid");

  // CNIC Output Spans
  const valProvince = document.getElementById("val-province");
  const valDivision = document.getElementById("val-division");
  const valDistrict = document.getElementById("val-district");
  const valGender = document.getElementById("val-gender");
  const valFamily = document.getElementById("val-family");

  // Mobile Output Spans
  const valMobileCarrier = document.getElementById("val-mobile-carrier");
  const valMobilePrefix = document.getElementById("val-mobile-prefix");

  // Web OSINT Buttons
  const btnOsintCnic = document.getElementById("btn-osint-cnic");
  const btnOsintWhatsapp = document.getElementById("btn-osint-whatsapp");
  const btnOsintSpam = document.getElementById("btn-osint-spam");

  // General Buttons
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  const btnShare = document.getElementById("btn-share-details");
  const btnCopyFormatted = document.getElementById("btn-copy-formatted");
  const btnCopyRaw = document.getElementById("btn-copy-raw");

  // History Elements
  const historyContainer = document.getElementById("history-container");
  const btnClearHistory = document.getElementById("btn-clear-history");

  let currentDecodedText = "";
  let activeMode = "CNIC"; // "CNIC" or "MOBILE"
  let cardBackVisible = false;

  // Telecom operator prefixes database mapping
  const OPERATOR_PREFIXES = [
    { code: "0300", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0301", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0302", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0303", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0304", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0305", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0306", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0307", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0308", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0309", carrier: "Jazz", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0310", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0311", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0312", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0313", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0314", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0315", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0316", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0317", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0318", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0319", carrier: "Zong", styleClass: "sim-zong", glowClass: "glow-zong" },
    { code: "0320", carrier: "Warid", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0321", carrier: "Warid", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0322", carrier: "Warid", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0323", carrier: "Warid", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0324", carrier: "Warid", styleClass: "sim-jazz", glowClass: "glow-jazz" },
    { code: "0330", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0331", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0332", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0333", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0334", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0335", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0336", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0337", carrier: "Ufone", styleClass: "sim-ufone", glowClass: "glow-ufone" },
    { code: "0340", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0341", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0342", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0343", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0344", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0345", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0346", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0347", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0348", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0349", carrier: "Telenor", styleClass: "sim-telenor", glowClass: "glow-telenor" },
    { code: "0355", carrier: "SCOM", styleClass: "sim-scom", glowClass: "glow-scom" }
  ];

  // 1. Toast Notification Utility
  function showToast(message, duration = 3000) {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    
    // Play light haptic feedback
    if (window.NativeBridge) window.NativeBridge.haptic("light");
    
    setTimeout(() => {
      toast.remove();
    }, duration + 500);
  }

  // 2. Confetti Particle Canvas Animation Loop removed to keep visual style professional

  // 3. Double-Tap Gesture for Card Rotation (CNIC Mode Back side)
  let tapTimer = null;
  digitalCard.addEventListener("click", () => {
    if (activeMode === "MOBILE") return; // Mobile Mode flips automatically to show SIM

    if (tapTimer === null) {
      tapTimer = setTimeout(() => {
        tapTimer = null;
      }, 300);
    } else {
      clearTimeout(tapTimer);
      tapTimer = null;
      toggleCNICBack();
    }
  });

  function toggleCNICBack() {
    cardBackVisible = !cardBackVisible;
    if (cardBackVisible) {
      document.getElementById("sim-back-content").style.display = "none";
      document.getElementById("cnic-back-content").style.display = "flex";
      digitalCard.classList.add("flipped");
      showToast("Card back details revealed");
    } else {
      digitalCard.classList.remove("flipped");
      showToast("Returned to front side");
    }
  }

  function resetCNICBackState() {
    cardBackVisible = false;
    digitalCard.classList.remove("flipped");
  }

  // 4. Laser Scan Sweep Trigger
  function triggerLaserScan() {
    const laser = document.getElementById("laser-scan");
    if (!laser) return;
    laser.style.display = "block";
    setTimeout(() => {
      laser.style.display = "none";
    }, 1600);
  }

  // 5. Drawer Opening & Closing Logic
  toggleHistory.addEventListener("click", () => drawerHistory.classList.add("open"));
  toggleUtilities.addEventListener("click", () => {
    drawerUtilities.classList.add("open");
    populatePrefixList(); // Dynamically render search list
  });

  drawerCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-close");
      document.getElementById(targetId).classList.remove("open");
    });
  });

  // Close drawer if clicking backdrop
  document.querySelectorAll(".drawer-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });

  // Swipe-to-dismiss gestures for drawers
  function makeSwipeDismissableBottom(drawerOverlay) {
    const container = drawerOverlay.querySelector(".drawer-container");
    const handle = drawerOverlay.querySelector(".drawer-handle");
    if (!handle || !container) return;

    let startY = 0;
    let currentY = 0;
    let dragging = false;

    handle.addEventListener("touchstart", (e) => {
      startY = e.touches[0].clientY;
      dragging = true;
      container.style.transition = "none";
    }, { passive: true });

    handle.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      currentY = e.touches[0].clientY - startY;
      if (currentY > 0) {
        container.style.transform = `translateY(${currentY}px)`;
      }
    }, { passive: true });

    handle.addEventListener("touchend", () => {
      dragging = false;
      container.style.transition = "";
      if (currentY > 100) {
        drawerOverlay.classList.remove("open");
      }
      container.style.transform = "";
      currentY = 0;
    });
  }

  function makeSwipeDismissableLeft(drawerOverlay) {
    const container = drawerOverlay.querySelector(".drawer-container");
    const handle = drawerOverlay.querySelector(".drawer-handle");
    if (!handle || !container) return;

    let startX = 0;
    let currentX = 0;
    let dragging = false;

    handle.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      container.style.transition = "none";
    }, { passive: true });

    handle.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      currentX = e.touches[0].clientX - startX;
      if (currentX < 0) {
        container.style.transform = `translateX(${currentX}px)`;
      }
    }, { passive: true });

    handle.addEventListener("touchend", () => {
      dragging = false;
      container.style.transition = "";
      if (currentX < -80) {
        drawerOverlay.classList.remove("open");
      }
      container.style.transform = "";
      currentX = 0;
    });
  }

  makeSwipeDismissableLeft(drawerHistory);
  makeSwipeDismissableBottom(drawerUtilities);


  // 6. Utilities Drawer Internal Tabs
  tabSms.addEventListener("click", () => {
    tabSms.classList.add("active");
    tabPrefix.classList.remove("active");
    panelSms.classList.add("active");
    panelPrefix.classList.remove("active");
  });

  tabPrefix.addEventListener("click", () => {
    tabPrefix.classList.add("active");
    tabSms.classList.remove("active");
    panelPrefix.classList.add("active");
    panelSms.classList.remove("active");
  });

  // Search filter for operator prefixes
  document.getElementById("prefix-search").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    populatePrefixList(query);
  });

  function populatePrefixList(filter = "") {
    const list = document.getElementById("prefix-list-container");
    list.innerHTML = "";
    
    const filtered = OPERATOR_PREFIXES.filter(p => 
      p.code.includes(filter) || p.carrier.toLowerCase().includes(filter)
    );

    if (filtered.length === 0) {
      list.innerHTML = '<div style="font-size: 0.75rem; text-align: center; padding: 12px; color: var(--text-secondary);">No prefixes match search.</div>';
      return;
    }

    filtered.forEach(p => {
      const row = document.createElement("div");
      row.className = "prefix-item-row";
      row.innerHTML = `
        <span class="prefix-code-badge">${p.code}</span>
        <span class="prefix-carrier-badge carrier-${p.carrier.toLowerCase()}">${p.carrier}</span>
      `;
      list.appendChild(row);
    });
  }

  // 7. Theme Toggle Setup
  const savedTheme = localStorage.getItem("app-theme") || "dark";
  setTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-theme");
    setTheme(isDark ? "light" : "dark");
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

  // 8. Input Formatting and Auto-Detection
  let lastValLen = 0;
  cnicInput.addEventListener("input", (e) => {
    let raw = e.target.value.replace(/\D/g, ""); // Strip non-digits
    
    // Play light tick for each digit entered
    if (raw.length > lastValLen && window.NativeBridge) {
      window.NativeBridge.haptic("light");
    }
    lastValLen = raw.length;

    // Auto-detect mode based on leading prefix
    const oldMode = activeMode;
    if (raw.startsWith("0")) {
      activeMode = "MOBILE";
    } else {
      activeMode = "CNIC";
    }

    // Trigger haptic bump when shifting modes
    if (activeMode !== oldMode) {
      if (window.NativeBridge) window.NativeBridge.haptic("medium");
      resetCNICBackState(); // Reset flip state
      triggerLaserScan();   // Play scan animation
    }

    let formatted = "";
    if (activeMode === "MOBILE") {
      // Mobile Format: XXXX-YYYYYYY
      if (raw.length > 0) {
        formatted += raw.substring(0, 4);
      }
      if (raw.length > 4) {
        formatted += "-" + raw.substring(4, 11);
      }
      cnicInput.value = formatted;
      digitCounter.textContent = `${raw.length} / 11 Digits`;
      
      const percentage = Math.min((raw.length / 11) * 100, 100);
      progressBar.style.width = `${percentage}%`;
      
      processMobile(formatted);
    } else {
      // CNIC Format: XXXXX-YYYYYYY-Z
      if (raw.length > 0) {
        formatted += raw.substring(0, 5);
      }
      if (raw.length > 5) {
        formatted += "-" + raw.substring(5, 12);
      }
      if (raw.length > 12) {
        formatted += "-" + raw.substring(12, 13);
      }
      cnicInput.value = formatted;
      digitCounter.textContent = `${raw.length} / 13 Digits`;
      
      const percentage = Math.min((raw.length / 13) * 100, 100);
      progressBar.style.width = `${percentage}%`;
      
      processCNIC(formatted);
    }
  });

  // 9. CNIC Mode Processing
  function processCNIC(cnic) {
    const raw = cnic.replace(/\D/g, "");

    // Rotate visual mockup to front if flipped and reset visibility
    digitalCard.classList.remove("flipped");
    cardMockNumber.textContent = cnic || "00000-0000000-0";
    
    updateDigitInspector(raw);

    // Dynamic color class cleanup
    clearGlowClasses();
    digitalCard.classList.add("glow-cnic");

    if (raw.length < 13) {
      setIncompleteState("Enter complete 13-digit CNIC");
      return;
    }

    if (raw.length === 13) {
      if (!/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnic)) {
        setInvalidState("Format validation failed.");
        return;
      }

      const firstDigit = raw.charAt(0);
      if (firstDigit < "1" || firstDigit > "8") {
        setInvalidState("Invalid province prefix code.");
        return;
      }

      decodeCNIC(raw);
    }
  }

  function updateDigitInspector(raw) {
    document.getElementById("i-prov").textContent = raw.charAt(0) || "X";
    document.getElementById("i-div").textContent = raw.charAt(1) || "X";
    document.getElementById("i-dist").textContent = raw.charAt(2) || "X";
    
    const t1 = raw.charAt(3) || "X";
    const t2 = raw.charAt(4) || "X";
    document.getElementById("i-sub").textContent = t1 + t2;

    if (raw.length > 5) {
      document.getElementById("i-fam").textContent = raw.substring(5, Math.min(12, raw.length));
      if (raw.length < 12) {
        document.getElementById("i-fam").textContent += "X".repeat(12 - raw.length);
      }
    } else {
      document.getElementById("i-fam").textContent = "XXXXXXX";
    }

    document.getElementById("i-gen").textContent = raw.charAt(12) || "X";
  }

  function decodeCNIC(raw) {
    const prefix3 = raw.substring(0, 3);
    const firstDigit = raw.charAt(0);
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
        "6": "Islamabad Capital",
        "7": "Gilgit-Baltistan",
        "8": "Azad Kashmir"
      };
      decoded = {
        province: provinces[firstDigit] || "Unknown Region",
        division: "Unassigned Division",
        district: "Unassigned District"
      };
    }

    const lastDigit = parseInt(raw.charAt(12));
    const gender = lastDigit % 2 !== 0 ? "Male" : "Female";
    const familyId = raw.substring(5, 12);

    // Update CNIC view outputs
    valProvince.textContent = decoded.province;
    valDivision.textContent = decoded.division;
    valDistrict.textContent = decoded.district;
    valGender.textContent = gender;
    valFamily.textContent = familyId;

    // Update Mockup Card Overlay
    cardMockGender.textContent = gender;
    cardMockDistrict.textContent = decoded.district;

    // Set up OSINT Google Search (searching PDF/XLS/Doc indexes for matching names)
    btnOsintCnic.href = `https://www.google.com/search?q=%22${raw.substring(0,5)}-${raw.substring(5,12)}-${raw.charAt(12)}%22+filetype%3Apdf+OR+filetype%3Axls+OR+filetype%3Adoc`;

    validationStatus.className = "validation-badge status-valid";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>Valid Pakistani Identity Structure</span>`;

    currentDecodedText = `CNIC Decoded Insights:\nDistrict: ${decoded.district}\nDivision: ${decoded.division}\nProvince/Territory: ${decoded.province}\nGender: ${gender}`;

    // Swap Grid views
    cnicResultsGrid.style.display = "grid";
    mobileResultsGrid.style.display = "none";
    resultsWrapper.style.display = "flex";
    inspectorHudWrapper.classList.add("active");
    copyTools.style.display = "flex";

    // Play native haptic trigger + Laser scan
    if (window.NativeBridge) window.NativeBridge.haptic("success");
    triggerLaserScan();
    showToast("CNIC successfully decoded!");

    saveToHistory(decoded.district, decoded.province, gender);
  }

  // 10. Mobile Mode Processing
  function processMobile(mobile) {
    const raw = mobile.replace(/\D/g, "");

    // 3D Flip card to reveal SIM back view
    document.getElementById("sim-back-content").style.display = "block";
    document.getElementById("cnic-back-content").style.display = "none";
    
    if (!digitalCard.classList.contains("flipped")) {
      digitalCard.classList.add("flipped");
      // Trigger gold chip sweep light reflection
      const chips = document.querySelectorAll(".card-chip");
      chips.forEach(c => {
        c.classList.add("flipping");
        setTimeout(() => c.classList.remove("flipping"), 650);
      });
    }
    
    simMockNumber.textContent = mobile || "0300-0000000";

    if (raw.length < 11) {
      setIncompleteState("Enter complete 11-digit mobile number");
      return;
    }

    if (raw.length === 11) {
      const prefix4 = raw.substring(0, 4);
      const match = OPERATOR_PREFIXES.find(p => p.code === prefix4);

      if (!match) {
        setInvalidState("Unknown mobile network prefix.");
        return;
      }

      decodeMobile(raw, match);
    }
  }

  function decodeMobile(raw, operator) {
    // Clear and set operator branding styling classes
    clearGlowClasses();
    clearSimBrandingClasses();
    digitalCard.classList.add(operator.styleClass, operator.glowClass);

    // Update SIM mock card labels
    simMockCarrier.textContent = operator.carrier;
    simMockOperator.textContent = operator.carrier;

    // Update Output spans
    valMobileCarrier.textContent = operator.carrier;
    valMobilePrefix.textContent = operator.code;

    // Configure Mobile OSINT search buttons (replaces 03 with 923)
    const waNumber = "92" + raw.substring(1);
    btnOsintWhatsapp.href = `https://wa.me/${waNumber}`;

    // Google query for spam lists
    btnOsintSpam.href = `https://www.google.com/search?q=%22${raw}%22+OR+%22%2B92+${raw.substring(1,4)}+${raw.substring(4)}%22+spam+fraud+caller+reports`;

    validationStatus.className = "validation-badge status-valid";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
      <span>Valid Pakistani Mobile Network Prefix</span>`;

    currentDecodedText = `Mobile Inspector Decoded:\nOperator: ${operator.carrier}\nPrefix: ${operator.code}\nNumber: ${raw}`;

    // Swap Grid views
    cnicResultsGrid.style.display = "none";
    mobileResultsGrid.style.display = "grid";
    resultsWrapper.style.display = "flex";
    inspectorHudWrapper.classList.remove("active");
    copyTools.style.display = "flex";

    // Play native haptic trigger + Laser scan
    if (window.NativeBridge) window.NativeBridge.haptic("success");
    triggerLaserScan();
    showToast(`Operator resolved as ${operator.carrier}`);
  }

  // Helper cleanup functions for brand styling
  function clearGlowClasses() {
    digitalCard.classList.remove("glow-cnic", "glow-jazz", "glow-zong", "glow-telenor", "glow-ufone", "glow-scom");
  }

  function clearSimBrandingClasses() {
    digitalCard.classList.remove("sim-jazz", "sim-zong", "sim-telenor", "sim-ufone", "sim-scom");
  }

  // State modifiers
  function setIncompleteState(msg) {
    validationStatus.className = "validation-badge status-incomplete";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
      <span>${msg}</span>`;

    resultsWrapper.style.display = "none";
    inspectorHudWrapper.classList.remove("active");
    copyTools.style.display = "none";

    cardMockGender.textContent = "AWAITING INPUT";
    cardMockDistrict.textContent = "PAKISTAN";
    simMockCarrier.textContent = "CARRIER";
    simMockOperator.textContent = "RESOLVING...";
  }

  function setInvalidState(msg) {
    validationStatus.className = "validation-badge status-invalid";
    validationStatus.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span>Invalid: ${msg}</span>`;

    resultsWrapper.style.display = "none";
    inspectorHudWrapper.classList.remove("active");
    copyTools.style.display = "none";

    cardMockGender.textContent = "INVALID";
    cardMockDistrict.textContent = "INVALID";
    simMockCarrier.textContent = "INVALID";
    simMockOperator.textContent = "INVALID PREFIX";

    // Play shake and error haptic feedback
    digitalCard.classList.add("shake-element");
    if (window.NativeBridge) window.NativeBridge.haptic("error");
    setTimeout(() => {
      digitalCard.classList.remove("shake-element");
    }, 450);
  }

  // 11. Clipboard and Sharing
  const setupClipboardCopy = (btn, getValue) => {
    btn.addEventListener("click", () => {
      const val = getValue();
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        const span = btn.querySelector("span");
        const orig = span.textContent;
        span.textContent = "Copied!";
        if (window.NativeBridge) window.NativeBridge.haptic("light");
        setTimeout(() => span.textContent = orig, 1200);
      });
    });
  };

  setupClipboardCopy(btnCopyFormatted, () => cnicInput.value);
  setupClipboardCopy(btnCopyRaw, () => cnicInput.value.replace(/\D/g, ""));

  btnShare.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: "Decodex Report",
        text: currentDecodedText
      }).catch(err => console.log("Sharing error:", err));
    } else {
      navigator.clipboard.writeText(currentDecodedText).then(() => {
        const span = btnShare.querySelector("span");
        span.textContent = "Copied!";
        setTimeout(() => span.textContent = "Share", 1500);
      });
    }
  });

  // 12. History Storage
  function saveToHistory(district, province, gender) {
    let history = JSON.parse(localStorage.getItem("scan-history")) || [];
    const dup = history.some(h => h.district === district && h.province === province && h.gender === gender);
    if (dup) return;

    history.unshift({ district, province, gender, id: Date.now() });
    if (history.length > 5) history.pop();

    localStorage.setItem("scan-history", JSON.stringify(history));
    renderHistory();
  }

  function deleteFromHistory(id) {
    let history = JSON.parse(localStorage.getItem("scan-history")) || [];
    history = history.filter(item => item.id !== id);
    localStorage.setItem("scan-history", JSON.stringify(history));
    renderHistory();
  }

  function setupHistorySwipe(row, id) {
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    row.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      row.style.transition = "none";
    }, { passive: true });

    row.addEventListener("touchmove", (e) => {
      if (!dragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (diff < 0) { // Only swipe left
        row.style.transform = `translateX(${diff}px)`;
      }
    }, { passive: true });

    row.addEventListener("touchend", () => {
      dragging = false;
      row.style.transition = "transform 0.3s ease, opacity 0.3s ease";
      const diff = currentX - startX;
      if (diff < -80) {
        row.style.transform = "translateX(-120%)";
        row.style.opacity = "0";
        if (window.NativeBridge) window.NativeBridge.haptic("heavy");
        showToast("Scan removed from history");
        setTimeout(() => {
          deleteFromHistory(id);
        }, 300);
      } else {
        row.style.transform = "translateX(0)";
      }
      currentX = 0;
    });
  }

  function renderHistory() {
    const history = JSON.parse(localStorage.getItem("scan-history")) || [];
    historyContainer.innerHTML = "";

    if (history.length === 0) {
      historyContainer.innerHTML = `
        <div class="history-empty-state">
          <div class="empty-icon">📋</div>
          <p>No scans yet</p>
          <span style="font-size: 0.65rem; color: var(--text-secondary);">Start typing to decode Pakistani IDs & numbers</span>
        </div>`;
      btnClearHistory.style.display = "none";
      return;
    }

    btnClearHistory.style.display = "block";
    history.forEach(item => {
      const wrapper = document.createElement("div");
      wrapper.className = "history-item-wrapper";

      const deleteBg = document.createElement("div");
      deleteBg.className = "history-delete-bg";
      deleteBg.innerHTML = "<span>🗑️</span>";
      wrapper.appendChild(deleteBg);

      const row = document.createElement("div");
      row.className = "history-item";
      row.innerHTML = `
        <div class="history-meta-loc">
          <span class="history-district-txt">${item.district}</span>
          <span class="history-province-txt">${item.province}</span>
        </div>
        <span class="history-badge-gender ${item.gender === "Male" ? "badge-male" : "badge-female"}">${item.gender}</span>
      `;
      wrapper.appendChild(row);
      historyContainer.appendChild(wrapper);
      
      setupHistorySwipe(row, item.id);
    });
  }

  btnClearHistory.addEventListener("click", () => {
    localStorage.removeItem("scan-history");
    renderHistory();
  });

  renderHistory();

  // 13. Interactive Highlight Linking between grids and visual card
  const setupHoverHighlight = (cardId, spans) => {
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;

    const applyHighlights = (add = true) => {
      spans.forEach(id => {
        const span = document.getElementById(id);
        if (span) {
          const action = add ? "add" : "remove";
          if (cardId.includes("province")) span.classList[action]("highlight-province");
          if (cardId.includes("division")) span.classList[action]("highlight-division");
          if (cardId.includes("district")) span.classList[action]("highlight-district");
          if (cardId.includes("family")) span.classList[action]("highlight-family");
          if (cardId.includes("gender")) span.classList[action]("highlight-gender");
        }
      });
      cardEl.classList[add ? "add" : "remove"]("active-glow");
      
      // Tactile trigger on hover
      if (add && window.NativeBridge) {
        window.NativeBridge.haptic("light");
      }
    };

    cardEl.addEventListener("touchstart", () => applyHighlights(true));
    cardEl.addEventListener("touchend", () => applyHighlights(false));
    cardEl.addEventListener("mouseenter", () => applyHighlights(true));
    cardEl.addEventListener("mouseleave", () => applyHighlights(false));
  };

  setupHoverHighlight("card-province", ["i-prov"]);
  setupHoverHighlight("card-division", ["i-div"]);
  setupHoverHighlight("card-district", ["i-dist", "i-sub"]);
  setupHoverHighlight("card-gender", ["i-gen"]);
  setupHoverHighlight("card-family", ["i-fam"]);

  // Explicit Card Flip Button Click handler
  const flipCardBtn = document.getElementById("flip-card-btn");
  if (flipCardBtn) {
    flipCardBtn.addEventListener("click", () => {
      if (activeMode === "MOBILE") {
        digitalCard.classList.toggle("flipped");
      } else {
        toggleCNICBack();
      }
      if (window.NativeBridge) window.NativeBridge.haptic("light");
    });
  }
});
