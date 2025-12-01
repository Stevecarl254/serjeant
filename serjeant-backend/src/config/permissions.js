// src/config/permissions.js
// Define granular permissions and map roles to permissions.
// Edit this file when you want to change capabilities.

export const PERMISSIONS = {
  VIEW_ADMIN_DASHBOARD: "view_admin_dashboard",
  MANAGE_USERS: "manage_users",
  MANAGE_BOOKINGS: "manage_bookings",
  CREATE_BOOKINGS: "create_bookings",
  VIEW_PROFILE: "view_profile",
  EDIT_PROFILE: "edit_profile",
  MARK_PAYMENTS: "mark_payments",
  MANAGE_EVENTS: "manage_events",
  // will add more granular permissions here
};

// Map roles to allowed permission lists.
// Roles: superadmin, admin, staff, high_tier, low_tier, user (unpaid/registered)
export const ROLE_PERMISSIONS = {
  superadmin: Object.values(PERMISSIONS),

  admin: [
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.MARK_PAYMENTS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.MANAGE_EVENTS,       // ← add this
  ],

  staff: [
    PERMISSIONS.MANAGE_BOOKINGS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
    // PERMISSIONS.MANAGE_EVENTS,    // optional
  ],

  high_tier: [
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.VIEW_PROFILE,
    PERMISSIONS.EDIT_PROFILE,
  ],

  low_tier: [
    PERMISSIONS.CREATE_BOOKINGS,
    PERMISSIONS.VIEW_PROFILE,
  ],

  user: [
    PERMISSIONS.VIEW_PROFILE,
  ],
};
