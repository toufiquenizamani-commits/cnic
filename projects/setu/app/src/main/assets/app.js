// Setu - Verification and Localized Plate Parsing Engine

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const digitalCard = document.getElementById("digital-card");
  const flipBtn = document.getElementById("flip-card-btn");
  
  const plateInput = document.getElementById("plate-input");
  const validationStatus = document.getElementById("validation-status");
  const actionChips = document.getElementById("action-chips");
  const btnExcise = document.getElementById("btn-excise");
  const btnCplc = document.getElementById("btn-cplc");
  
  // Mock Card Details
  const mockRegNo = document.getElementById("mock-reg-no");
  const mockOwner = document.getElementById("mock-owner");
  const mockModel = document.getElementById("mock-model");
  const mockColor = document.getElementById("mock-color");
  
  // Plate face details
  const plateFace = document.getElementById("plate-face");
  const plateProvinceLogo = document.getElementById("plate-province-logo");
  const plateNumberDisplay = document.getElementById("plate-number-display");
  const plateProvinceName = document.getElementById("plate-province-name");

  // Haptic trigger helper
  function triggerHaptic(type) {
    if (window.AndroidBridge && window.AndroidBridge.haptic) {
      window.AndroidBridge.haptic(type);
    }
  }

  // 1. Card Flipping Bindings
  flipBtn.addEventListener("click", () => {
    digitalCard.classList.toggle("flipped");
    triggerHaptic("light");
  });

  // 2. Theme Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    
    const isLight = document.body.classList.contains("light-theme");
    sunIcon.style.display = isLight ? "none" : "block";
    moonIcon.style.display = isLight ? "block" : "none";
    triggerHaptic("light");
  });

  // 3. Plate parsing and styling logic
  plateInput.addEventListener("input", (e) => {
    let query = e.target.value.toUpperCase().replace(/\s+/g, '-').trim();
    
    if (query.length < 3) {
      resetDetails();
      return;
    }

    // Determine province based on number plate structure
    let province = "DEFAULT";
    
    // Punjab pattern: LHR-15-1234 or MN-1234 or LEA-123
    const punjabRegex = /^(LHR|MN|FD|FSD|SLK|MUL|RWP|LE|LEA|LHR|AB|CDN)-\d{2,4}-\d{1,4}$|^(LHR|MN|FD|FSD|SLK|MUL|RWP|LEA)-\d{1,4}$/;
    // Sindh pattern: KEA-123 or SINDH-1234 or plate with standard sindh letters
    const sindhRegex = /^(KA|KB|KC|KD|KE|KF|KG|KH|KI|KJ|KK|KL|KM|KN|KO|KP|KQ|KR|KS|KT|KU|KV|KW|KX|KY|KZ|SND|SNDH|SINDH)-\d{3,4}$/;
    // Islamabad pattern: ICT-123 or IDN-123 or ISL-123
    const islamabadRegex = /^(ICT|IDN|ISL|IB|ISB|ICT-ISB)-\d{3,4}$/;

    if (punjabRegex.test(query) || query.startsWith("L") || query.startsWith("M")) {
      province = "PUNJAB";
    } else if (sindhRegex.test(query) || query.startsWith("K") || query.startsWith("S")) {
      province = "SINDH";
    } else if (islamabadRegex.test(query) || query.startsWith("I")) {
      province = "ISLAMABAD";
    }

    updatePlateVisual(query, province);
  });

  function updatePlateVisual(plate, province) {
    // Render validation badge
    validationStatus.className = "validation-badge status-valid";
    validationStatus.querySelector("span").textContent = `Valid ${province} format`;

    // Render Action Chips and configure URLs
    actionChips.style.display = "flex";
    btnExcise.href = getExciseUrl(plate, province);
    btnCplc.href = `https://www.cplc.org.pk/vehicle-search?plate=${plate}`;

    // Update Plate Generator
    plateNumberDisplay.textContent = plate;
    plateProvinceName.textContent = province;

    // Remove any previous province class variations
    plateFace.className = "card-face card-back";

    if (province === "PUNJAB") {
      plateFace.classList.add("plate-punjab");
      plateProvinceLogo.textContent = "🏛️"; // Minaret icon
      
      // Populate Mock Smart Card
      mockRegNo.textContent = plate;
      mockOwner.textContent = "Muhammad Asif";
      mockModel.textContent = "HONDA CIVIC (2021)";
      mockColor.textContent = "CRYSTAL BLACK";
    } else if (province === "SINDH") {
      plateFace.classList.add("plate-sindh");
      plateProvinceLogo.textContent = "🏺"; // Ajrak motif icon
      
      // Populate Mock Smart Card
      mockRegNo.textContent = plate;
      mockOwner.textContent = "Syed Tariq Ali";
      mockModel.textContent = "TOYOTA COROLLA (2019)";
      mockColor.textContent = "SUPER WHITE";
    } else if (province === "ISLAMABAD") {
      plateFace.classList.add("plate-islamabad");
      plateProvinceLogo.textContent = "🕌"; // Faisal Mosque icon
      
      // Populate Mock Smart Card
      mockRegNo.textContent = plate;
      mockOwner.textContent = "Zainab Bibi";
      mockModel.textContent = "SUZUKI ALTO (2022)";
      mockColor.textContent = "SILVER METALLIC";
    } else {
      // Default
      plateProvinceLogo.textContent = "🇵🇰";
      mockRegNo.textContent = plate;
      mockOwner.textContent = "Unknown Owner";
      mockModel.textContent = "RESOLVING VEHICLE...";
      mockColor.textContent = "N/A";
    }
  }

  function getExciseUrl(plate, province) {
    if (province === "PUNJAB") {
      return `https://mtmis.excise.punjab.gov.pk/?plate=${plate}`;
    } else if (province === "SINDH") {
      return `https://excise.gos.pk/vehicle/vehicle_search?plate=${plate}`;
    } else if (province === "ISLAMABAD") {
      return `https://islamabadexcise.gov.pk/vehicle_verification?plate=${plate}`;
    }
    return "#";
  }

  function resetDetails() {
    validationStatus.className = "validation-badge status-incomplete";
    validationStatus.querySelector("span").textContent = "Ready for plate...";
    actionChips.style.display = "none";
    
    mockRegNo.textContent = "AWAITING INPUT";
    mockOwner.textContent = "RESOLVING DETAIL";
    mockModel.textContent = "HONDA / TOYOTA";
    mockColor.textContent = "BLACK / WHITE";
    
    plateNumberDisplay.textContent = "ABC-123";
    plateProvinceName.textContent = "PUNJAB";
    plateFace.className = "card-face card-back";
    plateProvinceLogo.textContent = "🏛️";
  }

  // Intercept button click triggers for haptics
  btnExcise.addEventListener("click", () => triggerHaptic("success"));
  btnCplc.addEventListener("click", () => triggerHaptic("success"));
});
