import { axiosClient } from "./axios";

interface IRegisterPayload {
    userName: string;
    password: string;
}

export const registerService = async (payload: IRegisterPayload) => {
    return await axiosClient.post("/auth/register", payload)
}

export const loginService = async (payload: IRegisterPayload) => {
    const res = await axiosClient.post("/auth/login", payload)
    return res.data
}

export const checkAuthSessionService = async () => {
    const res = await axiosClient.get("/auth/me")
    return res.data
}