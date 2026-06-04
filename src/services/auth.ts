import { axiosClient } from "./axios";

interface IRegisterPayload {
    userName: string;
    password: string;
}

export const registerService = async (payload: IRegisterPayload) => {
    return await axiosClient.post("/auth/register", payload)
}