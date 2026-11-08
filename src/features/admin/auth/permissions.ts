export const ADMIN_ROLES = [
  "owner",
  "admin",
  "catalog_manager",
  "viewer",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ASSIGNABLE_ADMIN_ROLES = [
  "admin",
  "catalog_manager",
  "viewer",
] as const;

export type AssignableAdminRole = (typeof ASSIGNABLE_ADMIN_ROLES)[number];

export const ADMIN_PERMISSIONS = [
  "dashboard:view",
  "catalog:read",
  "catalog:write",
  "audit:read",
  "admins:manage",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

const ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  owner: ADMIN_PERMISSIONS,
  admin: ["dashboard:view", "catalog:read", "catalog:write", "audit:read"],
  catalog_manager: ["dashboard:view", "catalog:read", "catalog:write"],
  viewer: ["dashboard:view", "catalog:read"],
};

export function isAdminRole(value: unknown): value is AdminRole {
  return (
    typeof value === "string" &&
    ADMIN_ROLES.some((role) => role === value)
  );
}

export function isAssignableAdminRole(
  value: unknown,
): value is AssignableAdminRole {
  return (
    typeof value === "string" &&
    ASSIGNABLE_ADMIN_ROLES.some((role) => role === value)
  );
}

export function hasAdminPermission(
  role: AdminRole,
  permission: AdminPermission,
): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}
