import { Queue } from "bullmq";

export const notificationQueue =
  new Queue(
    "notification-queue",
    {
      connection: {
        host:
          process.env.REDIS_HOST ||
          "127.0.0.1",
        port:
          Number(
            process.env.REDIS_PORT
          ) || 6379,
      },

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