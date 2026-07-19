// Safar Saathi Pro - Road Trip Planner Engine

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const setupPanel = document.getElementById("setup-wizard-panel");
  const storyboardPanel = document.getElementById("storyboard-panel");
  const drivePanel = document.getElementById("drive-mode-panel");
  
  const routeSelect = document.getElementById("route-select");
  const carSelect = document.getElementById("car-select");
  const passengersInput = document.getElementById("passengers-input");
  const luggageInput = document.getElementById("luggage-input");
  const btnGenerate = document.getElementById("btn-generate-trip");
  
  const summaryDistance = document.getElementById("summary-distance");
  const summaryEta = document.getElementById("summary-eta");
  const summaryFuelCost = document.getElementById("summary-fuel-cost");
  const timelineList = document.getElementById("timeline-list");
  
  const btnBackSetup = document.getElementById("btn-back-setup");
  const btnStartDrive = document.getElementById("btn-start-drive");
  const btnExitDrive = document.getElementById("btn-exit-drive");
  
  const hudCompassText = document.getElementById("hud-compass-text");
  const hudNextStopTitle = document.getElementById("hud-next-stop-title");
  const hudNextStopDesc = document.getElementById("hud-next-stop-desc");

  // In-memory state
  let currentRoute = null;
  let currentCar = null;
  let totalEtaHours = 0;
  let baseEtaHours = 0;

  // Haptic feedback bridge wrapper
  function triggerHaptic(type) {
    if (window.AndroidBridge && window.AndroidBridge.haptic) {
      window.AndroidBridge.haptic(type);
    }
  }

  // 1. Initialize Options selectors
  function initWizard() {
    routeSelect.innerHTML = "";
    HIGHWAY_ROUTES.forEach((route, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = route.name;
      routeSelect.appendChild(opt);
    });

    carSelect.innerHTML = "";
    for (const carName in VEHICLE_GARAGE) {
      const opt = document.createElement("option");
      opt.value = carName;
      opt.textContent = carName;
      carSelect.appendChild(opt);
    }
  }

  // 2. Theme Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    
    const isLight = document.body.classList.contains("light-theme");
    sunIcon.style.display = isLight ? "none" : "block";
    moonIcon.style.display = isLight ? "block" : "none";
    triggerHaptic("light");
  });

  // 3. Generate Trip Storyboard
  btnGenerate.addEventListener("click", () => {
    const routeIdx = parseInt(routeSelect.value);
    currentRoute = HIGHWAY_ROUTES[routeIdx];
    currentCar = VEHICLE_GARAGE[carSelect.value];
    
    if (!currentRoute || !currentCar) return;

    triggerHaptic("success");
    baseEtaHours = currentRoute.etaHours;
    totalEtaHours = baseEtaHours;
    
    renderStoryboard();
    
    setupPanel.style.display = "none";
    storyboardPanel.style.display = "block";
  });

  function renderStoryboard() {
    // 1. Calculate Fuel Cost
    // Fuel Consumption = Distance / Highway Fuel Efficiency
    const distance = currentRoute.distanceKm;
    const fuelConsumptionLtrs = distance / currentCar.highwayMpg;
    const fuelCost = fuelConsumptionLtrs * FUEL_PRICES.petrol;

    summaryDistance.textContent = `${distance} km`;
    summaryFuelCost.textContent = `Rs. ${Math.round(fuelCost).toLocaleString()}`;
    updateEtaDisplay();

    // 2. Build Timeline List
    timelineList.innerHTML = "";

    // Start Node
    const startItem = document.createElement("div");
    startItem.className = "timeline-item";
    startItem.innerHTML = `
      <span class="timeline-item-title">Start Point</span>
      <p class="timeline-item-desc">Departure from origin city. Ensure tire pressure & water checks.</p>
    `;
    timelineList.appendChild(startItem);

    // Toll Plaza Node
    const tollItem = document.createElement("div");
    tollItem.className = "timeline-item";
    tollItem.innerHTML = `
      <span class="timeline-item-title">Motorway Entry Toll Plaza</span>
      <p class="timeline-item-desc">Toll tax due: Rs. ${currentRoute.tollTax} (M-Tag scan suggested).</p>
    `;
    timelineList.appendChild(tollItem);

    // Dynamic Waypoint Checkpoints
    currentRoute.checkpoints.forEach(checkpoint => {
      const checkItem = document.createElement("div");
      checkItem.className = "timeline-item";
      checkItem.innerHTML = `
        <span class="timeline-item-title">${checkpoint}</span>
        <p class="timeline-item-desc">Food court, fuel station, and NH&MP Help Desk available.</p>
      `;
      timelineList.appendChild(checkItem);
    });

    // Dynamic Scenic Addons with Detour calculation checkbox
    currentRoute.scenicPlaces.forEach((place, idx) => {
      const placeItem = document.createElement("div");
      placeItem.className = "timeline-item";
      placeItem.innerHTML = `
        <span class="timeline-item-title">${place.name}</span>
        <p class="timeline-item-desc">${place.detail}</p>
        <div class="scenic-addon-row">
          <input type="checkbox" id="detour-check-${idx}" data-detour="${place.detourMins}">
          <label for="detour-check-${idx}">Add detour (${place.detourMins} mins added to ETA)</label>
        </div>
      `;
      timelineList.appendChild(placeItem);

      // Checkbox event listener
      const checkbox = placeItem.querySelector(`input[type="checkbox"]`);
      checkbox.addEventListener("change", (e) => {
        const detourHours = parseFloat(e.target.getAttribute("data-detour")) / 60;
        if (e.target.checked) {
          totalEtaHours += detourHours;
          triggerHaptic("light");
        } else {
          totalEtaHours -= detourHours;
        }
        updateEtaDisplay();
      });
    });

    // End Node
    const endItem = document.createElement("div");
    endItem.className = "timeline-item";
    endItem.innerHTML = `
      <span class="timeline-item-title">Destination Reached</span>
      <p class="timeline-item-desc">Estimated arrival at final city destination point.</p>
    `;
    timelineList.appendChild(endItem);
  }

  function updateEtaDisplay() {
    const hours = Math.floor(totalEtaHours);
    const mins = Math.round((totalEtaHours - hours) * 60);
    summaryEta.textContent = `${hours}h ${mins}m`;
  }

  // 4. Drive Mode transitions & overlays
  btnStartDrive.addEventListener("click", () => {
    triggerHaptic("medium");
    storyboardPanel.style.display = "none";
    drivePanel.style.display = "flex";
    
    // Set upcoming rest areas based on selected route
    if (currentRoute) {
      hudNextStopTitle.textContent = currentRoute.checkpoints[0] || "Bhera Rest Area";
    }

    startHudCompassLoop();
  });

  btnExitDrive.addEventListener("click", () => {
    triggerHaptic("light");
    drivePanel.style.display = "none";
    storyboardPanel.style.display = "block";
    stopHudCompassLoop();
  });

  btnBackSetup.addEventListener("click", () => {
    triggerHaptic("light");
    storyboardPanel.style.display = "none";
    setupPanel.style.display = "block";
  });

  // Mock Compass active direction loop
  let compassInterval = null;
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  
  function startHudCompassLoop() {
    let index = 0;
    compassInterval = setInterval(() => {
      index = (index + 1) % directions.length;
      hudCompassText.textContent = directions[index];
    }, 3000);
  }

  function stopHudCompassLoop() {
    if (compassInterval) {
      clearInterval(compassInterval);
    }
  }

  // Initial Wizard trigger
  initWizard();
});
