import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserSession } from "@/lib/userAuth";

export const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type UserRole =
  (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  VIEW_OWN_REQUESTS: "requests:view:own",
  CREATE_REQUEST: "requests:create",
  VIEW_ALL_REQUESTS: "requests:view:all",
  MANAGE_REQUESTS: "requests:manage",
  MANAGE_CONTENT: "content:manage",
  MANAGE_SERVICES: "services:manage",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<
  UserRole,
  readonly Permission[]
> = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_OWN_REQUESTS,
    PERMISSIONS.CREATE_REQUEST,
    PERMISSIONS.VIEW_ALL_REQUESTS,
    PERMISSIONS.MANAGE_REQUESTS,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_SERVICES,
  ],

  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_OWN_REQUESTS,
    PERMISSIONS.CREATE_REQUEST,
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
) {
  return (
    ROLE_PERMISSIONS[role]?.includes(permission) ??
    false
  );
}

export function getRolePermissions(
  role: UserRole
) {
  return ROLE_PERMISSIONS[role] ?? [];
}

export async function getCurrentUser() {
  const userId = await getUserSession();

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findById(userId).select(
    "_id name email role"
  );

  if (!user) {
    return null;
  }

  if (
    user.role !== ROLES.ADMIN &&
    user.role !== ROLES.EMPLOYEE
  ) {
    return null;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
  };
}

export async function userHasPermission(
  permission: Permission
) {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }

  return hasPermission(
    user.role,
    permission
  );
}