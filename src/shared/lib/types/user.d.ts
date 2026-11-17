import { USER_ROLES } from "../constants/api.constant";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}
