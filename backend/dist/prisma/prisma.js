"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/* ========================================
   PREVENT MULTIPLE CONNECTIONS
======================================== */
const prisma = global.prisma ||
    new client_1.PrismaClient({
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
if (process.env.NODE_ENV !==
    "production") {
    global.prisma = prisma;
}
/* ========================================
   EXPORT
======================================== */
exports.default = prisma;
