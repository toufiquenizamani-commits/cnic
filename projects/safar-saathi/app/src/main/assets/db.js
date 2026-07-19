// Safar Saathi Pro - Vehicles, Highways, and Place Discovery Database

// Popular Pakistani Cars with estimated highway/city fuel efficiency
const VEHICLE_GARAGE = {
  "Toyota Corolla (1.8 Petrol)": { cityMpg: 10.0, highwayMpg: 14.5 },
  "Honda Civic (1.5 Turbo)": { cityMpg: 11.5, highwayMpg: 16.0 },
  "Suzuki Cultus (1.0 VXL)": { cityMpg: 14.0, highwayMpg: 19.5 },
  "Suzuki Alto (0.6 R-Series)": { cityMpg: 18.0, highwayMpg: 22.0 },
  "Toyota Fortuner (2.7 Sigma)": { cityMpg: 7.0, highwayMpg: 9.5 }
};

// Route matrices covering key highways and travel lanes
const HIGHWAY_ROUTES = [
  {
    id: "m2-route",
    name: "Lahore to Islamabad via M-2 Motorway",
    distanceKm: 375,
    etaHours: 4.2,
    tollTax: 1250,
    checkpoints: ["Kallar Kahar rest area", "Bhera interchange", "Sial Service area"],
    scenicPlaces: [
      { name: "Salt Range Viewpoint", detail: "Panoramic view of salt formations", detourMins: 15 },
      { name: "Khewra Salt Mine", detail: "World's second largest salt mine detour", detourMins: 45 },
      { name: "Kallar Kahar Lake", detail: "Scenic lake boat rides & peacocks garden", detourMins: 10 }
    ]
  },
  {
    id: "m5-route",
    name: "Multan to Sukkur via M-5 Motorway",
    distanceKm: 390,
    etaHours: 3.9,
    tollTax: 1100,
    checkpoints: ["Uch Sharif interchange", "Jahangir rest area"],
    scenicPlaces: [
      { name: "Uch Sharif Tomb Complex", detail: "Historic 13th-century sufi shrines detour", detourMins: 30 },
      { name: "Panjnad Headworks", detail: "Meeting point of five rivers of Punjab", detourMins: 20 }
    ]
  }
];

// Current fuel prices (PKR per Litre)
const FUEL_PRICES = {
  petrol: 275.50,
  diesel: 283.80
};
