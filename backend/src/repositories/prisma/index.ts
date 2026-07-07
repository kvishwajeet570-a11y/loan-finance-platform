import { PrismaClient } from "@prisma/client";

/* =========================================
   GLOBAL PRISMA TYPE
========================================= */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/* =========================================
   PRISMA CLIENT
========================================= */

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

/* =========================================
   PREVENT MULTIPLE INSTANCES
========================================= */

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/* =========================================
   DB CONNECTION HELPERS
========================================= */

export const connectDB = async () => {
  try {
    await prisma.$connect();

    console.log(
      "✅ PostgreSQL Database Connected Successfully"
    );
  } catch (error) {
    console.error(
      "❌ Database Connection Failed",
      error
    );

    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();

    console.log(
      "🔌 Database Connection Closed"
    );
  } catch (error) {
    console.error(
      "❌ Error Closing Database Connection",
      error
    );
  }
};