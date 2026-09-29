import { Prisma } from "@prisma/client";
import { SecurityLogRepository } from "../../repositories/securityLog/securityLog.repository";

export class SecurityLogService {
  /* =========================================
     CREATE SECURITY LOG
  ========================================= */

  static async createLog(data: {
    userId: string;
    action: string;
    severity?: string;
    status?: string;
    ipAddress?: string;
    deviceInfo?: string;
    userAgent?: string;
    module?: string;
    description?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return SecurityLogRepository.createLog(data);
  }

  /* =========================================
     GET LOG BY ID
  ========================================= */

  static async getById(id: string) {
    const log = await SecurityLogRepository.getById(id);

    if (!log) {
      throw new Error("Security log not found");
    }

    return log;
  }

  /* =========================================
     GET USER LOGS
  ========================================= */

  static async getUserLogs(
    userId: string,
    page = 1,
    limit = 20
  ) {
    return SecurityLogRepository.getUserLogs(userId, page, limit);
  }

  /* =========================================
     LOGIN ATTEMPTS
  ========================================= */

  static async getLoginAttempts(userId: string) {
    return SecurityLogRepository.getLoginAttempts(userId);
  }

  /* =========================================
     FAILED LOGIN ATTEMPTS
  ========================================= */

  static async getFailedLogins() {
    return SecurityLogRepository.getFailedLogins();
  }

  /* =========================================
     HIGH RISK EVENTS
  ========================================= */

  static async getHighRiskEvents() {
    return SecurityLogRepository.getHighRiskEvents();
  }

  /* =========================================
     CRITICAL EVENTS
  ========================================= */

  static async getCriticalEvents() {
    return SecurityLogRepository.getCriticalEvents();
  }

  /* =========================================
     GET EVENTS BY ACTION
  ========================================= */

  static async getByAction(action: string) {
    return SecurityLogRepository.getByEventType(action);
  }

  /* =========================================
     GET BY IP ADDRESS
  ========================================= */

  static async getByIpAddress(ipAddress: string) {
    return SecurityLogRepository.getByIpAddress(ipAddress);
  }

  /* =========================================
     SEARCH LOGS
  ========================================= */

  static async searchLogs(keyword: string) {
    if (!keyword.trim()) {
      throw new Error("Search keyword is required");
    }

    return SecurityLogRepository.searchLogs(keyword);
  }

  /* =========================================
     DELETE OLD LOGS
  ========================================= */

  static async cleanup(days = 90) {
    if (days <= 0) {
      throw new Error("Days must be greater than zero");
    }

    return SecurityLogRepository.deleteOldLogs(days);
  }

  /* =========================================
     SECURITY ANALYTICS
  ========================================= */

  static async getAnalytics() {
    return SecurityLogRepository.getAnalytics();
  }

  /* =========================================
     SECURITY DASHBOARD
  ========================================= */

  static async getDashboard() {
    return SecurityLogRepository.getDashboard();
  }
}