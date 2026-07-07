import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

const redis =
  global.redis ||
  new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,

    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: true,

    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (error) => {
  console.error("❌ Redis Error:", error);
});

redis.on("reconnecting", () => {
  console.log("🔄 Redis Reconnecting...");
});

export default redis;