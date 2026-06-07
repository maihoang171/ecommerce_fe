import { registerService, loginService, checkAuthSessionService } from "../services/auth";
import type { RegisterInput, LoginInput } from "../schemas/authSchema";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";
import { extractErrorMsg } from "../utils/error";

export const useRegisterUser = () => {
    const handleRegisterUser = async (data: RegisterInput) => {
        const { confirmPassword: _confirmPassword, ...registerPayload } = data
        void _confirmPassword
        try {
            await registerService(registerPayload)
            toast.success("Register successfully", {
                position: "bottom-left"
            })
        } catch (error) {
            const errMsg = extractErrorMsg(error)

            toast.error(`Register failed: ${errMsg}`, {
                position: "bottom-left"
            });
        }
    }

    return {
        handleRegisterUser
    }
}

export const useLogin = () => {
    const loginAction = useAuthStore((state) => state.login)

    const handleLogin = async (data: LoginInput) => {
        try {
            const res = await loginService(data)
            const user = res.data
            loginAction(user)

            toast.success(`Welcome back, ${user.userName}! `, {
                position: "bottom-left"
            })
            return user
        } catch (error) {
            const errMsg = extractErrorMsg(error)

            toast.error("Login failed: " + errMsg, {
                position: "bottom-left"
            })
            throw error
        }
    }
    return { handleLogin }
}

export const useSyncAuthSession = () => {
    const loginAction = useAuthStore((state) => state.login)

    const handleSyncAuthSession = async () => {
        try {
            const res = await checkAuthSessionService()
            const user = res.data
            loginAction(user)
        } catch (error) {
            const errMsg = extractErrorMsg(error)

            toast.error(`Sync session failed: ${errMsg}`, {
                position: "bottom-left"
            });
        }
    }
    return { handleSyncAuthSession }
}