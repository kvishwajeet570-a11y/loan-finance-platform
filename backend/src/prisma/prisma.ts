import { PrismaClient } from "@prisma/client";


/* ========================================
   GLOBAL PRISMA CLIENT
======================================== */

declare global {

  var prisma:
    PrismaClient | undefined;

}


/* ========================================
   PREVENT MULTIPLE CONNECTIONS
======================================== */

const prisma =
  global.prisma ||

  new PrismaClient({

    log: [

      "query",

      "info",

      "warn",

      "error",

    ],

  });


/* ========================================
   SAVE GLOBAL INSTANCE
======================================== */

if (
  process.env.NODE_ENV !==
  "production"
) {

  global.prisma = prisma;

}


/* ========================================
   EXPORT
======================================== */

export default prisma;