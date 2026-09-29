import cron from "node-cron";
import prisma from "../prisma/prisma";
/* =========================================
   DAILY LOAN EMI CHECK
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
        });

      console.log(
        `Found ${loans.length} active loans`
      );

    } catch (error) {
      console.error(error);
    }
  }
);

/* =========================================
   REFERRAL REWARD SETTLEMENT
========================================= */

export const referralSettlementJob =
  cron.schedule(
    "0 1 * * *",
    async () => {
      try {
        console.log(
          "Running Referral Settlement Job"
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
   EXPIRED KYC CHECK
========================================= */

export const kycExpiryJob =
  cron.schedule(
    "0 2 * * *",
    async () => {
      try {

        await prisma.kYC.updateMany({
          where: {
            expiryDate: {
              lte: new Date(),
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
   DOCUMENT CLEANUP
========================================= */

export const documentCleanupJob =
  cron.schedule(
    "0 3 * * 0",
    async () => {
      try {

        console.log(
          "Document Cleanup Running..."
        );

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

        await prisma.analytics.create({
          data: {
            totalUsers,
            totalLoans,
          },
        });

      } catch (error) {
        console.error(error);
      }
    }
  );

/* =========================================
   WALLET EXPIRY CHECK
========================================= */

export const walletJob =
  cron.schedule(
    "0 */6 * * *",
    async () => {
      try {

        console.log(
          "Wallet Validation Running"
        );

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
   REPORT GENERATION
========================================= */

export const reportGenerationJob =
  cron.schedule(
    "0 4 * * *",
    async () => {
      try {

        console.log(
          "Generating Daily Reports..."
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

        console.log(
          "Fraud Detection Running..."
        );

      } catch (error) {
        console.error(error);
      }
    }
  );

