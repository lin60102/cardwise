import { PrismaClient, PurchaseCategory } from "@prisma/client";

const prisma = new PrismaClient();

const cards = [
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
