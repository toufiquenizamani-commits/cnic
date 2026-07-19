// Mandi Matrix - Local Commodity Price Database

// City list for pricing segmentation
const CITIES = ["Lahore", "Karachi", "Islamabad", "Multan", "Peshawar", "Faisalabad"];

// Base pricing profiles (in PKR per kg/unit) for Mandi vs Retail
const COMMODITY_BASE_DB = {
  "Lahore": {
    "Wheat (Gandum)": { wholesale: 95, retail: 120, unit: "kg", icon: "🌾" },
    "Rice (Basmati)": { wholesale: 280, retail: 340, unit: "kg", icon: "🌾" },
    "Onion (Piyaz)": { wholesale: 110, retail: 145, unit: "kg", icon: "🧅" },
    "Potato (Aloo)": { wholesale: 65, retail: 85, unit: "kg", icon: "🥔" },
    "Tomato (Tamatar)": { wholesale: 90, retail: 130, unit: "kg", icon: "🍅" },
    "Ginger (Adrak)": { wholesale: 520, retail: 680, unit: "kg", icon: "🫚" },
    "Garlic (Lasun)": { wholesale: 380, retail: 460, unit: "kg", icon: "🧄" },
    "Apple (Kala Kulu)": { wholesale: 180, retail: 240, unit: "kg", icon: "🍎" },
    "Milk (Doodh)": { wholesale: 160, retail: 190, unit: "litre", icon: "🥛" }
  },
  "Karachi": {
    "Wheat (Gandum)": { wholesale: 105, retail: 135, unit: "kg", icon: "🌾" },
    "Rice (Basmati)": { wholesale: 295, retail: 360, unit: "kg", icon: "🌾" },
    "Onion (Piyaz)": { wholesale: 120, retail: 155, unit: "kg", icon: "🧅" },
    "Potato (Aloo)": { wholesale: 75, retail: 95, unit: "kg", icon: "🥔" },
    "Tomato (Tamatar)": { wholesale: 100, retail: 140, unit: "kg", icon: "🍅" },
    "Ginger (Adrak)": { wholesale: 550, retail: 710, unit: "kg", icon: "🫚" },
    "Garlic (Lasun)": { wholesale: 400, retail: 490, unit: "kg", icon: "🧄" },
    "Apple (Kala Kulu)": { wholesale: 200, retail: 260, unit: "kg", icon: "🍎" },
    "Milk (Doodh)": { wholesale: 180, retail: 220, unit: "litre", icon: "🥛" }
  },
  "Islamabad": {
    "Wheat (Gandum)": { wholesale: 98, retail: 125, unit: "kg", icon: "🌾" },
    "Rice (Basmati)": { wholesale: 290, retail: 350, unit: "kg", icon: "🌾" },
    "Onion (Piyaz)": { wholesale: 115, retail: 150, unit: "kg", icon: "🧅" },
    "Potato (Aloo)": { wholesale: 70, retail: 90, unit: "kg", icon: "🥔" },
    "Tomato (Tamatar)": { wholesale: 95, retail: 135, unit: "kg", icon: "🍅" },
    "Ginger (Adrak)": { wholesale: 540, retail: 700, unit: "kg", icon: "🫚" },
    "Garlic (Lasun)": { wholesale: 390, retail: 470, unit: "kg", icon: "🧄" },
    "Apple (Kala Kulu)": { wholesale: 190, retail: 250, unit: "kg", icon: "🍎" },
    "Milk (Doodh)": { wholesale: 170, retail: 200, unit: "litre", icon: "🥛" }
  }
};
