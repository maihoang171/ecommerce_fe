import {
  registerService,
  loginService,
  getRefreshTokenService,
  checkAuthSessionService,
  logoutService,
} from "../services/auth";
import type { RegisterInput, LoginInput } from "../schemas/authSchema";
import { toast } from "sonner";
import { useAuthStore } from "../stores/useAuthStore";
import { extractErrorMsg } from "../utils/error";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

export const useRegisterUser = () => {
  const handleRegisterUser = async (data: RegisterInput) => {
    const { confirmPassword: _confirmPassword, ...registerPayload } = data;
    void _confirmPassword;
    try {
      await registerService(registerPayload);
      toast.success("Register successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error(`Register failed: ${errMsg}`, {
        position: "bottom-right",
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
        throw new Error("Invalid username or password");
      }

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      setAuth(user, accessToken);

      toast.success(`Welcome back, ${user.username}!`, {
        position: "bottom-right",
      });

      return user;
    } catch (error) {
      const errMsg = extractErrorMsg(error);

      toast.error("Login failed: " + errMsg, {
        position: "bottom-right",
      });
      throw error;
    }
  };

  return { handleLogin };
};

export const useSyncAuthSession = () => {
  const { setAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

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
      if (isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().clearAuth();

        setIsCheckingAuth(false);

        return;
      }

      const errMsg = extractErrorMsg(error);
      toast.error(`Sync session failed: ${errMsg}`, {
        position: "bottom-right",
      });
    } finally {
      setIsCheckingAuth(false);
    }
  };

  return { isCheckingAuth, handleSyncAuthSession };
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const user = useAuthStore.getState().user;

    if (!user) {
      clearAuth();
      toast.success("Session cleared. Logged out", {
        position: "bottom-right",
      });

      navigate("/");
      return;
    }

    try {
      await logoutService(user.id);

      clearAuth();

      toast.success("Logout successfully", {
        position: "bottom-right",
      });

      navigate("/");
    } catch (error) {
      const errMsg = extractErrorMsg(error);
      console.error(errMsg);

      clearAuth();

      toast.error("Server error, forced logout", {
        position: "bottom-right",
      });

      navigate("/");
    }
  };

  return { handleLogout };
};
