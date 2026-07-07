// src/health/health.ts

import os from "os";

export class HealthService {
  static async getHealthStatus() {
    const uptime = process.uptime();

    return {
      success: true,
      status: "UP",

      timestamp: new Date().toISOString(),

      server: {
        environment:
          process.env.NODE_ENV || "development",

        uptime: `${Math.floor(
          uptime / 60
        )} minutes`,

        pid: process.pid,

        platform: process.platform,

        nodeVersion: process.version,
      },

      memory: {
        total:
          Math.round(
            os.totalmem() /
              1024 /
              1024
          ) + " MB",

        free:
          Math.round(
            os.freemem() /
              1024 /
              1024
          ) + " MB",

        used:
          Math.round(
            (os.totalmem() -
              os.freemem()) /
              1024 /
              1024
          ) + " MB",
      },

      cpu: {
        cores:
          os.cpus().length,
      },
    };
  }
}