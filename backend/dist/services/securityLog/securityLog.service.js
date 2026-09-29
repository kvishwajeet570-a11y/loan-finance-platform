"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityLogService = void 0;
const securityLog_repository_1 = require("../../repositories/securityLog/securityLog.repository");
class SecurityLogService {
    /* =========================================
       CREATE SECURITY LOG
    ========================================= */
    static async createLog(data) {
        return securityLog_repository_1.SecurityLogRepository.createLog(data);
    }
    /* =========================================
       GET LOG BY ID
    ========================================= */
    static async getById(id) {
        const log = await securityLog_repository_1.SecurityLogRepository.getById(id);
        if (!log) {
            throw new Error("Security log not found");
        }
        return log;
    }
    /* =========================================
       GET USER LOGS
    ========================================= */
    static async getUserLogs(userId, page = 1, limit = 20) {
        return securityLog_repository_1.SecurityLogRepository.getUserLogs(userId, page, limit);
    }
    /* =========================================
       LOGIN ATTEMPTS
    ========================================= */
    static async getLoginAttempts(userId) {
        return securityLog_repository_1.SecurityLogRepository.getLoginAttempts(userId);
    }
    /* =========================================
       FAILED LOGIN ATTEMPTS
    ========================================= */
    static async getFailedLogins() {
        return securityLog_repository_1.SecurityLogRepository.getFailedLogins();
    }
    /* =========================================
       HIGH RISK EVENTS
    ========================================= */
    static async getHighRiskEvents() {
        return securityLog_repository_1.SecurityLogRepository.getHighRiskEvents();
    }
    /* =========================================
       CRITICAL EVENTS
    ========================================= */
    static async getCriticalEvents() {
        return securityLog_repository_1.SecurityLogRepository.getCriticalEvents();
    }
    /* =========================================
       GET EVENTS BY ACTION
    ========================================= */
    static async getByAction(action) {
        return securityLog_repository_1.SecurityLogRepository.getByEventType(action);
    }
    /* =========================================
       GET BY IP ADDRESS
    ========================================= */
    static async getByIpAddress(ipAddress) {
        return securityLog_repository_1.SecurityLogRepository.getByIpAddress(ipAddress);
    }
    /* =========================================
       SEARCH LOGS
    ========================================= */
    static async searchLogs(keyword) {
        if (!keyword.trim()) {
            throw new Error("Search keyword is required");
        }
        return securityLog_repository_1.SecurityLogRepository.searchLogs(keyword);
    }
    /* =========================================
       DELETE OLD LOGS
    ========================================= */
    static async cleanup(days = 90) {
        if (days <= 0) {
            throw new Error("Days must be greater than zero");
        }
        return securityLog_repository_1.SecurityLogRepository.deleteOldLogs(days);
    }
    /* =========================================
       SECURITY ANALYTICS
    ========================================= */
    static async getAnalytics() {
        return securityLog_repository_1.SecurityLogRepository.getAnalytics();
    }
    /* =========================================
       SECURITY DASHBOARD
    ========================================= */
    static async getDashboard() {
        return securityLog_repository_1.SecurityLogRepository.getDashboard();
    }
}
exports.SecurityLogService = SecurityLogService;
