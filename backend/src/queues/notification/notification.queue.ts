import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

export const notificationQueue =
  new Queue(
    "notification-queue",
    {
      connection,
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    }
  );

export interface NotificationJob {
  userId: string;
  title: string;
  message: string;
  type:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";
}

export const addNotificationJob =
  async (
    data: NotificationJob
  ) => {

    return notificationQueue.add(
      "create-notification",
      data
    );
  };