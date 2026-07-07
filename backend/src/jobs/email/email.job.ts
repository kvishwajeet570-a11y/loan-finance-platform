import cron from "node-cron";
import prisma from "../../config/prisma";
import { sendEmail } from "../../integrations/email/email";

export const emailJob = () => {
  cron.schedule("0 10 * * *", async () => {
    console.log("Running Email Job...");

    const pendingLoans =
      await prisma.loanApplication.findMany({
        where: {
          status: "pending",
        },
      });

    for (const loan of pendingLoans) {
      if (!loan.email) continue;

      await sendEmail(
        loan.email,
        "Loan Application Update",
        `
        <h2>Hello ${loan.fullName}</h2>
        <p>Your loan application is under review.</p>
        `
      );
    }

    console.log("Email Job Completed");
  });
};