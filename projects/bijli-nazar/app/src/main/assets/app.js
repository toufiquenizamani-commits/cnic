// Bijli Nazar - App Controller and Tariff Audit Engine

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const btnScan = document.getElementById("btn-camera-scan");
  const discoSelect = document.getElementById("disco-select");
  const unitsInput = document.getElementById("units-input");
  
  const gaugeFill = document.getElementById("gauge-fill");
  const displayUnits = document.getElementById("display-units");
  const pacingBadge = document.getElementById("pacing-badge");
  
  const auditResults = document.getElementById("audit-results");
  const auditBase = document.getElementById("audit-base");
  const auditSurcharges = document.getElementById("audit-surcharges");
  const auditTaxes = document.getElementById("audit-taxes");
  const auditTotal = document.getElementById("audit-total");
  const discrepancyPanel = document.getElementById("discrepancy-panel");
  const btnDispute = document.getElementById("btn-dispute-draft");
  
  const acCountSlider = document.getElementById("ac-count-slider");
  const acHoursSlider = document.getElementById("ac-hours-slider");
  const acCountVal = document.getElementById("ac-count-val");
  const acHoursVal = document.getElementById("ac-hours-val");
  const estUnitsAdded = document.getElementById("est-units-added");
  const estCostAdded = document.getElementById("est-cost-added");

  // Haptic feedback bridge wrapper
  function triggerHaptic(type) {
    if (window.AndroidBridge && window.AndroidBridge.haptic) {
      window.AndroidBridge.haptic(type);
    }
  }

  // Toast Notification System
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Check and apply system theme preference initially
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.body.classList.add("dark-theme");
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
  } else {
    document.body.classList.add("light-theme");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
  }

  // 1. Theme Toggle
  themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
      document.body.classList.add("light-theme");
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      document.body.classList.remove("light-theme");
      document.body.classList.add("dark-theme");
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
    triggerHaptic("light");
  });

  // 2. Scan Button Handler
  btnScan.addEventListener("click", () => {
    triggerHaptic("medium");
    if (window.AndroidBridge && window.AndroidBridge.startOcrScan) {
      window.AndroidBridge.startOcrScan();
    } else {
      showToast("Camera scanner only works on Android devices!");
    }
  });

  // 3. Slider Listeners (AC Estimation)
  acCountSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    acCountVal.textContent = val === "1" ? "1 AC" : `${val} ACs`;
    calculateAcUsage();
  });

  acHoursSlider.addEventListener("input", (e) => {
    const val = e.target.value;
    acHoursVal.textContent = `${val} Hours`;
    calculateAcUsage();
  });

  function calculateAcUsage() {
    const count = parseInt(acCountSlider.value);
    const hours = parseInt(acHoursSlider.value);
    
    // Average 1.5-ton inverter AC consumption (~1.0 KWh / hour under normal load)
    const unitsPerAcHour = 1.0;
    const unitsAdded = Math.round(count * hours * unitsPerAcHour * 30); // 30 days
    
    estUnitsAdded.textContent = unitsAdded;
    
    // Calculate estimation cost using unprotected rates (approx Rs. 38/unit base + taxes)
    const averageRatePerUnit = 42.0;
    estCostAdded.textContent = `Rs. ${(unitsAdded * averageRatePerUnit).toLocaleString(undefined, {maximumFractionDigits: 0})}`;
  }

  // 4. Calculations Trigger
  unitsInput.addEventListener("input", () => {
    const units = parseInt(unitsInput.value) || 0;
    auditBill(units, discoSelect.value);
  });

  discoSelect.addEventListener("change", () => {
    const units = parseInt(unitsInput.value) || 0;
    auditBill(units, discoSelect.value);
  });

  function auditBill(units, disco) {
    if (units <= 0) {
      auditResults.style.display = "none";
      updateGauge(0);
      return;
    }

    auditResults.style.display = "block";
    updateGauge(units);

    // Determine protected vs unprotected status
    const isProtected = units <= 200;
    const slabs = isProtected ? NEPRA_TARIFFS.protected : NEPRA_TARIFFS.unprotected;
    
    // 1. Calculate Base Energy Charges
    let baseEnergyCost = 0;
    let unitsRemaining = units;
    let previousLimit = 0;

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      const slabLimit = slab.limit;
      const slabRate = slab.rate;
      const range = slabLimit - previousLimit;

      if (unitsRemaining > range) {
        baseEnergyCost += range * slabRate;
        unitsRemaining -= range;
        previousLimit = slabLimit;
      } else {
        baseEnergyCost += unitsRemaining * slabRate;
        unitsRemaining = 0;
        break;
      }
    }

    // 2. Surcharges (FCA + QTA + Surcharges per unit)
    const t = NEPRA_TARIFFS.taxes;
    const surchargesCost = units * (t.fca + t.qta + t.surcharge);

    // 3. Government Taxes & Duties
    const energyTaxGST = baseEnergyCost * t.gst;
    const electricityDutyCost = baseEnergyCost * t.electricityDuty;
    const flatTaxes = t.tvFee;
    const totalTaxes = energyTaxGST + electricityDutyCost + flatTaxes;

    // 4. Grand Total Billed Cost
    const totalBill = baseEnergyCost + surchargesCost + totalTaxes;

    // Update Output UI Spans
    auditBase.textContent = `Rs. ${baseEnergyCost.toFixed(2)}`;
    auditSurcharges.textContent = `Rs. ${surchargesCost.toFixed(2)}`;
    auditTaxes.textContent = `Rs. ${totalTaxes.toFixed(2)}`;
    auditTotal.textContent = `Rs. ${totalBill.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Discrepancy checker simulation (mocking flags if rates exceed NEPRA caps)
    discrepancyPanel.style.display = "none";
  }

  function updateGauge(units) {
    displayUnits.textContent = units;
    
    // Gauge stroke dashoffset calculation (circ = 2 * PI * r = 314.16)
    const maxUnits = 200;
    const circ = 314.16;
    const percentage = Math.min(units / maxUnits, 1.0);
    const offset = circ * (1 - percentage);
    
    gaugeFill.style.strokeDashoffset = offset;

    // Update color states and descriptions
    gaugeFill.className = "gauge-fill";
    if (units <= 150) {
      gaugeFill.classList.add("status-protected");
      pacingBadge.className = "badge badge-success";
      pacingBadge.textContent = "Protected Consumer";
    } else if (units < 200) {
      gaugeFill.classList.add("status-approaching");
      pacingBadge.className = "badge badge-warning";
      pacingBadge.textContent = "Approaching Limit";
    } else {
      gaugeFill.classList.add("status-unprotected");
      pacingBadge.className = "badge badge-danger";
      pacingBadge.textContent = "Unprotected Slab";
    }
  }

  // 5. OCR Scanner Native Callbacks
  window.handleOcrResult = (lines) => {
    triggerHaptic("success");
    showToast("Bill successfully parsed!");

    let detectedUnits = null;
    let detectedDisco = null;

    // Loop lines to look for units and DISCO identifiers
    lines.forEach(line => {
      const upperLine = line.toUpperCase();
      
      // Parse DISCO names
      for (const discoKey in DISCOS) {
        if (upperLine.includes(discoKey)) {
          detectedDisco = discoKey;
        }
      }

      // Parse Units (KWH consumed)
      const unitsMatch = upperLine.match(/\b(\d{1,4})\s*(KWH|UNITS|CONS|TOTAL)\b/) || upperLine.match(/KWH\s*[:=-]?\s*(\d{1,4})/);
      if (unitsMatch && unitsMatch[1]) {
        detectedUnits = parseInt(unitsMatch[1]);
      }
    });

    // Populate data
    if (detectedDisco) {
      discoSelect.value = detectedDisco;
    }
    if (detectedUnits !== null) {
      unitsInput.value = detectedUnits;
      auditBill(detectedUnits, discoSelect.value);
    }
  };

  window.handleOcrError = (msg) => {
    triggerHaptic("error");
    showToast(msg);
  };

  // 6. Export Audit PDF Report
  const btnExportPdf = document.getElementById("btn-export-pdf");
  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", () => {
      triggerHaptic("medium");
      if (window.pywebview && window.pywebview.api && window.pywebview.api.export_audit_pdf) {
        const payload = JSON.stringify({
          disco: discoSelect.value,
          units: unitsInput.value,
          base: auditBase.textContent,
          surcharges: auditSurcharges.textContent,
          taxes: auditTaxes.textContent,
          total: auditTotal.textContent
        });
        window.pywebview.api.export_audit_pdf(payload).then(res => {
          alert(res.message);
        }).catch(err => {
          alert("Error exporting PDF: " + err);
        });
      } else {
        window.print();
      }
    });
  }

  // Initial runs
  calculateAcUsage();
});
