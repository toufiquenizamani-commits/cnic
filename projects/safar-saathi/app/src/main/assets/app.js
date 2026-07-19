// Safar Saathi Pro - Road Trip Planner Engine

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  const setupPanel = document.getElementById("setup-wizard-panel");
  const storyboardPanel = document.getElementById("storyboard-panel");
  const drivePanel = document.getElementById("drive-mode-panel");
  
  const originInput = document.getElementById("origin-input");
  const destinationInput = document.getElementById("destination-input");
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
    carSelect.innerHTML = "";
    for (const carName in VEHICLE_GARAGE) {
      const opt = document.createElement("option");
      opt.value = carName;
      opt.textContent = carName;
      carSelect.appendChild(opt);
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

  // 2. Theme Toggle
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

  // 3. Generate Trip Storyboard
  btnGenerate.addEventListener("click", () => {
    const origin = originInput.value.trim() || "Lahore";
    const destination = destinationInput.value.trim() || "Islamabad";
    
    const origUpper = origin.toUpperCase();
    const destUpper = destination.toUpperCase();
    currentCar = VEHICLE_GARAGE[carSelect.value];

    if (!currentCar) return;

    // Route matching
    if ((origUpper.includes("LAHORE") || origUpper.includes("LHR")) && 
        (destUpper.includes("ISLAMABAD") || destUpper.includes("ISB"))) {
      currentRoute = HIGHWAY_ROUTES[0];
    } else if ((origUpper.includes("MULTAN") || origUpper.includes("MUX")) && 
               (destUpper.includes("SUKKUR") || destUpper.includes("SKZ"))) {
      currentRoute = HIGHWAY_ROUTES[1];
    } else {
      // Dynamic simulated route calculations
      const hashVal = origin.length + destination.length;
      const distanceKm = Math.min(Math.max((hashVal * 18) + 120, 150), 650);
      const etaHours = parseFloat((distanceKm / 82).toFixed(1));
      const tollTax = Math.round(distanceKm * 2.8);
      
      const checkpoints = [
        `${origin} Exit Toll Plaza`,
        "Midway Highway Service Area",
        `${destination} Entrance Junction`
      ];
      
      let scenicPlaces = [
        { name: `${destination} City Gate point`, detail: "Historic landmark photos", detourMins: 10 },
        { name: "Local Highway Viewpoint", detail: "Scenic roadside photography", detourMins: 15 }
      ];
      
      if (destUpper.includes("NARAN") || destUpper.includes("HUNZA") || destUpper.includes("SWAT") || destUpper.includes("GILGIT")) {
        scenicPlaces = [
          { name: "Salt Range Viewpoint", detail: "Mountain photography", detourMins: 15 },
          { name: "River Bank Stopover", detail: "Scenic fresh water views", detourMins: 20 },
          { name: "Mountain Pass Peak Point", detail: "Cold altitude visual scan stop", detourMins: 30 }
        ];
      } else if (destUpper.includes("KARACHI") || destUpper.includes("SINDH") || destUpper.includes("HYDERABAD")) {
        scenicPlaces = [
          { name: "Keenjhar Lake detour", detail: "Historic tourist lake boat stop", detourMins: 25 },
          { name: "Sufi Shrine Viewpoint", detail: "Cultural architecture sight", detourMins: 20 }
        ];
      }

      currentRoute = {
        name: `${origin} to ${destination}`,
        distanceKm: distanceKm,
        etaHours: etaHours,
        tollTax: tollTax,
        checkpoints: checkpoints,
        scenicPlaces: scenicPlaces
      };
    }

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

  // 5. Print PDF Exporter Bridge
  const btnExportPdf = document.getElementById("btn-export-pdf");
  if (btnExportPdf) {
    btnExportPdf.addEventListener("click", () => {
      triggerHaptic("medium");
      if (window.pywebview && window.pywebview.api && window.pywebview.api.export_trip_postcard) {
        const payload = JSON.stringify({
          routeName: currentRoute ? currentRoute.name : "Custom Route",
          car: carSelect.value,
          distance: summaryDistance.textContent,
          eta: summaryEta.textContent,
          fuelCost: summaryFuelCost.textContent
        });
        window.pywebview.api.export_trip_postcard(payload).then(res => {
          alert(res.message);
        }).catch(err => {
          alert("Error exporting PDF: " + err);
        });
      } else {
        window.print();
      }
    });
  }

  // Initial Wizard trigger
  initWizard();
});
