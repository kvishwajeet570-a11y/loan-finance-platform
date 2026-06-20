"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/* ========================================
   IMPORTS
======================================== */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
/* ========================================
   ROUTES
======================================== */
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const loanRoutes_1 = __importDefault(require("./routes/loanRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const leaderboardRoutes_1 = __importDefault(require("./routes/leaderboardRoutes"));
const commissionRoutes_1 = __importDefault(require("./routes/commissionRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const achievementRoutes_1 = __importDefault(require("./routes/achievementRoutes"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const rechargeRoutes_1 = __importDefault(require("./routes/rechargeRoutes"));
const referralRoutes_1 = __importDefault(require("./routes/referralRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const revenueRoutes_1 = __importDefault(require("./routes/revenueRoutes"));
/* ========================================
   APP
======================================== */
const app = (0, express_1.default)();
app.set("trust proxy", 1);
/* ========================================
   CORS
======================================== */
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
/* ========================================
   LOGGER
======================================== */
app.use((0, morgan_1.default)("dev"));
/* ========================================
   BODY PARSER
======================================== */
app.use(express_1.default.json({
    limit: "10mb",
}));
app.use(express_1.default.urlencoded({
    extended: true,
}));
/* ========================================
   ROOT ROUTE
======================================== */
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Loan Finance Backend Running Successfully",
        version: "2.0.0",
    });
});
/* ========================================
   TEST ROUTES
======================================== */
app.get("/api/auth/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Auth Route Working Successfully",
    });
});
app.get("/api/dashboard/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Dashboard Route Working Successfully",
    });
});
app.get("/api/revenue/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Revenue Route Working Successfully",
    });
});
/* ========================================
   API ROUTES
======================================== */
app.use("/api/auth", authRoutes_1.default);
app.use("/api/loan", loanRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/dashboard", dashboardRoutes_1.default);
app.use("/api/leaderboard", leaderboardRoutes_1.default);
app.use("/api/commission", commissionRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/achievements", achievementRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.use("/api/wallet", walletRoutes_1.default);
app.use("/api/recharge", rechargeRoutes_1.default);
app.use("/api/referral", referralRoutes_1.default);
app.use("/api/coupon", couponRoutes_1.default);
app.use("/api/transaction", transactionRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.use("/api/revenue", revenueRoutes_1.default);
/* ========================================
   404 HANDLER
======================================== */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found",
    });
});
/* ========================================
   GLOBAL ERROR HANDLER
======================================== */
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR =>", err);
    res.status(500).json({
        success: false,
        message: err.message ||
            "Internal Server Error",
    });
});
/* ========================================
   SERVER
======================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`

========================================
 Backend Server Running Successfully
 URL: http://localhost:${PORT}
 Environment: ${process.env.NODE_ENV || "development"}
========================================

    `);
});
/* ========================================
   EXPORT
======================================== */
exports.default = app;
