"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth/auth.route"));
const loan_route_1 = __importDefault(require("./routes/loan/loan.route"));
const app = (0, express_1.default)();
/* ========================================
   MIDDLEWARE
======================================== */
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
/* ========================================
   API ROUTES
======================================== */
app.use("/api/auth", auth_route_1.default);
app.use("/api/loan", loan_route_1.default);
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
   HEALTH CHECK
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
