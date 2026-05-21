import { PrismaClient, PurchaseCategory } from "@prisma/client";

const prisma = new PrismaClient();

const cards = [
  // ─── CHASE PERSONAL ──────────────────────────────────────────────────────────
  {
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Strong travel and dining starter card with transfer partners.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.DELIVERY, label: "select streaming and online grocery delivery", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "travel booked through Chase Travel", rate: 5 },
      { category: PurchaseCategory.HOTELS, label: "hotels booked through Chase Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$50 annual hotel credit", description: "Credit for hotel stays booked through Chase Travel.", annualValue: 50 }
    ]
  },
  {
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 550,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Premium travel card with lounge access and annual travel credit.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "general travel", rate: 3 },
      { category: PurchaseCategory.FLIGHTS, label: "flights booked through Chase Travel", rate: 5 },
      { category: PurchaseCategory.HOTELS, label: "hotels booked through Chase Travel", rate: 10 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$300 travel credit", description: "Annual travel statement credit.", annualValue: 300 }
    ]
  },
  {
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    notes: "No annual fee catch-all card with elevated dining and drugstore rewards.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.DRUGSTORES, label: "drugstores", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "travel booked through Chase Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1.5 }
    ],
    benefits: []
  },
  {
    name: "Chase Freedom Flex",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "Rotating 5% categories require activation and are represented as capped category examples.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.DRUGSTORES, label: "drugstores", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "travel booked through Chase Travel", rate: 5 },
      { category: PurchaseCategory.AMAZON, label: "rotating Amazon bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Chase World of Hyatt",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify exact Hyatt point earn rates and bonus category list before production
    notes: "Hotel co-brand card with strong earn at Hyatt properties. Points redeemable for free nights.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Hyatt properties", rate: 9 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.FLIGHTS, label: "airline tickets purchased directly with airlines", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Free night award", description: "One free night at a Category 1–4 Hyatt property annually.", annualValue: 150 }
    ]
  },
  {
    name: "Marriott Bonvoy Boundless",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    // TODO: verify current earn rates; Marriott & Chase sometimes update bonus tiers
    notes: "Marriott hotel co-brand with elevated earn at Marriott properties and everyday categories.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Marriott Bonvoy hotels", rate: 6 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 3, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 3, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "Free night award", description: "One free night (up to 35,000 points) annually.", annualValue: 140 }
    ]
  },
  {
    name: "United Explorer Card",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify bonus categories and earn rates with United/Chase current terms
    notes: "United Airlines co-brand card with miles on flights and everyday categories.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "United purchases", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.HOTELS, label: "hotel stays", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Free checked bag", description: "First checked bag free for cardholder and one companion.", annualValue: 140 },
      { title: "Two United Club passes", description: "Two one-time United Club airport lounge passes annually.", annualValue: 60 }
    ]
  },
  {
    name: "Southwest Rapid Rewards Plus",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 69,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: verify Southwest earn tiers; all Southwest purchases now earn 3x on some cards
    notes: "Entry-level Southwest co-brand card. Points count toward Companion Pass.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Southwest purchases", rate: 2 },
      { category: PurchaseCategory.TRAVEL, label: "hotel and car rental partners", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Anniversary bonus points", description: "3,000 bonus points each card anniversary year.", annualValue: 45 }
    ]
  },
  {
    name: "Southwest Rapid Rewards Priority",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 149,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: verify FTF; some sources list 0% on the Priority tier — confirm against current Chase terms
    notes: "Top-tier Southwest personal card. Includes $75 Southwest annual travel credit and four upgraded boardings/year.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Southwest purchases", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "local transit, commuting, and rideshare", rate: 2 },
      { category: PurchaseCategory.PHONE_INTERNET, label: "internet, cable, phone", rate: 2 },
      { category: PurchaseCategory.DELIVERY, label: "select streaming services", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$75 Southwest travel credit", description: "Annual statement credit toward Southwest purchases.", annualValue: 75 },
      { title: "Anniversary bonus points", description: "7,500 bonus points each anniversary year.", annualValue: 110 }
    ]
  },
  {
    name: "Amazon Prime Visa",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: confirm whether Prime membership requirement should be modeled as a benefit or note
    notes: "Chase-issued Amazon co-brand. Requires an active Amazon Prime membership for the elevated 5% rate.",
    rewardCategories: [
      { category: PurchaseCategory.AMAZON, label: "Amazon.com, Whole Foods, and Amazon Fresh", rate: 5 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 2 },
      { category: PurchaseCategory.DRUGSTORES, label: "drugstores", rate: 2 },
      { category: PurchaseCategory.TRAVEL, label: "local transit and commuting", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "IHG One Rewards Premier",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 99,
    rewardType: "points" as const,
    baseRewardRate: 3,
    foreignTransactionFee: 0,
    notes: "IHG hotel co-brand with very high at-property earn and an anniversary free-night certificate.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "IHG hotels and resorts", rate: 10 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 5 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 5 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 5 },
      { category: PurchaseCategory.DELIVERY, label: "select streaming services", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 3 }
    ],
    benefits: [
      { title: "Anniversary free night", description: "One free night at IHG properties (up to 40,000 points) annually.", annualValue: 200 },
      { title: "IHG Platinum Elite status", description: "Complimentary Platinum Elite status while card is active.", annualValue: null }
    ]
  },
  {
    name: "IHG One Rewards Traveler",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "No annual fee IHG co-brand. Lower earn ceiling than the Premier but no fee.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "IHG hotels and resorts", rate: 5 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 3 },
      { category: PurchaseCategory.PHONE_INTERNET, label: "monthly bill payments (utilities, internet, cable, phone)", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: []
  },
  {
    name: "Aeroplan Card",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: confirm current Aeroplan earn structure; benefits sometimes change with each Air Canada cycle
    notes: "Air Canada Aeroplan co-brand. Best for transferable points enthusiasts who value Star Alliance redemptions.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Air Canada purchases", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Free first checked bag", description: "Free first checked bag on Air Canada flights.", annualValue: 70 },
      { title: "Aeroplan 25K Status", description: "Complimentary Aeroplan 25K status while card is active.", annualValue: null }
    ]
  },
  {
    name: "United Quest Card",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 250,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Mid-premium United co-brand. Strong everyday categories plus annual United purchase credit and award flight rebates.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "United purchases", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "all other travel", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants (incl. eligible delivery)", rate: 2 },
      { category: PurchaseCategory.DELIVERY, label: "select streaming services", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$125 United purchase credit", description: "Annual statement credit toward United purchases.", annualValue: 125 },
      { title: "Two free checked bags", description: "First and second checked bags free for cardholder and a companion.", annualValue: 280 },
      { title: "Award flight rebate", description: "Up to 10,000 miles rebated per year on award redemptions (twice per year).", annualValue: null }
    ]
  },
  {
    name: "United Club Infinite Card",
    issuer: "Chase",
    cardType: "personal" as const,
    annualFee: 525,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Top-tier United personal card. Headline benefit is United Club membership for two travelers.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "United purchases", rate: 4 },
      { category: PurchaseCategory.TRAVEL, label: "all other travel", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "United Club membership", description: "Complimentary United Club airport lounge membership.", annualValue: 650 },
      { title: "Two free checked bags", description: "First and second checked bags free for cardholder and a companion.", annualValue: 280 },
      { title: "Global Entry or TSA PreCheck credit", description: "Up to $120 application fee credit every 4 years.", annualValue: 30 }
    ]
  },

  // ─── AMERICAN EXPRESS PERSONAL ───────────────────────────────────────────────
  {
    name: "Amex Gold",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 325,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Food-focused Membership Rewards card with dining and grocery credits.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 4 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 4, capAmount: 25000, capPeriod: "annual" },
      { category: PurchaseCategory.FLIGHTS, label: "flights booked direct or through Amex Travel", rate: 3 },
      { category: PurchaseCategory.DELIVERY, label: "select dining delivery", rate: 4 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Dining credits", description: "Selected annual dining-related credits.", annualValue: 120 },
      { title: "Uber Cash credits", description: "Selected U.S. Uber and Uber Eats credits.", annualValue: 120 }
    ]
  },
  {
    name: "Amex Platinum",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 695,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Premium travel benefits card with strong flight and prepaid hotel earn rates.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "flights booked direct or through Amex Travel", rate: 5 },
      { category: PurchaseCategory.HOTELS, label: "prepaid hotels booked through Amex Travel", rate: 5 },
      { category: PurchaseCategory.TRAVEL, label: "eligible travel", rate: 1 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Airline fee credit", description: "Selected airline incidental statement credit.", annualValue: 200 },
      { title: "Hotel credit", description: "Prepaid Fine Hotels + Resorts or Hotel Collection credit.", annualValue: 200 },
      { title: "Digital entertainment credit", description: "Selected entertainment services.", annualValue: 240 }
    ]
  },
  {
    name: "Blue Cash Preferred",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    notes: "Cashback card with strong U.S. supermarket and gas rewards.",
    rewardCategories: [
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 6, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GAS, label: "U.S. gas stations", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "transit", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Disney Bundle credit", description: "Statement credit for eligible Disney Bundle subscriptions.", annualValue: 84 }
    ]
  },
  {
    name: "Blue Cash Everyday",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    // TODO: verify current gas and streaming cap amounts; Amex has updated terms periodically
    notes: "No annual fee cashback card with elevated grocery, gas, and streaming rewards.",
    rewardCategories: [
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 3, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GAS, label: "U.S. gas stations", rate: 3, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Hilton Honors American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 3,
    foreignTransactionFee: 0,
    // TODO: verify current Hilton point earn tiers at hotels vs. other categories
    notes: "No annual fee Hilton co-brand card. Points redeemable for free nights at Hilton properties.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Hilton portfolio hotels", rate: 7 },
      { category: PurchaseCategory.DINING, label: "U.S. restaurants", rate: 5 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 5 },
      { category: PurchaseCategory.GAS, label: "U.S. gas stations", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 3 }
    ],
    benefits: []
  },
  {
    name: "Hilton Honors American Express Surpass Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 150,
    rewardType: "points" as const,
    baseRewardRate: 3,
    foreignTransactionFee: 0,
    // TODO: verify earn tiers; Amex/Hilton periodically revise bonus categories
    notes: "Mid-tier Hilton co-brand card with enhanced earning and complimentary Gold status.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Hilton portfolio hotels", rate: 12 },
      { category: PurchaseCategory.DINING, label: "U.S. restaurants", rate: 6 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 6 },
      { category: PurchaseCategory.GAS, label: "U.S. gas stations", rate: 6 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 3 }
    ],
    benefits: [
      { title: "Free weekend night reward", description: "Earn a free night reward after spending $15,000 in a calendar year.", annualValue: null },
      { title: "Hilton Gold status", description: "Complimentary Hilton Honors Gold elite status.", annualValue: null }
    ]
  },
  {
    name: "Delta SkyMiles Gold American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 150,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify current annual fee ($150 as of 2024 refresh; was $99); confirm bonus categories
    notes: "Mid-tier Delta co-brand card with miles on Delta, dining, and U.S. supermarkets.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Delta purchases", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants worldwide", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "First checked bag free", description: "Free first checked bag for cardholder and up to 8 companions on the same reservation.", annualValue: 140 },
      { title: "$200 Delta flight credit", description: "Statement credit after spending $10,000 in a calendar year.", annualValue: null }
    ]
  },
  {
    name: "Marriott Bonvoy Brilliant American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 650,
    rewardType: "points" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    // TODO: verify current annual fee and credits after 2024 card refresh
    notes: "Premium Marriott co-brand card with high hotel earn, dining rewards, and lounge access.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Marriott Bonvoy hotels", rate: 6 },
      { category: PurchaseCategory.DINING, label: "restaurants worldwide", rate: 3 },
      { category: PurchaseCategory.FLIGHTS, label: "flights booked directly with airlines", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "Free night award", description: "Annual free night award (up to 85,000 points).", annualValue: 300 },
      { title: "Marriott Brilliant dining credit", description: "Up to $300 in dining credits per year (up to $25/month).", annualValue: 300 },
      { title: "Marriott Platinum Elite status", description: "Complimentary Marriott Bonvoy Platinum Elite status.", annualValue: null }
    ]
  },
  {
    name: "American Express Green Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 150,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify the LoungeBuddy credit status — the underlying service has been retired/restructured
    notes: "Mid-tier Membership Rewards card with broad 3x earn across travel, transit, and dining worldwide.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants worldwide (incl. takeout/delivery in the U.S.)", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "travel and transit worldwide", rate: 3 },
      { category: PurchaseCategory.HOTELS, label: "hotels and vacation rentals", rate: 3 },
      { category: PurchaseCategory.FLIGHTS, label: "flights, cruises, and rail", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "CLEAR Plus credit", description: "Annual statement credit toward CLEAR Plus membership.", annualValue: 189 }
    ]
  },
  {
    name: "American Express Platinum Card from Charles Schwab",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 695,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify current Schwab redemption rate (historically 1.1¢ per MR point into a Schwab brokerage account)
    notes: "Co-branded with Charles Schwab. Same earn as the consumer Platinum but Membership Rewards can be cashed out at an elevated rate into a linked Schwab brokerage account.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "flights booked direct or through Amex Travel", rate: 5 },
      { category: PurchaseCategory.HOTELS, label: "prepaid hotels booked through Amex Travel", rate: 5 },
      { category: PurchaseCategory.TRAVEL, label: "eligible travel", rate: 1 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Schwab brokerage cash-out", description: "Redeem Membership Rewards points into a Schwab brokerage account at an elevated rate.", annualValue: null },
      { title: "Airline fee credit", description: "Selected airline incidental statement credit.", annualValue: 200 },
      { title: "Hotel credit", description: "Prepaid Fine Hotels + Resorts or Hotel Collection credit.", annualValue: 200 }
    ]
  },
  {
    name: "Delta SkyMiles Platinum American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 350,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Mid-tier Delta card. Annual companion certificate (domestic main cabin) is the headline value.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Delta purchases", rate: 3 },
      { category: PurchaseCategory.HOTELS, label: "hotels purchased directly with the hotel", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants worldwide", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Annual companion certificate", description: "Domestic main cabin round-trip companion certificate each anniversary (taxes/fees due).", annualValue: 250 },
      { title: "First checked bag free", description: "Free first checked bag for cardholder and up to 8 companions.", annualValue: 140 }
    ]
  },
  {
    name: "Delta SkyMiles Reserve American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 650,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: confirm Sky Club access terms — Delta restricted lounge access for cardholders in 2024
    notes: "Premium Delta co-brand. Delta Sky Club access (with current visit caps) and an annual companion certificate.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Delta purchases", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Delta Sky Club access", description: "Complimentary Sky Club access when flying Delta (subject to visit caps).", annualValue: 600 },
      { title: "Annual companion certificate", description: "Round-trip companion certificate each anniversary.", annualValue: 400 },
      { title: "First checked bag free", description: "Free first checked bag for cardholder and up to 8 companions.", annualValue: 140 }
    ]
  },
  {
    name: "Hilton Honors Aspire Card from American Express",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 550,
    rewardType: "points" as const,
    baseRewardRate: 3,
    foreignTransactionFee: 0,
    notes: "Top-tier Hilton co-brand. Diamond status, multiple statement credits, and the highest at-property earn rate.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Hilton portfolio hotels", rate: 14 },
      { category: PurchaseCategory.DINING, label: "U.S. restaurants and worldwide takeout/delivery", rate: 7 },
      { category: PurchaseCategory.FLIGHTS, label: "flights booked directly with airlines or via Amex Travel", rate: 7 },
      { category: PurchaseCategory.TRAVEL, label: "car rentals booked directly", rate: 7 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 3 }
    ],
    benefits: [
      { title: "Annual free night reward", description: "One free weekend night at a Hilton property each anniversary.", annualValue: 400 },
      { title: "Hilton resort credit", description: "Up to $400 in Hilton resort statement credits per year ($200 semi-annually).", annualValue: 400 },
      { title: "$200 flight credit", description: "Up to $200 in flight credits ($50 quarterly).", annualValue: 200 },
      { title: "CLEAR Plus credit", description: "Annual statement credit toward CLEAR Plus membership.", annualValue: 189 },
      { title: "Hilton Diamond status", description: "Complimentary Hilton Honors Diamond elite status.", annualValue: null }
    ]
  },
  {
    name: "Marriott Bonvoy Bevy American Express Card",
    issuer: "American Express",
    cardType: "personal" as const,
    annualFee: 250,
    rewardType: "points" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    // TODO: confirm current annual fee — Marriott Bonvoy Bevy has had several pricing iterations
    notes: "Mid-tier Marriott Bonvoy card. Elevated dining and grocery earn alongside Marriott property earn.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Marriott Bonvoy hotels", rate: 6 },
      { category: PurchaseCategory.DINING, label: "restaurants worldwide", rate: 4 },
      { category: PurchaseCategory.GROCERIES, label: "U.S. supermarkets", rate: 4 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "Marriott Gold Elite status", description: "Complimentary Marriott Bonvoy Gold Elite status.", annualValue: null },
      { title: "1,000 bonus points per stay", description: "Earn 1,000 bonus points on each paid stay at Marriott Bonvoy properties.", annualValue: null }
    ]
  },

  // ─── CAPITAL ONE PERSONAL ────────────────────────────────────────────────────
  {
    name: "Capital One Venture X",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 395,
    rewardType: "miles" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Premium travel card with high base earning and travel portal bonuses.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 10 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.TRAVEL, label: "travel through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "$300 travel credit", description: "Annual credit for bookings through Capital One Travel.", annualValue: 300 },
      { title: "Anniversary miles", description: "Annual bonus miles after account anniversary.", annualValue: 100 }
    ]
  },
  {
    name: "Capital One Venture",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "miles" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Mid-tier travel card with flat 2x miles on all purchases and elevated portal earn.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "Global Entry or TSA PreCheck credit", description: "Application fee credit up to $120 every 4 years.", annualValue: 30 }
    ]
  },
  {
    name: "Capital One Quicksilver",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 0,
    notes: "No annual fee flat-rate cashback card with no foreign transaction fee.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1.5 }
    ],
    benefits: []
  },
  {
    name: "Capital One SavorOne",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify streaming bonus categories; Capital One periodically revises eligible services
    notes: "No annual fee card with strong dining, entertainment, grocery, and streaming rewards.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores (excluding superstores)", rate: 3 },
      { category: PurchaseCategory.DELIVERY, label: "popular streaming services", rate: 3 },
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Capital One VentureOne",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "miles" as const,
    baseRewardRate: 1.25,
    foreignTransactionFee: 0,
    notes: "Entry-level travel miles card. 1.25x miles on everything with no annual fee or foreign transaction fee.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1.25 }
    ],
    benefits: []
  },
  {
    name: "Capital One Savor",
    issuer: "Capital One",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: Capital One renamed SavorOne to "Savor" with $0 AF in late 2024; the legacy $95-AF Savor is closed to new applicants.
    // Modeled here as the historical $95 AF product because that is what the points-and-miles community references.
    notes: "Historical $95 AF version of the Capital One Savor. Higher dining/entertainment earn than SavorOne but with an annual fee.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 4 },
      { category: PurchaseCategory.DELIVERY, label: "entertainment and popular streaming services", rate: 4 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores (excluding superstores)", rate: 3 },
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },

  // ─── CITI PERSONAL ───────────────────────────────────────────────────────────
  {
    name: "Citi Custom Cash",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "Automatically earns 5% in the eligible top spend category each billing cycle.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { category: PurchaseCategory.GROCERIES, label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { category: PurchaseCategory.GAS, label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { category: PurchaseCategory.TRAVEL, label: "top eligible category", rate: 5, capAmount: 500, capPeriod: "monthly" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Citi Double Cash",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 3,
    notes: "Effectively 2% cashback on all purchases (1% when you buy + 1% when you pay). Simple and strong.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 2 }
    ],
    benefits: []
  },
  {
    name: "Citi Strata Premier",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: verify current bonus category list after 2024 rebrand from Citi Premier; confirm 3x on EV charging
    notes: "Formerly Citi Premier. Travel and everyday rewards card with wide 3x bonus categories.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "air travel", rate: 3 },
      { category: PurchaseCategory.HOTELS, label: "hotels", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 3 },
      { category: PurchaseCategory.GAS, label: "gas stations and EV charging", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$100 annual hotel benefit", description: "Save $100 on a single hotel stay of $500+ booked through thankyou.com once per year.", annualValue: 100 }
    ]
  },
  {
    name: "Citi Rewards+",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "Unique rounding feature: all purchases round up to nearest 10 ThankYou Points. Strong at gas and groceries.",
    rewardCategories: [
      { category: PurchaseCategory.GROCERIES, label: "supermarkets", rate: 2, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 2, capAmount: 6000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Costco Anywhere Visa by Citi",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: rewards are issued once annually as a Costco certificate, not statement credit — confirm if app needs to surface this constraint
    notes: "Costco's exclusive credit card. Requires an active Costco membership. Rewards are paid out annually as a Costco certificate.",
    rewardCategories: [
      { category: PurchaseCategory.GAS, label: "gas and EV charging worldwide (incl. Costco gas)", rate: 4, capAmount: 7000, capPeriod: "annual" },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "eligible travel purchases (incl. Costco Travel)", rate: 3 },
      { category: PurchaseCategory.COSTCO, label: "Costco and Costco.com purchases", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Citi AAdvantage Platinum Select World Elite Mastercard",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 99,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Entry American Airlines co-brand. Annual fee waived first year. Includes free first checked bag and preferred boarding.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "American Airlines purchases", rate: 2 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Free first checked bag", description: "Free first checked bag on domestic American Airlines flights.", annualValue: 70 },
      { title: "Preferred boarding", description: "Group 5 boarding on American Airlines flights.", annualValue: null }
    ]
  },
  {
    name: "Citi AAdvantage Executive World Elite Mastercard",
    issuer: "Citi",
    cardType: "personal" as const,
    annualFee: 595,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: 2024 refresh changed earn structure; confirm whether 4x AA still applies and any added bonus categories
    notes: "Premium American Airlines co-brand. Headline benefit is Admirals Club membership for the primary cardholder.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "American Airlines purchases", rate: 4 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Admirals Club membership", description: "Full Admirals Club membership for the primary cardholder.", annualValue: 850 },
      { title: "Global Entry or TSA PreCheck credit", description: "Up to $120 application fee credit every 4 years.", annualValue: 30 }
    ]
  },

  // ─── WELLS FARGO PERSONAL ────────────────────────────────────────────────────
  {
    name: "Wells Fargo Active Cash",
    issuer: "Wells Fargo",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 3,
    notes: "Unlimited 2% cashback on all purchases with no annual fee.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 2 }
    ],
    benefits: [
      { title: "$200 cash rewards welcome bonus", description: "After meeting minimum spend requirement.", annualValue: null }
    ]
  },
  {
    name: "Wells Fargo Autograph",
    issuer: "Wells Fargo",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify full list of qualifying travel/transit merchants
    notes: "No annual fee card with broad 3x categories covering travel, dining, gas, and phone.",
    rewardCategories: [
      { category: PurchaseCategory.TRAVEL, label: "restaurants, travel, transit, and streaming", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GAS, label: "gas stations and EV charging", rate: 3 },
      { category: PurchaseCategory.PHONE_INTERNET, label: "phone plans", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Wells Fargo Autograph Journey",
    issuer: "Wells Fargo",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify earn tiers; Wells Fargo updated this card after initial launch
    notes: "Premium travel card with elevated hotel and airline earn and transfer partners.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels", rate: 5 },
      { category: PurchaseCategory.FLIGHTS, label: "airline tickets", rate: 4 },
      { category: PurchaseCategory.TRAVEL, label: "other travel", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$50 annual airline credit", description: "Statement credit for airline incidental purchases.", annualValue: 50 }
    ]
  },
  {
    name: "Bilt Mastercard",
    issuer: "Wells Fargo",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: cardholder must make 5 transactions per statement cycle for any points to post — represent this rule in product copy
    // TODO: 1x rent earn capped at 100,000 points/year; modeled here as GENERAL_PURCHASE (no RENT category in schema)
    notes: "The points-and-miles favorite for renters. Earns transferable Bilt Points on rent (no transaction fee) with strong dining and travel categories.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.TRAVEL, label: "travel booked through Bilt", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "rent payments and all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Rent Day double points", description: "Earn double points (excluding rent) on the 1st of each month, up to 10,000 bonus points.", annualValue: null },
      { title: "No-fee rent payments", description: "Pay rent by card with no transaction fee.", annualValue: null }
    ]
  },

  // ─── DISCOVER PERSONAL ───────────────────────────────────────────────────────
  {
    name: "Discover it Cash Back",
    issuer: "Discover",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Rotating 5% categories require activation and vary by quarter.",
    rewardCategories: [
      { category: PurchaseCategory.GROCERIES, label: "rotating grocery bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GAS, label: "rotating gas bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { category: PurchaseCategory.AMAZON, label: "rotating Amazon bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { category: PurchaseCategory.TARGET, label: "rotating Target bonus category", rate: 5, capAmount: 1500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Cashback Match", description: "Discover matches cash back earned at the end of the first year for new cardmembers.", annualValue: null }
    ]
  },
  {
    name: "Discover it Miles",
    issuer: "Discover",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "miles" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 0,
    notes: "Flat 1.5x miles on every purchase. Discover matches all miles earned at end of first year.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 1.5 }
    ],
    benefits: [
      { title: "Miles Match", description: "Discover matches all miles earned at end of first year for new cardmembers.", annualValue: null }
    ]
  },

  // ─── BANK OF AMERICA PERSONAL ────────────────────────────────────────────────
  {
    name: "Bank of America Customized Cash Rewards",
    issuer: "Bank of America",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: chosen 3% category is user-selected monthly (gas, online shopping, dining, travel, drug, home improvement)
    // Modeled here with the most common choice categories; actual flexibility depends on user selection
    notes: "3% in a chosen category (monthly choice), 2% at grocery stores and wholesale clubs, 1% other. Cap applies to 2%+3% combined.",
    rewardCategories: [
      { category: PurchaseCategory.DINING, label: "chosen category (dining example)", rate: 3, capAmount: 2500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GAS, label: "chosen category (gas example)", rate: 3, capAmount: 2500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores and wholesale clubs", rate: 2, capAmount: 2500, capPeriod: "quarterly" },
      { category: PurchaseCategory.DRUGSTORES, label: "drug stores", rate: 3, capAmount: 2500, capPeriod: "quarterly" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Bank of America Unlimited Cash Rewards",
    issuer: "Bank of America",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    notes: "Simple unlimited 1.5% cashback. Preferred Rewards members earn up to 2.625% (TODO: verify tier amounts).",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 1.5 }
    ],
    benefits: []
  },
  {
    name: "Bank of America Travel Rewards",
    issuer: "Bank of America",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 0,
    notes: "No annual fee travel card with flat 1.5x on everything and no foreign transaction fee.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 1.5 }
    ],
    benefits: []
  },
  {
    name: "Bank of America Premium Rewards",
    issuer: "Bank of America",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 0,
    // TODO: verify whether Preferred Rewards boost applies to base or only to bonus categories
    notes: "Travel and dining focused card. Preferred Rewards members can earn up to 3.5x on travel/dining.",
    rewardCategories: [
      { category: PurchaseCategory.TRAVEL, label: "travel and dining purchases", rate: 2 },
      { category: PurchaseCategory.DINING, label: "dining", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1.5 }
    ],
    benefits: [
      { title: "$100 airline incidental credit", description: "Annual credit for airline incidental fees.", annualValue: 100 },
      { title: "Global Entry or TSA PreCheck credit", description: "Up to $100 application fee credit.", annualValue: 25 }
    ]
  },
  {
    name: "Alaska Airlines Visa Signature",
    issuer: "Bank of America",
    cardType: "personal" as const,
    annualFee: 95,
    rewardType: "miles" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Alaska Airlines co-brand. Famous for the Alaska Companion Fare each anniversary year.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "Alaska Airlines purchases", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 2 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Alaska Companion Fare", description: "Annual Companion Fare from $122 ($99 fare + taxes/fees from $23) after meeting the spend requirement.", annualValue: 250 },
      { title: "Free first checked bag", description: "Free first checked bag for cardholder and up to 6 companions on the same reservation.", annualValue: 60 }
    ]
  },

  // ─── U.S. BANK PERSONAL ──────────────────────────────────────────────────────
  {
    name: "U.S. Bank Altitude Connect Visa",
    issuer: "U.S. Bank",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: annual fee structure has varied; confirm $0 vs $95 waived first year
    notes: "Travel and everyday rewards card. Strong earn on travel, gas, and streaming.",
    rewardCategories: [
      { category: PurchaseCategory.TRAVEL, label: "travel purchases", rate: 4 },
      { category: PurchaseCategory.GAS, label: "gas stations and EV charging", rate: 4 },
      { category: PurchaseCategory.DELIVERY, label: "streaming services", rate: 4 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Global Entry or TSA PreCheck credit", description: "Application fee credit every four years.", annualValue: 25 }
    ]
  },
  {
    name: "U.S. Bank Cash+ Visa",
    issuer: "U.S. Bank",
    cardType: "personal" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: user selects two 5% categories and one 2% category each quarter from a defined list
    // Modeled here with representative categories; actual selection varies by user
    notes: "Cardholder selects two 5% categories (capped at $2,000/quarter combined) and one 2% everyday category each quarter.",
    rewardCategories: [
      { category: PurchaseCategory.PHONE_INTERNET, label: "selected 5% category (TV/internet/phone example)", rate: 5, capAmount: 2000, capPeriod: "quarterly" },
      { category: PurchaseCategory.DINING, label: "selected 5% category (fast food/restaurants example)", rate: 5, capAmount: 2000, capPeriod: "quarterly" },
      { category: PurchaseCategory.GROCERIES, label: "selected 2% everyday category (grocery example)", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "U.S. Bank Altitude Reserve Visa",
    issuer: "U.S. Bank",
    cardType: "personal" as const,
    annualFee: 400,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify that mobile wallet payments still qualify for 3x at all merchants
    notes: "Premium travel card that earns 3x on travel and mobile wallet purchases. Points worth 1.5 cents toward travel.",
    rewardCategories: [
      { category: PurchaseCategory.TRAVEL, label: "travel and mobile wallet purchases", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$325 annual travel credit", description: "Automatic statement credit for eligible travel and dining purchases.", annualValue: 325 },
      { title: "Priority Pass membership", description: "Complimentary Priority Pass Select membership for airport lounge access.", annualValue: null }
    ]
  },

  // ─── BARCLAYS PERSONAL ───────────────────────────────────────────────────────
  {
    name: "JetBlue Plus Card",
    issuer: "Barclays",
    cardType: "personal" as const,
    annualFee: 99,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: verify current JetBlue earn rates; Barclays/JetBlue have refreshed terms recently
    notes: "JetBlue airline co-brand card with strong earn on JetBlue flights and everyday categories.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "JetBlue purchases", rate: 6 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores", rate: 2 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Annual bonus points", description: "5,000 bonus points each account anniversary.", annualValue: 70 },
      { title: "10% points rebate", description: "10% of points back when redeeming for JetBlue flights.", annualValue: null }
    ]
  },
  {
    name: "Wyndham Rewards Earner Plus Card",
    issuer: "Barclays",
    cardType: "personal" as const,
    annualFee: 75,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    // TODO: confirm 0% FTF — some Barclays Wyndham products historically charged FTF
    notes: "Mid-tier Wyndham co-brand. Strong earn at Wyndham hotels and gas stations plus automatic Diamond status.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "Wyndham hotels and resorts", rate: 6 },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 6 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 4 },
      { category: PurchaseCategory.GROCERIES, label: "grocery stores (excluding superstores)", rate: 4 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Anniversary bonus points", description: "7,500 bonus Wyndham Rewards points each account anniversary.", annualValue: null },
      { title: "Wyndham Diamond status", description: "Automatic Wyndham Rewards Diamond status while card is active.", annualValue: null }
    ]
  },

  // ─── CHASE BUSINESS ──────────────────────────────────────────────────────────
  {
    name: "Chase Ink Business Preferred",
    issuer: "Chase",
    cardType: "business" as const,
    annualFee: 95,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Business travel card with elevated rewards on common business categories.",
    rewardCategories: [
      { category: PurchaseCategory.TRAVEL, label: "travel", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.SHIPPING, label: "shipping purchases", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.PHONE_INTERNET, label: "internet, cable, and phone services", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.ADVERTISING, label: "advertising purchases with social media and search engines", rate: 3, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Cell phone protection", description: "Coverage may apply when the monthly bill is paid with the card.", annualValue: null }
    ]
  },
  {
    name: "Chase Ink Business Cash",
    issuer: "Chase",
    cardType: "business" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    notes: "No annual fee business cash back card for office supply, internet, cable, phone, gas, and dining spend.",
    rewardCategories: [
      { category: PurchaseCategory.OFFICE_SUPPLIES, label: "office supply stores", rate: 5, capAmount: 25000, capPeriod: "annual" },
      { category: PurchaseCategory.PHONE_INTERNET, label: "internet, cable, and phone services", rate: 5, capAmount: 25000, capPeriod: "annual" },
      { category: PurchaseCategory.GAS, label: "gas stations", rate: 2, capAmount: 25000, capPeriod: "annual" },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 2, capAmount: 25000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Chase Ink Business Unlimited",
    issuer: "Chase",
    cardType: "business" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1.5,
    foreignTransactionFee: 3,
    notes: "Simple no annual fee business card with flat cash back on purchases.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all purchases", rate: 1.5 }
    ],
    benefits: []
  },
  {
    name: "Chase Ink Business Premier",
    issuer: "Chase",
    cardType: "business" as const,
    annualFee: 195,
    rewardType: "cashback" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Pay-in-full business card with higher rewards on large purchases.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "purchases of $5,000 or more", rate: 2.5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: []
  },

  // ─── AMERICAN EXPRESS BUSINESS ───────────────────────────────────────────────
  {
    name: "Amex Blue Business Plus",
    issuer: "American Express",
    cardType: "business" as const,
    annualFee: 0,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    notes: "No annual fee business Membership Rewards card with elevated rewards on everyday business purchases.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "everyday business purchases", rate: 2, capAmount: 50000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Amex Blue Business Cash",
    issuer: "American Express",
    cardType: "business" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 2.7,
    notes: "No annual fee flat-rate business cashback card. 2% on all purchases up to $50,000/year.",
    rewardCategories: [
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all eligible purchases", rate: 2, capAmount: 50000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "purchases above annual cap", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Amex Business Gold",
    issuer: "American Express",
    cardType: "business" as const,
    annualFee: 375,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Business card that earns elevated rewards in the two eligible categories where the business spends the most each billing cycle.",
    rewardCategories: [
      { category: PurchaseCategory.GAS, label: "U.S. gas stations", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.DINING, label: "U.S. restaurants", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.TRAVEL, label: "transit and select travel categories", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.ADVERTISING, label: "U.S. media advertising", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.SHIPPING, label: "U.S. shipping providers", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.SOFTWARE_CLOUD, label: "U.S. software and cloud providers", rate: 4, capAmount: 150000, capPeriod: "annual" },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: []
  },
  {
    name: "Amex Business Platinum",
    issuer: "American Express",
    cardType: "business" as const,
    annualFee: 895,
    rewardType: "points" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 0,
    notes: "Premium business travel card with airport lounge access and travel-focused benefits.",
    rewardCategories: [
      { category: PurchaseCategory.FLIGHTS, label: "flights and prepaid hotels booked through Amex Travel", rate: 5 },
      { category: PurchaseCategory.HOTELS, label: "prepaid hotels booked through Amex Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "large eligible purchases", rate: 1.5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "Global Entry or TSA PreCheck credit", description: "Application fee credit every four years when eligible.", annualValue: null }
    ]
  },

  // ─── CAPITAL ONE BUSINESS ────────────────────────────────────────────────────
  {
    name: "Capital One Venture X Business",
    issuer: "Capital One",
    cardType: "business" as const,
    annualFee: 395,
    rewardType: "miles" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Premium business travel card with flat miles and travel portal bonuses.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 10 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.TRAVEL, label: "travel through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "$300 travel credit", description: "Annual credit for bookings through Capital One Travel.", annualValue: 300 },
      { title: "Anniversary miles", description: "Annual bonus miles after account anniversary.", annualValue: 100 }
    ]
  },
  {
    name: "Capital One Spark Miles for Business",
    issuer: "Capital One",
    cardType: "business" as const,
    annualFee: 95,
    rewardType: "miles" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    // TODO: verify first-year annual fee waiver status
    notes: "Flat 2x miles on all business purchases. Strong portal earn for travel.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.FLIGHTS, label: "flights through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: [
      { title: "Global Entry or TSA PreCheck credit", description: "Application fee credit up to $120 every 4 years.", annualValue: 30 }
    ]
  },
  {
    name: "Capital One Spark Cash Plus",
    issuer: "Capital One",
    cardType: "business" as const,
    annualFee: 150,
    rewardType: "cashback" as const,
    baseRewardRate: 2,
    foreignTransactionFee: 0,
    notes: "Business charge card with unlimited flat cash back and higher rewards through Capital One Travel.",
    rewardCategories: [
      { category: PurchaseCategory.HOTELS, label: "hotels and rental cars through Capital One Travel", rate: 5 },
      { category: PurchaseCategory.TRAVEL, label: "Capital One Travel purchases", rate: 5 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 2 }
    ],
    benefits: []
  },

  // ─── U.S. BANK BUSINESS ──────────────────────────────────────────────────────
  {
    name: "U.S. Bank Business Triple Cash Rewards Visa",
    issuer: "U.S. Bank",
    cardType: "business" as const,
    annualFee: 0,
    rewardType: "cashback" as const,
    baseRewardRate: 1,
    foreignTransactionFee: 3,
    // TODO: verify cap structure on 3% categories; some sources indicate no cap — confirm before production
    notes: "No annual fee business cashback card with 3% on common business expense categories.",
    rewardCategories: [
      { category: PurchaseCategory.GAS, label: "gas stations and EV charging", rate: 3 },
      { category: PurchaseCategory.OFFICE_SUPPLIES, label: "office supply stores", rate: 3 },
      { category: PurchaseCategory.PHONE_INTERNET, label: "cell phone/service providers", rate: 3 },
      { category: PurchaseCategory.DINING, label: "restaurants", rate: 3 },
      { category: PurchaseCategory.SOFTWARE_CLOUD, label: "eligible software-as-a-service purchases", rate: 3 },
      { category: PurchaseCategory.GENERAL_PURCHASE, label: "all other purchases", rate: 1 }
    ],
    benefits: [
      { title: "$100 annual software credit", description: "Annual statement credit for select software subscriptions.", annualValue: 100 }
    ]
  }
];

async function main() {
  for (const seedCard of cards) {
    const card = await prisma.creditCard.upsert({
      where: { name: seedCard.name },
      update: {
        issuer: seedCard.issuer,
        cardType: seedCard.cardType,
        annualFee: seedCard.annualFee,
        rewardType: seedCard.rewardType,
        baseRewardRate: seedCard.baseRewardRate,
        foreignTransactionFee: seedCard.foreignTransactionFee,
        notes: seedCard.notes
      },
      create: {
        name: seedCard.name,
        issuer: seedCard.issuer,
        cardType: seedCard.cardType,
        annualFee: seedCard.annualFee,
        rewardType: seedCard.rewardType,
        baseRewardRate: seedCard.baseRewardRate,
        foreignTransactionFee: seedCard.foreignTransactionFee,
        notes: seedCard.notes
      }
    });

    await prisma.rewardCategory.deleteMany({ where: { cardId: card.id } });
    await prisma.cardBenefit.deleteMany({ where: { cardId: card.id } });

    if (seedCard.rewardCategories.length > 0) {
      await prisma.rewardCategory.createMany({
        data: seedCard.rewardCategories.map((rewardCategory) => ({
          cardId: card.id,
          ...rewardCategory
        }))
      });
    }

    if (seedCard.benefits.length > 0) {
      await prisma.cardBenefit.createMany({
        data: seedCard.benefits.map((benefit) => ({
          cardId: card.id,
          ...benefit
        }))
      });
    }
  }

  console.log(`Seeded ${cards.length} credit cards.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
