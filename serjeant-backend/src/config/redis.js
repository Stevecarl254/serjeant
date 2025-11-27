import { createClient } from "redis";

let redisConnected = false;

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  if (!redisConnected) {
    try {
      await redisClient.connect();
      redisConnected = true;
      console.log("Redis connected successfully");
    } catch (err) {
      console.error("Redis connection failed:", err.message);
      process.exit(1);
    }
  }
};

export { redisClient, connectRedis };
