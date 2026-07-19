// Safar Suitcase - Customs Declarations & Cargo Pricing Controller

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const tabCustoms = document.getElementById("tab-customs");
  const tabCargo = document.getElementById("tab-cargo");
  const panelCustoms = document.getElementById("panel-customs-content");
  const panelCargo = document.getElementById("panel-cargo-content");
  
  // Customs elements
  const borderSelect = document.getElementById("border-select");
  const goldInput = document.getElementById("gold-input");
  const cashInput = document.getElementById("cash-input");
  const phonesInput = document.getElementById("phones-input");
  const customsResults = document.getElementById("customs-results");
  const badgeGold = document.getElementById("badge-gold");
  const badgeCash = document.getElementById("badge-cash");
  const badgePhones = document.getElementById("badge-phones");
  const estDutyTax = document.getElementById("est-duty-tax");
  const emergencySmsText = document.getElementById("emergency-sms-text");
  const btnSendSms = document.getElementById("btn-send-sms");

  // Cargo elements
  const cargoWeightInput = document.getElementById("cargo-weight-input");
  const cargoComparisonGrid = document.getElementById("cargo-comparison-grid");
  const valTcs = document.getElementById("val-tcs");
  const valLeopards = document.getElementById("val-leopards");
  const valBus = document.getElementById("val-bus");
  const cardTcs = document.getElementById("card-tcs");
  const cardLeopards = document.getElementById("card-leopards");
  const cardBus = document.getElementById("card-bus");

  // Haptic feedback bridge wrapper
  function triggerHaptic(type) {
    if (window.AndroidBridge && window.AndroidBridge.haptic) {
      window.AndroidBridge.haptic(type);
    }
  }

  // 1. Tab Navigation Toggles
  tabCustoms.addEventListener("click", () => {
    tabCustoms.classList.add("active");
    tabCargo.classList.remove("active");
    panelCustoms.style.display = "block";
    panelCargo.style.display = "none";
    triggerHaptic("light");
  });

  tabCargo.addEventListener("click", () => {
    tabCargo.classList.add("active");
    tabCustoms.classList.remove("active");
    panelCargo.style.display = "block";
    panelCustoms.style.display = "none";
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

  // 3. FBR Customs Audit Math
  function auditCustoms() {
    const gold = parseFloat(goldInput.value) || 0;
    const cash = parseFloat(cashInput.value) || 0;
    const phones = parseInt(phonesInput.value) || 0;

    if (gold <= 0 && cash <= 0 && phones <= 0) {
      customsResults.style.display = "none";
      return;
    }

    customsResults.style.display = "block";
    const r = CUSTOMS_RULES.limits;
    const d = CUSTOMS_RULES.duties;

    let dutyTaxTotal = 0;

    // Gold Check
    if (gold > r.goldMaxGrams) {
      badgeGold.textContent = "Declaring Overlimit";
      badgeGold.className = "badge badge-danger";
      dutyTaxTotal += (gold - r.goldMaxGrams) * d.goldDutyPerGram;
    } else {
      badgeGold.textContent = "Duty Free";
      badgeGold.className = "badge badge-success";
    }

    // Cash Check
    if (cash > r.cashUsdLimit) {
      badgeCash.textContent = "Declaring Overlimit";
      badgeCash.className = "badge badge-danger";
    } else {
      badgeCash.textContent = "Duty Free";
      badgeCash.className = "badge badge-success";
    }

    // Mobile phones check
    if (phones > r.mobileLimit) {
      badgePhones.textContent = "Declaring Overlimit";
      badgePhones.className = "badge badge-danger";
      dutyTaxTotal += (phones - r.mobileLimit) * d.mobileDutyFlat;
    } else {
      badgePhones.textContent = "Duty Free";
      badgePhones.className = "badge badge-success";
    }

    estDutyTax.textContent = `Rs. ${dutyTaxTotal.toLocaleString()}`;

    // Emergency Pre-Border SMS Draft
    const border = borderSelect.value;
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    emergencySmsText.value = `SAFAR ALERT: Crossing ${border} Border at ${timestamp}. Declaring Gold: ${gold}g, Cash: $${cash}, Phones: ${phones}. System check: Valid.`;
  }

  // Bind inputs
  borderSelect.addEventListener("change", auditCustoms);
  goldInput.addEventListener("input", auditCustoms);
  cashInput.addEventListener("input", auditCustoms);
  phonesInput.addEventListener("input", auditCustoms);

  // Send SMS Click trigger
  btnSendSms.addEventListener("click", () => {
    triggerHaptic("success");
    const msg = encodeURIComponent(emergencySmsText.value);
    // Launches native external SMS messenger
    window.location.href = `sms:?body=${msg}`;
  });

  // 4. Cargo Slabs Pricing Calculator
  function calculateCargo() {
    const weight = parseFloat(cargoWeightInput.value) || 0;
    if (weight <= 0) {
      cargoComparisonGrid.style.display = "none";
      return;
    }

    cargoComparisonGrid.style.display = "flex";
    
    // Find matching weight slab
    const slabs = CARGO_RATES_MATRIX.slabs;
    let selectedSlab = slabs[slabs.length - 1]; // Default to largest

    for (let i = 0; i < slabs.length; i++) {
      if (weight <= slabs[i].maxWeight) {
        selectedSlab = slabs[i];
        break;
      }
    }

    // Populate pricing
    valTcs.textContent = `Rs. ${selectedSlab.tcs}`;
    valLeopards.textContent = `Rs. ${selectedSlab.leopards}`;
    valBus.textContent = `Rs. ${selectedSlab.busCargo}`;

    // Highlight the cheapest card
    cardTcs.className = "comparison-card";
    cardLeopards.className = "comparison-card";
    cardBus.className = "comparison-card";

    const rates = [
      { name: "tcs", rate: selectedSlab.tcs, element: cardTcs },
      { name: "leopards", rate: selectedSlab.leopards, element: cardLeopards },
      { name: "bus", rate: selectedSlab.busCargo, element: cardBus }
    ];

    rates.sort((a, b) => a.rate - b.rate);
    // Lowest element gets the cheapest styling
    rates[0].element.classList.add("cheapest-card");
  }

  cargoWeightInput.addEventListener("input", calculateCargo);

  // Initial runs
  auditCustoms();
  calculateCargo();
});
