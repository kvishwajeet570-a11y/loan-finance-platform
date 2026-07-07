import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes

  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many requests. Please try again later.",
  },

  skipSuccessfulRequests: false,
});

export default rateLimiter;