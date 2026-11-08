import { describe, expect, it } from "vitest";

import {
  hasAdminPermission,
  isAdminRole,
} from "../../src/features/admin/auth/permissions";

describe("admin role validation", () => {
  it.each(["owner", "admin", "catalog_manager", "viewer"])(
    "accepts the %s role",
    (role) => {
      expect(isAdminRole(role)).toBe(true);
    },
  );

  it.each([null, undefined, "superadmin", "Owner", 1, {}])(
    "rejects invalid role values: %s",
    (role) => {
      expect(isAdminRole(role)).toBe(false);
    },
  );
});

describe("admin permission matrix", () => {
  it("grants owner all permissions", () => {
    for (const permission of [
      "dashboard:view",
      "catalog:read",
      "catalog:write",
      "audit:read",
      "admins:manage",
    ] as const) {
      expect(hasAdminPermission("owner", permission)).toBe(true);
    }
  });

  it("allows admin to manage catalog and read audit logs, but not admins", () => {
    expect(hasAdminPermission("admin", "catalog:write")).toBe(true);
    expect(hasAdminPermission("admin", "audit:read")).toBe(true);
    expect(hasAdminPermission("admin", "admins:manage")).toBe(false);
  });

  it("limits catalog_manager to dashboard and catalog", () => {
    expect(hasAdminPermission("catalog_manager", "dashboard:view")).toBe(true);
    expect(hasAdminPermission("catalog_manager", "catalog:write")).toBe(true);
    expect(hasAdminPermission("catalog_manager", "audit:read")).toBe(false);
    expect(hasAdminPermission("catalog_manager", "admins:manage")).toBe(false);
  });

  it("keeps viewer read-only", () => {
    expect(hasAdminPermission("viewer", "dashboard:view")).toBe(true);
    expect(hasAdminPermission("viewer", "catalog:read")).toBe(true);
    expect(hasAdminPermission("viewer", "catalog:write")).toBe(false);
    expect(hasAdminPermission("viewer", "audit:read")).toBe(false);
  });
});
