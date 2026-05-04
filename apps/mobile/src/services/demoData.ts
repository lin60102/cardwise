import type { CreditCardLike } from "@cardwise/shared";

export const DEMO_CARDS: CreditCardLike[] = [
  {
    id: "demo-csp",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 95,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Strong travel and dining starter card with transfer partners.",
    rewardCategories: [
      { id: "demo-csp-dining", category: "Dining", label: "restaurants", rate: 3 },
      { id: "demo-csp-travel", category: "Travel", label: "travel booked through Chase Travel", rate: 5 },
      { id: "demo-csp-hotels", category: "Hotels", label: "hotels booked through Chase Travel", rate: 5 },
      { id: "demo-csp-general", category: "General purchase", label: "all other purchases", rate: 1 }
    ],
    benefits: [{ id: "demo-csp-credit", title: "$50 annual hotel credit", annualValue: 50 }]
  },
  {
    id: "demo-csr",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 550,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Premium travel card with lounge access and annual travel credit.",
    rewardCategories: [
      { id: "demo-csr-dining", category: "Dining", label: "restaurants", rate: 3 },
      { id: "demo-csr-travel", category: "Travel", label: "general travel", rate: 3 },
      { id: "demo-csr-flights", category: "Flights", label: "flights booked through Chase Travel", rate: 5 },
      { id: "demo-csr-hotels", category: "Hotels", label: "hotels booked through Chase Travel", rate: 10 }
    ],
    benefits: [{ id: "demo-csr-credit", title: "$300 travel credit", annualValue: 300 }]
  },
  {
    id: "demo-cfu",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    notes: "No annual fee catch-all card with elevated dining and drugstore rewards.",
    rewardCategories: [
      { id: "demo-cfu-dining", category: "Dining", label: "restaurants", rate: 3 },
      { id: "demo-cfu-drugstores", category: "Drugstores", label: "drugstores", rate: 3 },
      { id: "demo-cfu-travel", category: "Travel", label: "travel booked through Chase Travel", rate: 5 }
    ],
    benefits: []
  },
  {
    id: "demo-cff",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "Rotating 5% categories require activation.",
    rewardCategories: [
      { id: "demo-cff-dining", category: "Dining", label: "restaurants", rate: 3 },
      { id: "demo-cff-amazon", category: "Amazon", label: "rotating Amazon bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { id: "demo-cff-drugstores", category: "Drugstores", label: "drugstores", rate: 3 }
    ],
    benefits: []
  },
  {
    id: "demo-amex-gold",
    name: "Amex Gold",
    issuer: "American Express",
    cardType: "personal",
    annualFee: 325,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Food-focused Membership Rewards card.",
    rewardCategories: [
      { id: "demo-gold-dining", category: "Dining", label: "restaurants", rate: 4 },
      { id: "demo-gold-groceries", category: "Groceries", label: "U.S. supermarkets", rate: 4, capAmount: 25000, capPeriod: "annual" },
      { id: "demo-gold-flights", category: "Flights", label: "flights booked direct or through Amex Travel", rate: 3 },
      { id: "demo-gold-delivery", category: "Delivery", label: "select dining delivery", rate: 4 }
    ],
    benefits: [
      { id: "demo-gold-dining-credit", title: "Dining credits", annualValue: 120 },
      { id: "demo-gold-uber", title: "Uber Cash credits", annualValue: 120 }
    ]
  },
  {
    id: "demo-amex-platinum",
    name: "Amex Platinum",
    issuer: "American Express",
    cardType: "personal",
    annualFee: 695,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Premium travel benefits card.",
    rewardCategories: [
      { id: "demo-plat-flights", category: "Flights", label: "flights booked direct or through Amex Travel", rate: 5 },
      { id: "demo-plat-hotels", category: "Hotels", label: "prepaid hotels booked through Amex Travel", rate: 5 }
    ],
    benefits: [
      { id: "demo-plat-airline", title: "Airline fee credit", annualValue: 200 },
      { id: "demo-plat-hotel", title: "Hotel credit", annualValue: 200 }
    ]
  },
  {
    id: "demo-bcp",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    cardType: "personal",
    annualFee: 95,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    notes: "Cashback card with strong U.S. supermarket and gas rewards.",
    rewardCategories: [
      { id: "demo-bcp-groceries", category: "Groceries", label: "U.S. supermarkets", rate: 6, capAmount: 6000, capPeriod: "annual" },
      { id: "demo-bcp-gas", category: "Gas", label: "U.S. gas stations", rate: 3 },
      { id: "demo-bcp-travel", category: "Travel", label: "transit", rate: 3 }
    ],
    benefits: [{ id: "demo-bcp-disney", title: "Disney Bundle credit", annualValue: 84 }]
  },
  {
    id: "demo-venture-x",
    name: "Capital One Venture X",
    issuer: "Capital One",
    cardType: "personal",
    annualFee: 395,
    rewardType: "miles",
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Premium travel card with high base earning.",
    rewardCategories: [
      { id: "demo-vx-hotels", category: "Hotels", label: "hotels through Capital One Travel", rate: 10 },
      { id: "demo-vx-flights", category: "Flights", label: "flights through Capital One Travel", rate: 5 },
      { id: "demo-vx-general", category: "General purchase", label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { id: "demo-vx-travel-credit", title: "$300 travel credit", annualValue: 300 },
      { id: "demo-vx-anniversary", title: "Anniversary miles", annualValue: 100 }
    ]
  },
  {
    id: "demo-custom-cash",
    name: "Citi Custom Cash",
    issuer: "Citi",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "Automatically earns 5% in the eligible top spend category each billing cycle.",
    rewardCategories: [
      { id: "demo-ccc-dining", category: "Dining", label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { id: "demo-ccc-groceries", category: "Groceries", label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { id: "demo-ccc-gas", category: "Gas", label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" }
    ],
    benefits: []
  },
  {
    id: "demo-discover",
    name: "Discover it Cash Back",
    issuer: "Discover",
    cardType: "personal",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Rotating 5% categories require activation and vary by quarter.",
    rewardCategories: [
      { id: "demo-discover-groceries", category: "Groceries", label: "rotating grocery bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { id: "demo-discover-gas", category: "Gas", label: "rotating gas bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { id: "demo-discover-target", category: "Target", label: "rotating Target bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" }
    ],
    benefits: [{ id: "demo-discover-match", title: "Cashback Match" }]
  },
  {
    id: "demo-ink-preferred",
    name: "Chase Ink Business Preferred",
    issuer: "Chase",
    cardType: "business",
    annualFee: 95,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Business travel card with elevated rewards on common business categories.",
    rewardCategories: [
      { id: "demo-ibp-travel", category: "Travel", label: "travel", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-ibp-shipping", category: "Shipping", label: "shipping purchases", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-ibp-phone", category: "Phone & internet", label: "internet, cable, and phone services", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-ibp-ads", category: "Advertising", label: "social media and search engine advertising", rate: 3, capAmount: 150000, capPeriod: "annual" }
    ],
    benefits: [{ id: "demo-ibp-phone-protection", title: "Cell phone protection" }]
  },
  {
    id: "demo-ink-cash",
    name: "Chase Ink Business Cash",
    issuer: "Chase",
    cardType: "business",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "No annual fee business cash back card for office supply, internet, cable, phone, gas, and dining spend.",
    rewardCategories: [
      { id: "demo-ibc-office", category: "Office supplies", label: "office supply stores", rate: 5, capAmount: 25000, capPeriod: "annual" },
      { id: "demo-ibc-phone", category: "Phone & internet", label: "internet, cable, and phone services", rate: 5, capAmount: 25000, capPeriod: "annual" },
      { id: "demo-ibc-gas", category: "Gas", label: "gas stations", rate: 2, capAmount: 25000, capPeriod: "annual" },
      { id: "demo-ibc-dining", category: "Dining", label: "restaurants", rate: 2, capAmount: 25000, capPeriod: "annual" }
    ],
    benefits: []
  },
  {
    id: "demo-ink-unlimited",
    name: "Chase Ink Business Unlimited",
    issuer: "Chase",
    cardType: "business",
    annualFee: 0,
    rewardType: "cashback",
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    notes: "Simple no annual fee business card with flat cash back on purchases.",
    rewardCategories: [{ id: "demo-ibu-general", category: "General purchase", label: "all purchases", rate: 1.5 }],
    benefits: []
  },
  {
    id: "demo-amex-bbp",
    name: "Amex Blue Business Plus",
    issuer: "American Express",
    cardType: "business",
    annualFee: 0,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    notes: "No annual fee business Membership Rewards card with elevated rewards on everyday business purchases.",
    rewardCategories: [
      { id: "demo-bbp-general", category: "General purchase", label: "everyday business purchases", rate: 2, capAmount: 50000, capPeriod: "annual" }
    ],
    benefits: []
  },
  {
    id: "demo-amex-business-gold",
    name: "Amex Business Gold",
    issuer: "American Express",
    cardType: "business",
    annualFee: 375,
    rewardType: "points",
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Business card that earns elevated rewards in the two eligible categories where the business spends the most each billing cycle.",
    rewardCategories: [
      { id: "demo-bizgold-gas", category: "Gas", label: "U.S. gas stations", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-bizgold-dining", category: "Dining", label: "U.S. restaurants", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-bizgold-ads", category: "Advertising", label: "U.S. media advertising", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-bizgold-shipping", category: "Shipping", label: "U.S. shipping providers", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { id: "demo-bizgold-software", category: "Software & cloud", label: "U.S. software and cloud providers", rate: 4, capAmount: 150000, capPeriod: "annual" }
    ],
    benefits: []
  },
  {
    id: "demo-venture-x-business",
    name: "Capital One Venture X Business",
    issuer: "Capital One",
    cardType: "business",
    annualFee: 395,
    rewardType: "miles",
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Premium business travel card with flat miles and travel portal bonuses.",
    rewardCategories: [
      { id: "demo-vxb-hotels", category: "Hotels", label: "hotels and rental cars through Capital One Travel", rate: 10 },
      { id: "demo-vxb-flights", category: "Flights", label: "flights through Capital One Travel", rate: 5 },
      { id: "demo-vxb-general", category: "General purchase", label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { id: "demo-vxb-travel-credit", title: "$300 travel credit", annualValue: 300 },
      { id: "demo-vxb-anniversary", title: "Anniversary miles", annualValue: 100 }
    ]
  },
  {
    id: "demo-spark-cash-plus",
    name: "Capital One Spark Cash Plus",
    issuer: "Capital One",
    cardType: "business",
    annualFee: 150,
    rewardType: "cashback",
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Business charge card with unlimited flat cash back and higher rewards through Capital One Travel.",
    rewardCategories: [
      { id: "demo-spark-hotels", category: "Hotels", label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { id: "demo-spark-general", category: "General purchase", label: "all other purchases", rate: 2 }
    ],
    benefits: []
  }
];
