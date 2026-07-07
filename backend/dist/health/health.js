"use strict";
// src/health/health.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const os_1 = __importDefault(require("os"));
class HealthService {
    static async getHealthStatus() {
        const uptime = process.uptime();
        return {
            success: true,
            status: "UP",
            timestamp: new Date().toISOString(),
            server: {
                environment: process.env.NODE_ENV || "development",
                uptime: `${Math.floor(uptime / 60)} minutes`,
                pid: process.pid,
                platform: process.platform,
                nodeVersion: process.version,
            },
            memory: {
                total: Math.round(os_1.default.totalmem() /
                    1024 /
                    1024) + " MB",
                free: Math.round(os_1.default.freemem() /
                    1024 /
                    1024) + " MB",
                used: Math.round((os_1.default.totalmem() -
                    os_1.default.freemem()) /
                    1024 /
                    1024) + " MB",
            },
            cpu: {
                cores: os_1.default.cpus().length,
            },
        };
    }
}
exports.HealthService = HealthService;
