import cron from "node-cron";
import prisma from "../prisma/prisma";

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
      console.error(
        "Daily EMI Reminder Job Error:",
        error
      );
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

/* =========================================
   AUTO LOAN STATUS UPDATE

   DISABLED LOGIC:
   Current LoanStatus enum contains only:
   PENDING
   APPROVED
   REJECTED

   Therefore DISBURSED cannot be queried.
========================================= */

export const loanStatusUpdateJob =
  cron.schedule(
    "0 */6 * * *",
    async () => {
      try {
        console.log(
          "Loan Status Update skipped: DISBURSED status is not available in current LoanStatus enum."
        );
      } catch (error) {
        console.error(
          "Loan Status Update Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        console.error(
          "Referral Settlement Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        console.error(
          "Commission Settlement Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        console.error(
          "Wallet Reconciliation Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        const result =
          await prisma.kYC.updateMany({
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
          `Expired KYC Updated: ${result.count}`
        );
      } catch (error) {
        console.error(
          "KYC Expiry Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

/* =========================================
   DOCUMENT EXPIRY CHECK

   DISABLED:
   Current Document model does not contain
   expiryDate/status fields.
========================================= */

export const documentExpiryJob =
  cron.schedule(
    "30 2 * * *",
    async () => {
      try {
        console.log(
          "Document Expiry Check skipped: Document model does not contain expiryDate/status fields."
        );
      } catch (error) {
        console.error(
          "Document Expiry Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        const [
          totalUsers,
          totalLoans,
          totalTransactions,
        ] = await Promise.all([
          prisma.user.count(),

          prisma.loanApplication.count(),

          prisma.transaction.count(),
        ]);

        console.log(
          "Daily Analytics Snapshot:",
          {
            totalUsers,
            totalLoans,
            totalTransactions,
          }
        );
      } catch (error) {
        console.error(
          "Analytics Snapshot Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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

        /*
         * Actual PostgreSQL backup logic
         * can be added here later.
         */
      } catch (error) {
        console.error(
          "Database Backup Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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

        /*
         * Report generation logic
         * can be added here later.
         */
      } catch (error) {
        console.error(
          "Report Generation Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
        console.error(
          "Fraud Detection Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
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
          `Daily Revenue: ${revenue._sum.amount || 0}`
        );
      } catch (error) {
        console.error(
          "Revenue Job Error:",
          error
        );
      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

/* =========================================
   START ALL SCHEDULER JOBS
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