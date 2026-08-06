import { axiosClient } from "@/services/axios";
import type { ApiResponse } from "@/services/type";

export interface IAuthPayload {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  username: string;
  isAdmin: boolean;
}

export const registerService = async (payload: IAuthPayload) => {
  const res = await axiosClient.post<ApiResponse<IUser>>(
    "/auth/register",
    payload,
  );
  return res.data;
};

export const loginService = async (payload: IAuthPayload) => {
  const res = await axiosClient.post<ApiResponse<IUser>>(
    "/auth/login",
    payload,
  );
  return res.data;
};

export const checkAuthSessionService = async () => {
  const res = await axiosClient.get<ApiResponse<IUser>>("/auth/me");
  return res.data;
};

export const getRefreshTokenService = async () => {
  const res = await axiosClient.get<ApiResponse<IUser>>("/auth/refresh-token");
  return res.data;
};

export const logoutService = async (userId: string) => {
  const res = await axiosClient.post<ApiResponse<null>>("/auth/logout", {
    userId,
  });
  return res.data;
};
