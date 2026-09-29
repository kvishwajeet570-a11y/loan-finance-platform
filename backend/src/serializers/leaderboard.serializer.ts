export interface LeaderboardResponse {
  id: string;
  userName: string;
  totalPoints: number;
  totalSales: number;
  createdAt: Date;
}

export const serializeLeaderboard = (
  leaderboard: LeaderboardResponse
) => ({
  id: leaderboard.id,
  userName: leaderboard.userName,
  totalPoints: leaderboard.totalPoints,
  totalSales: leaderboard.totalSales,
  createdAt: leaderboard.createdAt,
});

export default serializeLeaderboard;
