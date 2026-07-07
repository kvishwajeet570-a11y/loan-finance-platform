"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = exports.prisma = void 0;
const client_1 = require("@prisma/client");
/* =========================================
   PRISMA CLIENT
========================================= */
exports.prisma = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
    });
/* =========================================
   PREVENT MULTIPLE INSTANCES
========================================= */
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
/* =========================================
   DB CONNECTION HELPERS
========================================= */
const connectDB = async () => {
    try {
        await exports.prisma.$connect();
        console.log("✅ PostgreSQL Database Connected Successfully");
    }
    catch (error) {
        console.error("❌ Database Connection Failed", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log("🔌 Database Connection Closed");
    }
    catch (error) {
        console.error("❌ Error Closing Database Connection", error);
    }
};
exports.disconnectDB = disconnectDB;
