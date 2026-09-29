"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const session_repository_1 = require("../../repositories/session/session.repository");
class SessionService {
    /* ==========================================================
       CREATE SESSION
    ========================================================== */
    static async createSession(data) {
        return session_repository_1.SessionRepository.create(data);
    }
    /* ==========================================================
       GET SESSION BY ID
    ========================================================== */
    static async getSessionById(id) {
        const session = await session_repository_1.SessionRepository.getById(id);
        if (!session) {
            throw new Error("Session not found");
        }
        return session;
    }
    /* ==========================================================
       GET SESSION BY TOKEN
    ========================================================== */
    static async getSessionByToken(token) {
        const session = await session_repository_1.SessionRepository.getByToken(token);
        if (!session) {
            throw new Error("Session not found");
        }
        return session;
    }
    /* ==========================================================
       GET ALL ACTIVE SESSIONS
    ========================================================== */
    static async getActiveSessions() {
        return session_repository_1.SessionRepository.getActiveSessions();
    }
    /* ==========================================================
       GET USER SESSIONS
    ========================================================== */
    static async getUserSessions(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        return session_repository_1.SessionRepository.getUserSessions(userId);
    }
    /* ==========================================================
       UPDATE SESSION
    ========================================================== */
    static async updateSession(id, data) {
        return session_repository_1.SessionRepository.update(id, data);
    }
    /* ==========================================================
       FORCE LOGOUT SESSION
    ========================================================== */
    static async forceLogoutSession(id) {
        const session = await session_repository_1.SessionRepository.getById(id);
        if (!session) {
            throw new Error("Session not found");
        }
        if (!session.isActive) {
            throw new Error("Session already inactive");
        }
        return session_repository_1.SessionRepository.forceLogoutSession(id);
    }
    /* ==========================================================
       LOGOUT ALL USER SESSIONS
    ========================================================== */
    static async logoutAllUserSessions(userId) {
        if (!userId) {
            throw new Error("User ID is required");
        }
        return session_repository_1.SessionRepository.logoutAllUserSessions(userId);
    }
    /* ==========================================================
       DELETE SESSION
    ========================================================== */
    static async deleteSession(id) {
        const session = await session_repository_1.SessionRepository.getById(id);
        if (!session) {
            throw new Error("Session not found");
        }
        return session_repository_1.SessionRepository.delete(id);
    }
    /* ==========================================================
       CLEANUP EXPIRED SESSIONS
    ========================================================== */
    static async cleanupExpiredSessions() {
        return session_repository_1.SessionRepository.cleanupExpiredSessions();
    }
    /* ==========================================================
       SESSION ANALYTICS
    ========================================================== */
    static async getAnalytics() {
        return session_repository_1.SessionRepository.getAnalytics();
    }
    /* ==========================================================
       RECENT SESSIONS
    ========================================================== */
    static async getRecentSessions(limit = 10) {
        return session_repository_1.SessionRepository.getRecent(limit);
    }
    /* ==========================================================
       SEARCH SESSIONS
    ========================================================== */
    static async searchSessions(keyword) {
        if (!keyword.trim()) {
            throw new Error("Search keyword is required");
        }
        return session_repository_1.SessionRepository.search(keyword);
    }
    /* ==========================================================
       USER SESSION SUMMARY
    ========================================================== */
    static async getUserSessionSummary(userId) {
        const sessions = await session_repository_1.SessionRepository.getUserSessions(userId);
        const activeSessions = sessions.filter((session) => session.isActive);
        const expiredSessions = sessions.filter((session) => session.expiresAt < new Date());
        return {
            totalSessions: sessions.length,
            activeSessions: activeSessions.length,
            inactiveSessions: sessions.length - activeSessions.length,
            expiredSessions: expiredSessions.length,
            latestSession: sessions.length > 0 ? sessions[0] : null,
        };
    }
}
exports.SessionService = SessionService;
