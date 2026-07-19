// Mandi Matrix - Rates Visualizer and Budget Planner Engine

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const citySelect = document.getElementById("city-select");
  const ratesGrid = document.getElementById("rates-grid");
  
  const cropAddSelect = document.getElementById("crop-add-select");
  const cropQtyInput = document.getElementById("crop-qty-input");
  const btnAddItem = document.getElementById("btn-add-item");
  const budgetList = document.getElementById("budget-list");
  const budgetTotalsPanel = document.getElementById("budget-totals");
  const totalWholesaleCost = document.getElementById("total-wholesale-cost");
  const totalRetailCost = document.getElementById("total-retail-cost");

  // In-memory budget planner state
  let budgetItems = [];

  // Haptic feedback bridge wrapper
  function triggerHaptic(type) {
    if (window.AndroidBridge && window.AndroidBridge.haptic) {
      window.AndroidBridge.haptic(type);
    }
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

  // 2. City Selector Listener
  citySelect.addEventListener("change", () => {
    const selectedCity = citySelect.value;
    renderRates(selectedCity);
    populateCropSelectors(selectedCity);
    
    // Reset budget planner when city changes
    budgetItems = [];
    renderBudgetList();
    triggerHaptic("medium");
  });

  // 3. Render Commodity Grid
  function renderRates(city) {
    ratesGrid.innerHTML = "";
    const crops = COMMODITY_BASE_DB[city] || COMMODITY_BASE_DB["Lahore"];

    for (const cropName in crops) {
      const crop = crops[cropName];
      const spreadPct = Math.round((crop.wholesale / crop.retail) * 100);
      
      const card = document.createElement("div");
      card.className = "chalk-card";
      card.innerHTML = `
        <div class="card-top">
          <span class="crop-icon">${crop.icon}</span>
          <span class="crop-name">${cropName}</span>
        </div>
        <div class="price-details">
          <div class="price-line">
            <span>Mandi (Wholesale)</span>
            <span class="color-ws">Rs. ${crop.wholesale}/${crop.unit}</span>
          </div>
          <div class="price-line">
            <span>Mohalla (Retail)</span>
            <span class="color-rt">Rs. ${crop.retail}/${crop.unit}</span>
          </div>
        </div>
        <div class="spread-bar-container" title="Wholesale is ${spreadPct}% of Retail price">
          <div class="spread-bar" style="width: ${spreadPct}%"></div>
        </div>
      `;
      ratesGrid.appendChild(card);
    }
  }

  // 4. Populate Crop Add Selectors
  function populateCropSelectors(city) {
    cropAddSelect.innerHTML = "";
    const crops = COMMODITY_BASE_DB[city] || COMMODITY_BASE_DB["Lahore"];
    
    for (const cropName in crops) {
      const option = document.createElement("option");
      option.value = cropName;
      option.textContent = `${crops[cropName].icon} ${cropName}`;
      cropAddSelect.appendChild(option);
    }
  }

  // 5. Budget Planner Operations
  btnAddItem.addEventListener("click", () => {
    const cropName = cropAddSelect.value;
    const qty = parseInt(cropQtyInput.value) || 1;
    
    const city = citySelect.value;
    const cropData = COMMODITY_BASE_DB[city][cropName];

    if (!cropData) return;

    // Check if item already exists in budget planner list
    const existingIndex = budgetItems.findIndex(item => item.name === cropName);
    if (existingIndex > -1) {
      budgetItems[existingIndex].qty += qty;
    } else {
      budgetItems.push({
        name: cropName,
        icon: cropData.icon,
        qty: qty,
        unit: cropData.unit,
        wholesaleRate: cropData.wholesale,
        retailRate: cropData.retail
      });
    }

    renderBudgetList();
    triggerHaptic("light");
  });

  function renderBudgetList() {
    budgetList.innerHTML = "";
    
    if (budgetItems.length === 0) {
      budgetTotalsPanel.style.display = "none";
      return;
    }

    budgetTotalsPanel.style.display = "grid";
    let totalWholesale = 0;
    let totalRetail = 0;

    budgetItems.forEach((item, index) => {
      const itemWholesaleTotal = item.wholesaleRate * item.qty;
      const itemRetailTotal = item.retailRate * item.qty;
      
      totalWholesale += itemWholesaleTotal;
      totalRetail += itemRetailTotal;

      const row = document.createElement("div");
      row.className = "budget-row";
      row.innerHTML = `
        <div class="budget-row-left">
          <button class="btn-delete" data-index="${index}">🗑️</button>
          <span>${item.icon} ${item.name} (${item.qty} ${item.unit})</span>
        </div>
        <span>Rs. ${itemRetailTotal}</span>
      `;
      budgetList.appendChild(row);
    });

    // Update totals
    totalWholesaleCost.textContent = `Rs. ${totalWholesale.toLocaleString()}`;
    totalRetailCost.textContent = `Rs. ${totalRetail.toLocaleString()}`;

    // Add delete event bindings
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        budgetItems.splice(index, 1);
        renderBudgetList();
        triggerHaptic("light");
      });
    });
  }

  // 6. Export Rate Card PDF Report
  const btnExportPdf = document.getElementById("btn-export-pdf");
  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", () => {
      triggerHaptic("medium");
      if (window.pywebview && window.pywebview.api && window.pywebview.api.export_pdf_report) {
        const city = citySelect.value;
        const cropsData = MANDI_RATES[city] || {};
        window.pywebview.api.export_pdf_report(city, JSON.stringify(cropsData)).then(res => {
          alert(res.message);
        }).catch(err => {
          alert("Error exporting PDF: " + err);
        });
      } else {
        window.print();
      }
    });
  }

  // Initial Runs
  const initialCity = citySelect.value;
  renderRates(initialCity);
  populateCropSelectors(initialCity);
});
