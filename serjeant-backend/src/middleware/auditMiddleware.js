import AuditLog from "../models/AuditLog.js";

export const logAction = (actionName, options = {}) => {
  // returns middleware (req, res, next) => { ... }
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?._id || null;
      const ip = req.ip || req.headers["x-forwarded-for"] || req.connection?.remoteAddress;
      const userAgent = req.headers["user-agent"] || "";

      // Minimal metadata
      const meta = {
        route: req.originalUrl,
        method: req.method,
        ...options.meta,
      };

      await AuditLog.create({
        user: userId,
        action: actionName,
        meta,
        ip,
        userAgent,
      });
    } catch (err) {
      // Logging failure shouldn't break the request flow.
      console.error("AuditLog error:", err.message);
    } finally {
      next();
    }
  };
};
