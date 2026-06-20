
import dotenv from "dotenv";

dotenv.config();

/* ========================================
   IMPORTS
======================================== */

import express, {
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";

import morgan from "morgan";

/* ========================================
   ROUTES
======================================== */

import authRoutes from "./routes/authRoutes";

import loanRoutes from "./routes/loanRoutes";

import contactRoutes from "./routes/contactRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import leaderboardRoutes from "./routes/leaderboardRoutes";

import commissionRoutes from "./routes/commissionRoutes";

import notificationRoutes from "./routes/notificationRoutes";

import achievementRoutes from "./routes/achievementRoutes";

import taskRoutes from "./routes/taskRoutes";

import walletRoutes from "./routes/walletRoutes";

import rechargeRoutes from "./routes/rechargeRoutes";

import referralRoutes from "./routes/referralRoutes";

import couponRoutes from "./routes/couponRoutes";

import transactionRoutes from "./routes/transactionRoutes";

import adminRoutes from "./routes/adminRoutes";

import analyticsRoutes from "./routes/analyticsRoutes";

import revenueRoutes from "./routes/revenueRoutes";

/* ========================================
   APP
======================================== */

const app = express();

app.set("trust proxy", 1);
/* ========================================
   CORS
======================================== */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/* ========================================
   LOGGER
======================================== */

app.use(
  morgan("dev")
);

/* ========================================
   BODY PARSER
======================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ========================================
   ROOT ROUTE
======================================== */

app.get(
  "/",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({
      success: true,
      message:
        "Loan Finance Backend Running Successfully",
      version: "2.0.0",
    });

  }
);

/* ========================================
   TEST ROUTES
======================================== */

app.get(
  "/api/auth/test",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({
      success: true,
      message:
        "Auth Route Working Successfully",
    });

  }
);

app.get(
  "/api/dashboard/test",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({
      success: true,
      message:
        "Dashboard Route Working Successfully",
    });

  }
);

app.get(
  "/api/revenue/test",
  (
    req: Request,
    res: Response
  ) => {

    res.status(200).json({
      success: true,
      message:
        "Revenue Route Working Successfully",
    });

  }
);

/* ========================================
   API ROUTES
======================================== */

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/loan",
  loanRoutes
);

app.use(
  "/api/contact",
  contactRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/leaderboard",
  leaderboardRoutes
);

app.use(
  "/api/commission",
  commissionRoutes
);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/achievements",
  achievementRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

app.use(
  "/api/wallet",
  walletRoutes
);

app.use(
  "/api/recharge",
  rechargeRoutes
);

app.use(
  "/api/referral",
  referralRoutes
);

app.use(
  "/api/coupon",
  couponRoutes
);

app.use(
  "/api/transaction",
  transactionRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/analytics",
  analyticsRoutes
);

app.use(
  "/api/revenue",
  revenueRoutes
);

/* ========================================
   404 HANDLER
======================================== */

app.use(
  (
    req: Request,
    res: Response
  ) => {

    res.status(404).json({
      success: false,
      message:
        "API Route Not Found",
    });

  }
);

/* ========================================
   GLOBAL ERROR HANDLER
======================================== */

app.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    console.error(
      "GLOBAL ERROR =>",
      err
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });

  }
);

/* ========================================
   SERVER
======================================== */

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(`

========================================
 Backend Server Running Successfully
 URL: http://localhost:${PORT}
 Environment: ${process.env.NODE_ENV || "development"}
========================================

    `);

  }
);

/* ========================================
   EXPORT
======================================== */

export default app;


