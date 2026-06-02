import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const hash = await argon2.hash("password");
  const user = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: { email: "guest@example.com", passwordHash: hash },
  });
  console.log("Seeded user:", user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
