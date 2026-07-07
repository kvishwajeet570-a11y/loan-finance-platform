import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

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