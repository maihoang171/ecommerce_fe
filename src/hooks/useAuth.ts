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
      const errMsg = extractErrorMsg(error);

      toast.error(`Sync session failed: ${errMsg}`, {
        position: "bottom-left",
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
        position: "bottom-left",
      });

      navigate("/");
      return;
    }

    try {
      await logoutService(user.id);
      clearAuth();

      toast.success("Logout successfully", {
        position: "bottom-left",
      });

      navigate("/");
    } catch (error) {
      const errMsg = extractErrorMsg(error);
      console.error(errMsg);

      clearAuth();

      toast.error("Server error, forced log out", {
        position: "bottom-left",
      });

      navigate("/");
    }
  };

  return { handleLogout };
};
