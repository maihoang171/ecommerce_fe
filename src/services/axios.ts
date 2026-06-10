import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import type { ApiResponse, IUser } from "./auth"

export const axiosClient = axios.create({
    timeout: 60000,
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1"
})

const axiosRefresh = axios.create({
    timeout: 10000,
    withCredentials: true,
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1",
});

axiosClient.interceptors.response.use((res) => res,
    async (error) => {
        const originalReq = error.config
        if (error.response?.status === 401 && !originalReq._retry) {
            originalReq._retry = true

            try {
                const res = await axiosRefresh.get<ApiResponse<IUser>>("/auth/refresh-token")
                const accessToken = res.data.accessToken

                if (!accessToken) throw new Error("Refresh token expired")

                const currentUser = useAuthStore.getState().user
                if (currentUser) {
                    useAuthStore.getState().setAuth(currentUser, accessToken)
                }

                originalReq.headers.Authorization = `Bearer ${accessToken}`

                return axiosClient(originalReq)
            } catch (refreshErr) {
                useAuthStore.getState().clearAuth()
                return Promise.reject(refreshErr)
            }
        }

        return Promise.reject(error)
    })