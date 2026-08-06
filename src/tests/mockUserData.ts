import type { IAuthPayload, IUser } from "@/features/auth/services/auth";

export const mockUserPayload: IAuthPayload = {
  username: "testUser",
  password: "password123",
};

export const mockUser: IUser = {
  id: 1,
  username: "hoangpham1",
  isAdmin: false,
};
