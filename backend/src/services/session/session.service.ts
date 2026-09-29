import { SessionRepository } from "../../repositories/session/session.repository";

export class SessionService {
  /* ==========================================================
     CREATE SESSION
  ========================================================== */

  static async createSession(data: {
    userId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    isActive?: boolean;
    expiresAt: Date;
  }) {
    return SessionRepository.create(data);
  }

  /* ==========================================================
     GET SESSION BY ID
  ========================================================== */

  static async getSessionById(id: string) {
    const session = await SessionRepository.getById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  /* ==========================================================
     GET SESSION BY TOKEN
  ========================================================== */

  static async getSessionByToken(token: string) {
    const session = await SessionRepository.getByToken(token);

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  /* ==========================================================
     GET ALL ACTIVE SESSIONS
  ========================================================== */

  static async getActiveSessions() {
    return SessionRepository.getActiveSessions();
  }

  /* ==========================================================
     GET USER SESSIONS
  ========================================================== */

  static async getUserSessions(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return SessionRepository.getUserSessions(userId);
  }

  /* ==========================================================
     UPDATE SESSION
  ========================================================== */

  static async updateSession(
    id: string,
    data: {
      token?: string;
      ipAddress?: string;
      userAgent?: string;
      isActive?: boolean;
      logoutAt?: Date;
      expiresAt?: Date;
    }
  ) {
    return SessionRepository.update(id, data);
  }

  /* ==========================================================
     FORCE LOGOUT SESSION
  ========================================================== */

  static async forceLogoutSession(id: string) {
    const session = await SessionRepository.getById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    if (!session.isActive) {
      throw new Error("Session already inactive");
    }

    return SessionRepository.forceLogoutSession(id);
  }

  /* ==========================================================
     LOGOUT ALL USER SESSIONS
  ========================================================== */

  static async logoutAllUserSessions(userId: string) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    return SessionRepository.logoutAllUserSessions(userId);
  }

  /* ==========================================================
     DELETE SESSION
  ========================================================== */

  static async deleteSession(id: string) {
    const session = await SessionRepository.getById(id);

    if (!session) {
      throw new Error("Session not found");
    }

    return SessionRepository.delete(id);
  }

  /* ==========================================================
     CLEANUP EXPIRED SESSIONS
  ========================================================== */

  static async cleanupExpiredSessions() {
    return SessionRepository.cleanupExpiredSessions();
  }

  /* ==========================================================
     SESSION ANALYTICS
  ========================================================== */

  static async getAnalytics() {
    return SessionRepository.getAnalytics();
  }

  /* ==========================================================
     RECENT SESSIONS
  ========================================================== */

  static async getRecentSessions(limit = 10) {
    return SessionRepository.getRecent(limit);
  }

  /* ==========================================================
     SEARCH SESSIONS
  ========================================================== */

  static async searchSessions(keyword: string) {
    if (!keyword.trim()) {
      throw new Error("Search keyword is required");
    }

    return SessionRepository.search(keyword);
  }

  /* ==========================================================
     USER SESSION SUMMARY
  ========================================================== */

  static async getUserSessionSummary(userId: string) {
    const sessions = await SessionRepository.getUserSessions(userId);

    const activeSessions = sessions.filter(
      (session) => session.isActive
    );

    const expiredSessions = sessions.filter(
      (session) => session.expiresAt < new Date()
    );

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      inactiveSessions:
        sessions.length - activeSessions.length,
      expiredSessions: expiredSessions.length,
      latestSession:
        sessions.length > 0 ? sessions[0] : null,
    };
  }
}