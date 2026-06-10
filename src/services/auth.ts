import { axiosClient } from "./axios";

interface IAuthPayload {
  userName: string;
  password: string;
}

export interface IUser {
  id: string;
  userName: string;
  isAdmin: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
  accessToken?: string;
}

export const registerService = async (payload: IAuthPayload) => {
  const res = await axiosClient.post<ApiResponse<IUser>>(
    "/auth/register",
    payload,
  );
  return res.data;
};

export const loginService = async (payload: IAuthPayload) => {
  const res = await axiosClient.post<ApiResponse<IUser>>("/auth/login", payload);
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
  return await axiosClient.post("/auth/logout", userId);
};