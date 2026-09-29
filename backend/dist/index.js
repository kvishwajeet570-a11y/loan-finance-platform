"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
/* ========================================
   MIDDLEWARE
======================================== */
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
/* ========================================
   ROOT ROUTE
======================================== */
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Loan Finance Backend Running Successfully",
    });
});
/* ========================================
   HEALTH CHECK
======================================== */
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy",
    });
});
/* ========================================
   ALL API ROUTES
======================================== */
app.use("/api", routes_1.default);
/* ========================================
   404 HANDLER
======================================== */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found",
        path: req.originalUrl,
    });
});
/* ========================================
   GLOBAL ERROR HANDLER
======================================== */
app.use((error, _req, res, _next) => {
    console.error("Global Error:", error);
    res.status(error?.statusCode || 500).json({
        success: false,
        message: error?.message || "Internal server error",
    });
});
/* ========================================
   SERVER
======================================== */
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
