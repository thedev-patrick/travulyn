import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@travulyn.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Travulyn Admin",
      role: "SUPERADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  const countries = await Promise.all(
    [
      { name: "Nigeria", isoCode: "NG", flagEmoji: "🇳🇬" },
      { name: "Ghana", isoCode: "GH", flagEmoji: "🇬🇭" },
      { name: "Kenya", isoCode: "KE", flagEmoji: "🇰🇪" },
      { name: "United Kingdom", isoCode: "GB", flagEmoji: "🇬🇧" },
      { name: "United States", isoCode: "US", flagEmoji: "🇺🇸" },
      { name: "Canada", isoCode: "CA", flagEmoji: "🇨🇦" },
    ].map((c) =>
      prisma.country.upsert({ where: { isoCode: c.isoCode }, update: {}, create: c })
    )
  );

  const byIso = Object.fromEntries(countries.map((c) => [c.isoCode, c]));

  const documents = await Promise.all(
    [
      { name: "Valid Passport", description: "Passport with at least 6 months validity remaining." },
      { name: "Passport Photograph", description: "Recent passport-sized photograph on a white background." },
      { name: "Proof of Funds", description: "Bank statement covering the last 3-6 months." },
      { name: "Invitation Letter", description: "Letter from a host or inviting organization, if applicable." },
      { name: "Travel Itinerary", description: "Flight booking or travel plan." },
      { name: "Proof of Accommodation", description: "Hotel booking or proof of residence at destination." },
      { name: "Yellow Fever Vaccination Card", description: "Required for some African destinations." },
      { name: "Employment Letter", description: "Letter from employer confirming role and leave approval." },
    ].map((d) =>
      prisma.requiredDocument.upsert({ where: { name: d.name }, update: {}, create: d })
    )
  );

  const byName = Object.fromEntries(documents.map((d) => [d.name, d]));

  const corridorSeeds = [
    {
      origin: byIso.NG,
      destination: byIso.GB,
      priceEstimateMin: 250,
      priceEstimateMax: 450,
      currency: "USD",
      processingDays: 15,
      summary: "UK Standard Visitor Visa for Nigerian travellers.",
      docs: ["Valid Passport", "Passport Photograph", "Proof of Funds", "Travel Itinerary", "Proof of Accommodation", "Employment Letter"],
    },
    {
      origin: byIso.NG,
      destination: byIso.US,
      priceEstimateMin: 300,
      priceEstimateMax: 500,
      currency: "USD",
      processingDays: 21,
      summary: "US B1/B2 Visitor Visa for Nigerian travellers.",
      docs: ["Valid Passport", "Passport Photograph", "Proof of Funds", "Invitation Letter", "Travel Itinerary", "Employment Letter"],
    },
    {
      origin: byIso.GH,
      destination: byIso.CA,
      priceEstimateMin: 200,
      priceEstimateMax: 400,
      currency: "USD",
      processingDays: 20,
      summary: "Canada Visitor Visa for Ghanaian travellers.",
      docs: ["Valid Passport", "Passport Photograph", "Proof of Funds", "Travel Itinerary", "Proof of Accommodation"],
    },
    {
      origin: byIso.KE,
      destination: byIso.GB,
      priceEstimateMin: 220,
      priceEstimateMax: 420,
      currency: "USD",
      processingDays: 15,
      summary: "UK Standard Visitor Visa for Kenyan travellers.",
      docs: ["Valid Passport", "Passport Photograph", "Proof of Funds", "Travel Itinerary", "Proof of Accommodation", "Yellow Fever Vaccination Card"],
    },
  ];

  for (const seed of corridorSeeds) {
    const corridor = await prisma.corridor.upsert({
      where: {
        originCountryId_destinationCountryId: {
          originCountryId: seed.origin.id,
          destinationCountryId: seed.destination.id,
        },
      },
      update: {},
      create: {
        originCountryId: seed.origin.id,
        destinationCountryId: seed.destination.id,
        priceEstimateMin: seed.priceEstimateMin,
        priceEstimateMax: seed.priceEstimateMax,
        currency: seed.currency,
        processingDays: seed.processingDays,
        summary: seed.summary,
      },
    });

    for (const docName of seed.docs) {
      await prisma.corridorDocument.upsert({
        where: {
          corridorId_requiredDocumentId: {
            corridorId: corridor.id,
            requiredDocumentId: byName[docName].id,
          },
        },
        update: {},
        create: {
          corridorId: corridor.id,
          requiredDocumentId: byName[docName].id,
        },
      });
    }
  }

  await prisma.blogPost.upsert({
    where: { slug: "how-to-prepare-for-your-visa-interview" },
    update: {},
    create: {
      slug: "how-to-prepare-for-your-visa-interview",
      title: "How to Prepare for Your Visa Interview",
      excerpt: "A few practical tips to walk into your visa interview with confidence.",
      contentMarkdown:
        "# How to Prepare for Your Visa Interview\n\nPreparation is the difference between a smooth visa interview and a stressful one. Here are a few tips from our team:\n\n1. Bring every document on your checklist, plus copies.\n2. Be honest and concise when answering questions.\n3. Know the details of your itinerary and who is funding your trip.\n\nOur team at Travulyn helps you prepare a complete, accurate document set before your interview.",
      coverImageUrl: null,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        customerName: "Amaka O.",
        countryContext: "Nigeria → United Kingdom",
        quote: "Travulyn made the whole visa process stress-free. I always knew exactly what was needed.",
        rating: 5,
        featured: true,
      },
      {
        customerName: "Kwame A.",
        countryContext: "Ghana → Canada",
        quote: "The progress tracking link was a game changer. No more guessing where my application stood.",
        rating: 5,
        featured: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
