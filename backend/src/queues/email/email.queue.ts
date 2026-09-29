import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT || 6379),
};

export const emailQueue = new Queue(
  "email-queue",
  {
    connection,

    defaultJobOptions: {
      attempts: 3,

      backoff: {
        type: "exponential",
        delay: 5000,
      },

      removeOnComplete: 100,
      removeOnFail: 50,
    },
  }
);

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
}

export const addEmailJob = async (
  data: EmailJobData
) => {
  return emailQueue.add(
    "send-email",
    data
  );
};