"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeLeaderboard = void 0;
const serializeLeaderboard = (leaderboard) => ({
    id: leaderboard.id,
    userName: leaderboard.userName,
    totalPoints: leaderboard.totalPoints,
    totalSales: leaderboard.totalSales,
    createdAt: leaderboard.createdAt,
});
exports.serializeLeaderboard = serializeLeaderboard;
exports.default = exports.serializeLeaderboard;
