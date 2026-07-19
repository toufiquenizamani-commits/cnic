// Bijli Nazar - Offline Tariff & Slabs Database

// Regional DISCO Names and their identifiers
const DISCOS = {
  "LESCO": "Lahore Electric Supply Company",
  "K-ELECTRIC": "K-Electric Karachi",
  "IESCO": "Islamabad Electric Supply Company",
  "MEPCO": "Multan Electric Power Company",
  "FESCO": "Faisalabad Electric Supply Company",
  "PESCO": "Peshawar Electric Supply Company",
  "HESCO": "Hyderabad Electric Supply Company",
  "SEPCO": "Sukkur Electric Power Company",
  "QESCO": "Quetta Electric Supply Company",
  "TESCO": "Tribal Electric Supply Company"
};

// Current NEPRA Approved Residential Tariffs (Base rate per unit in PKR)
const NEPRA_TARIFFS = {
  // Protected Residential Slabs (Consuming <= 200 units for 6 consecutive months)
  protected: [
    { limit: 50, rate: 11.69 },
    { limit: 100, rate: 15.20 }
  ],
  // Unprotected Residential Slabs (Consuming > 200 units at any point)
  unprotected: [
    { limit: 100, rate: 23.59 },
    { limit: 200, rate: 30.07 },
    { limit: 300, rate: 34.26 },
    { limit: 400, rate: 39.15 },
    { limit: 500, rate: 41.36 },
    { limit: 600, rate: 42.78 },
    { limit: 700, rate: 43.92 },
    { limit: 999999, rate: 48.84 } // 700+ units
  ],
  // Flat Tax Rates
  taxes: {
    gst: 0.18,              // GST (18%)
    electricityDuty: 0.015, // Electricity Duty (1.5% of base energy cost)
    tvFee: 35.0,            // Flat TV license fee (PKR 35)
    fca: 4.85,              // Estimated Fuel Charges Adjustment per unit (average)
    qta: 3.28,              // Estimated Quarterly Tariff Adjustment per unit
    surcharge: 3.82         // Flat Financing Surcharge per unit
  }
};
