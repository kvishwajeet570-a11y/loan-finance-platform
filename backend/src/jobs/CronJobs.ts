import { emailJob } from "./email/email.job";
import { reportJob } from "./report/report.job";

export const initializeCronJobs = () => {
  emailJob();
  reportJob();

  console.log("Cron Jobs Initialized");
};