"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const loanRoutes_1 = __importDefault(require("./routes/loanRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const rechargeRoutes_1 = __importDefault(require("./routes/rechargeRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes"));
const revenueRoutes_1 = __importDefault(require("./routes/revenueRoutes"));
const supportRoutes_1 = __importDefault(require("./routes/supportRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const achievementRoutes_1 = __importDefault(require("./routes/achievementRoutes"));
const commissionRoutes_1 = __importDefault(require("./routes/commissionRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const app = (0, express_1.default)();
/* ========================================
   MIDDLEWARE
======================================== */
app.use((0, cors_1.default)({
    origin: "*",
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
    ],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
/* ========================================
   API ROUTES
======================================== */
app.use("/api/auth", authRoutes_1.default);
app.use("/api/loan", loanRoutes_1.default);
app.use("/api/wallet", walletRoutes_1.default);
app.use("/api/transaction", transactionRoutes_1.default);
app.use("/api/recharge", rechargeRoutes_1.default);
app.use("/api/referral", referralRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/leaderboard", leaderboardRoutes_1.default);
app.use("/api/notification", notificationRoutes_1.default);
app.use("/api/profile", profileRoutes_1.default);
app.use("/api/revenue", revenueRoutes_1.default);
app.use("/api/support", supportRoutes_1.default);
app.use("/api/task", taskRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/achievement", achievementRoutes_1.default);
app.use("/api/commission", commissionRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/coupon", couponRoutes_1.default);
app.use("/api/job", jobRoutes_1.default);
/* ========================================
   ROOT ROUTE
======================================== */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Loan Finance Backend Running Successfully",
    });
});
/* ========================================
   SERVER HEALTH CHECK
======================================== */
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});
/* ========================================
   SERVER
======================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
