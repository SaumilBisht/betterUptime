import { prisma } from "../index.ts";
import { randomUUID } from "crypto";

const REGIONS = [
  { id: "9a0511a5-731b-4892-8d70-4108baa29362", name: "india" },
  { id: "3b6ee783-3a33-47e8-86e4-3b5d6dd0336a", name: "usa" },
];

async function seedRegions() {
  for (const region of REGIONS) {
    await prisma.region.upsert({
      where: { id: region.id },
      update: {}, // nothing to update — IDs/names are fixed
      create: region,
    });
    console.log(`Ensured region ${region.name}`);
  }

  //SEED USER AND A WEBSITE SO THAT WORKER HAS SOME WEBSITES
  const user = await prisma.user.upsert({
    where: { email: "seeduser@example.com" }, 
    update: {},
    create: {
      id: randomUUID(),
      email: "seeduser@example.com",
      password: "seedpassword", // hashed if needed
    },
  });
  console.log(`User ${user.email} seeded`);

  const website = await prisma.website.upsert({
    where: {
      userId_url_unique: { // must match the name in @@unique
        userId: user.id,
        url: "https://example.com",
      },
    },
    update: {},
    create: {
      id: randomUUID(),
      url: "https://example.com",
      userId: user.id,
      timeAdded: new Date(),
    },
  });  
  console.log(`Website ${website.url} seeded`);
}
seedRegions()
  .catch((err) => {
    console.error("Failed to seed regions", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });