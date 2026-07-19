// Safar Suitcase - Offline Customs Limits & Cargo Tariff Database

// FBR Customs limits rules for borders (Wagah, Taftan, Torkham)
const CUSTOMS_RULES = {
  limits: {
    goldMaxGrams: 10.0,      // Max gold weight in grams allowed without duty
    cashUsdLimit: 5000.0,    // Max foreign currency equivalent in USD without declaration
    mobileLimit: 1,          // Max number of personal mobile phones allowed duty-free
    personalValLimit: 500.0  // Max value of other personal gifts/items in USD
  },
  duties: {
    goldDutyPerGram: 1850,   // PKR tax per additional gram
    mobileDutyFlat: 25000,   // PKR average duty on standard mid-range smartphone
    surchargePct: 0.15       // 15% surcharge on items exceeding personal limits
  }
};

// Cargo shipping rates (PKR) comparison matrix per weight class
const CARGO_RATES_MATRIX = {
  // Rate entries for weight in kg: [TCS rate, Leopards rate, Local Bus cargo rate]
  slabs: [
    { maxWeight: 1, tcs: 380, leopards: 320, busCargo: 150 },
    { maxWeight: 5, tcs: 1250, leopards: 1050, busCargo: 450 },
    { maxWeight: 10, tcs: 2200, leopards: 1900, busCargo: 750 },
    { maxWeight: 20, tcs: 3800, leopards: 3400, busCargo: 1200 },
    { maxWeight: 50, tcs: 7500, leopards: 6800, busCargo: 2200 }
  ]
};
