import { registerService } from "../services/auth";
import type { RegisterInput } from "../schemas/authSchema";
import { toast } from "sonner";

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
            toast.error("Register failed: " + error, {
                position: "bottom-left"
            })
        }
    }
    return {
        handleRegisterUser
    }
}