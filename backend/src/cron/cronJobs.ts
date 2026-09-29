import prisma from "../prisma/prisma";

/**
 * OTP CLEANUP
 */
export const otpCleanupJob = async () => {

  const startedAt = new Date();

  try {

    const result =
      await prisma.user.updateMany({
        where: {
          otpExpiry: {
            lt: new Date(),
          },
        },
        data: {
          otp: null,
          otpExpiry: null,
        },
      });

    await prisma.cronJobLog.create({
      data: {
        jobName: "OTP_CLEANUP",
        status: "SUCCESS",
        message: `${result.count} OTP removed`,
        startedAt,
        completedAt: new Date(),
      },
    });

  } catch (error) {

    await prisma.cronJobLog.create({
      data: {
        jobName: "OTP_CLEANUP",
        status: "FAILED",
        message: String(error),
        startedAt,
      },
    });
  }
};

/**
 * SESSION CLEANUP
 */
export const sessionCleanupJob =
async () => {

  const startedAt =
    new Date();

  try {

    const result =
      await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

    await prisma.cronJobLog.create({
      data: {
        jobName: "SESSION_CLEANUP",
        status: "SUCCESS",
        message:
          `${result.count} sessions deleted`,
        startedAt,
        completedAt:
          new Date(),
      },
    });

  } catch (error) {

    await prisma.cronJobLog.create({
      data: {
        jobName: "SESSION_CLEANUP",
        status: "FAILED",
        message: String(error),
        startedAt,
      },
    });
  }
};

/**
 * DAILY ANALYTICS
 */
export const dailyAnalyticsJob =
async () => {

  const startedAt =
    new Date();

  try {

    const [
      users,
      loans,
      revenue,
    ] = await Promise.all([

      prisma.user.count(),

      prisma.loanApplication.count(),

      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    await prisma.cronJobLog.create({
      data: {
        jobName:
          "DAILY_ANALYTICS",
        status: "SUCCESS",
        message:
          `Users:${users} Loans:${loans} Revenue:${revenue._sum.amount || 0}`,
        startedAt,
        completedAt:
          new Date(),
      },
    });

  } catch (error) {

    await prisma.cronJobLog.create({
      data: {
        jobName:
          "DAILY_ANALYTICS",
        status: "FAILED",
        message: String(error),
        startedAt,
      },
    });
  }
};

/**
 * COMMISSION PROCESSOR
 */
export const commissionProcessorJob =
async () => {

  const startedAt =
    new Date();

  try {

    const pendingLoans =
      await prisma.loanApplication.findMany({
        where: {
          status:
            "DISBURSED",
        },
      });

    for (
      const loan
      of pendingLoans
    ) {

      // commission logic
    }

    await prisma.cronJobLog.create({
      data: {
        jobName:
          "COMMISSION_PROCESSOR",
        status: "SUCCESS",
        startedAt,
        completedAt:
          new Date(),
      },
    });

  } catch (error) {

    await prisma.cronJobLog.create({
      data: {
        jobName:
          "COMMISSION_PROCESSOR",
        status: "FAILED",
        message:
          String(error),
        startedAt,
      },
    });
  }
};