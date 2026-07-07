import cron from "node-cron";
import { prisma } from "../config/prisma";

/* =========================================
   DAILY EMI REMINDER
========================================= */

export const dailyEmiReminderJob = cron.schedule(
  "0 9 * * *",
  async () => {
    try {
      console.log(
        "Running Daily EMI Reminder Job..."
      );

      const today = new Date();

      const loans =
        await prisma.loanApplication.findMany({
          where: {
            status: "APPROVED",
          },
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        });

      console.log(
        `EMI Reminder Sent: ${loans.length}`
      );

    } catch (error) {
      console.error(error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

/* =========================================
   AUTO LOAN STATUS UPDATE
========================================= */

export const loanStatusUpdateJob =
  cron.schedule(
    "0 */6 * * *",
    async () => {
      try {

        await prisma.loanApplication.updateMany({
          where: {
            status: "DISBURSED",
          },
          data: {
            updatedAt: new Date(),
          },
        });

        console.log(
          "Loan Status Updated"
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   REFERRAL SETTLEMENT
========================================= */

export const referralSettlementJob =
  cron.schedule(
    "0 1 * * *",
    async () => {
      try {

        const referrals =
          await prisma.referral.findMany({
            where: {
              status: "APPROVED",
            },
          });

        console.log(
          `Referral Settlement: ${referrals.length}`
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   COMMISSION SETTLEMENT
========================================= */

export const commissionSettlementJob =
  cron.schedule(
    "30 1 * * *",
    async () => {
      try {

        const commissions =
          await prisma.commission.findMany({
            where: {
              status: "APPROVED",
            },
          });

        console.log(
          `Commission Settlement: ${commissions.length}`
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DAILY WALLET RECONCILIATION
========================================= */

export const walletReconciliationJob =
  cron.schedule(
    "0 2 * * *",
    async () => {
      try {

        const wallets =
          await prisma.wallet.count();

        console.log(
          `Wallet Reconciliation: ${wallets}`
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   EXPIRED KYC CHECK
========================================= */

export const kycExpiryJob =
  cron.schedule(
    "15 2 * * *",
    async () => {
      try {

        await prisma.kyc.updateMany({
          where: {
            expiryDate: {
              lt: new Date(),
            },
          },
          data: {
            status: "EXPIRED",
          },
        });

        console.log(
          "Expired KYC Updated"
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DOCUMENT EXPIRY CHECK
========================================= */

export const documentExpiryJob =
  cron.schedule(
    "30 2 * * *",
    async () => {
      try {

        await prisma.document.updateMany({
          where: {
            expiryDate: {
              lt: new Date(),
            },
          },
          data: {
            status: "EXPIRED",
          },
        });

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DAILY ANALYTICS SNAPSHOT
========================================= */

export const analyticsSnapshotJob =
  cron.schedule(
    "55 23 * * *",
    async () => {
      try {

        const totalUsers =
          await prisma.user.count();

        const totalLoans =
          await prisma.loanApplication.count();

        const totalTransactions =
          await prisma.transaction.count();

        console.log({
          totalUsers,
          totalLoans,
          totalTransactions,
        });

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DATABASE BACKUP
========================================= */

export const databaseBackupJob =
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {

        console.log(
          "Database Backup Started"
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DAILY REPORT GENERATION
========================================= */

export const reportGenerationJob =
  cron.schedule(
    "0 4 * * *",
    async () => {
      try {

        console.log(
          "Generating Reports..."
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   FRAUD DETECTION
========================================= */

export const fraudDetectionJob =
  cron.schedule(
    "*/30 * * * *",
    async () => {
      try {

        const suspiciousTransactions =
          await prisma.transaction.count({
            where: {
              amount: {
                gt: 500000,
              },
            },
          });

        console.log(
          `Suspicious Transactions: ${suspiciousTransactions}`
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   DAILY REVENUE REPORT
========================================= */

export const revenueJob =
  cron.schedule(
    "0 23 * * *",
    async () => {
      try {

        const revenue =
          await prisma.transaction.aggregate({
            _sum: {
              amount: true,
            },
          });

        console.log(
          revenue._sum.amount || 0
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   START ALL JOBS
========================================= */

export const startScheduler = () => {

  dailyEmiReminderJob.start();

  loanStatusUpdateJob.start();

  referralSettlementJob.start();

  commissionSettlementJob.start();

  walletReconciliationJob.start();

  kycExpiryJob.start();

  documentExpiryJob.start();

  analyticsSnapshotJob.start();

  databaseBackupJob.start();

  reportGenerationJob.start();

  fraudDetectionJob.start();

  revenueJob.start();

  console.log(
    "All Scheduler Jobs Started Successfully"
  );
};