import { ROLE_PERMISSIONS } from "../config/permissions.js";

export const authorize = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const role = req.user.role;
    const perms = ROLE_PERMISSIONS[role] || [];

    // superadmin handled by having all perms in ROLE_PERMISSIONS or check explicitly
    if (!perms.includes(requiredPermission)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }

    next();
  };
};
