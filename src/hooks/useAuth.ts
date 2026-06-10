import {
  registerService,
  loginService,
  getRefreshTokenService,
  checkAuthSessionService
} from "../services/auth";
import type { RegisterInput, LoginInput } from "../schemas/authSchema";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";
import { extractErrorMsg } from "../utils/error";
import { useState } from "react";

export const useRegisterUser = () => {
  const handleRegisterUser = async (data: RegisterInput) => {
    const { confirmPassword: _confirmPassword, ...registerPayload } = data;
    void _confirmPassword;
    try {
      await registerService(registerPayload);
      toast.success("Register successfully", {
        position: "bottom-left",
      });
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error(`Register failed: ${errMsg}`, {
        position: "bottom-left",
      });
    }
  };

  return {
    handleRegisterUser,
  };
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await loginService(data);
      const user = res.data;
      const accessToken = res.accessToken;

      if (!user) {
        throw new Error("User not found");
      }

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      setAuth(user, accessToken);

      toast.success(`Welcome back, ${user.userName}! `, {
        position: "bottom-left",
      });

      return user;
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error("Login failed: " + errMsg, {
        position: "bottom-left",
      });
      throw error;
    }
  };

  return { handleLogin };
};

export const useSyncAuthSession = () => {
  const { setAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const handleSyncAuthSession = async () => {
    try {
      const refreshRes = await getRefreshTokenService();

      if (!refreshRes.success || !refreshRes.accessToken) {
        throw new Error("Session expired.");
      }

      const newAccessToken = refreshRes.accessToken;

      const resSession = await checkAuthSessionService();
      const user = resSession.data;

      if (!resSession.success || !user) {
        throw new Error("User not found");
      }


      setAuth(user, newAccessToken);
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error(`Sync session failed: ${errMsg}`, {
        position: "bottom-left",
      });
    } finally {
      setIsCheckingAuth(false)
    }
  };

  return { isCheckingAuth, handleSyncAuthSession };
};
