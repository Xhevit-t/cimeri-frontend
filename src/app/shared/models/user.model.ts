export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  socialLink?: string | null;
  profilePictureUrl?: string | null;
  emailVerified: boolean;
  blocked?: boolean;
  roles?: string[];
  createdAt: string;
}

export type UserRole = 'ADMIN' | 'MODERATOR' | 'USER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  socialLink?: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalProperties: number;
  totalPosts: number;
  pendingReports: number;
  totalContactRequests: number;
  acceptedContactRequests: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
