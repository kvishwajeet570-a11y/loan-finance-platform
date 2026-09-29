import { Queue, QueueEvents } from "bullmq";

const redisConnection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT || 6379),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const createQueue = (queueName: string) => {
  const queue = new Queue(queueName, {
    connection: redisConnection,

    defaultJobOptions: {
      attempts: 5,

      backoff: {
        type: "exponential",
        delay: 3000,
      },

      removeOnComplete: 1000,
      removeOnFail: 500,
    },
  });

  const events = new QueueEvents(queueName, {
    connection: redisConnection,
  });

  events.on("completed", ({ jobId }) => {
    console.log(
      `✅ ${queueName} Job Completed: ${jobId}`
    );
  });

  events.on("failed", ({ jobId, failedReason }) => {
    console.error(
      `❌ ${queueName} Job Failed: ${jobId}`,
      failedReason
    );
  });

  return queue;
};