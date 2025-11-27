import { redisClient } from "../config/redis.js";

/**
 * Simple Redis-backed rate limiter
 * - limits by identifier (IP or email)
 * - increments a counter and sets TTL on first increment
 */

const DEFAULT_WINDOW_SECONDS = 60 * 5; // 5 minutes
const DEFAULT_MAX_ATTEMPTS = 5;

const buildKey = (prefix, identifier) => `rl:${prefix}:${identifier}`;

const limiter = ({ prefix = "generic", windowSec = DEFAULT_WINDOW_SECONDS, maxAttempts = DEFAULT_MAX_ATTEMPTS, idExtractor }) => {
  return async (req, res, next) => {
    try {
      // Choose identifier: the idExtractor can use req to produce a key (e.g., email or ip)
      const identifier = idExtractor ? idExtractor(req) : (req.ip || req.headers["x-forwarded-for"] || "anonymous");
      const key = buildKey(prefix, identifier);

      // Use INCR and set EXPIRE when first created
      const attempts = await redisClient.incr(key);
      if (attempts === 1) {
        await redisClient.expire(key, windowSec);
      }

      if (attempts > maxAttempts) {
        const ttl = await redisClient.ttl(key);
        return res.status(429).json({
          message: `Too many requests. Try again in ${ttl} seconds.`,
        });
      }

      // Attach attempt count for handlers
      req.rateLimit = { attempts, maxAttempts };
      next();
    } catch (err) {
      // If redis fails, allow fallback (do not block auth); but log the issue.
      console.error("RateLimiter error:", err.message);
      next();
    }
  };
};

export const loginLimiter = limiter({
  prefix: "login",
  windowSec: 60 * 10, // 10 minutes
  maxAttempts: 5,
  idExtractor: (req) => {
    // Prefer using email (if provided) otherwise use IP
    const bodyEmail = req.body?.email;
    if (bodyEmail) return String(bodyEmail).toLowerCase();
    return req.ip || req.headers["x-forwarded-for"] || "unknown";
  },
});

// Example generic limiter by IP
export const ipLimiter = limiter({
  prefix: "ip",
  windowSec: 60,
  maxAttempts: 20,
  idExtractor: (req) => req.ip || req.headers["x-forwarded-for"] || "unknown",
});
