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
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleRegisterUser = async (data: RegisterInput) => {
    const { confirmPassword: _confirmPassword, ...registerPayload } = data;
    void _confirmPassword;

    setIsLoading(true);
    try {
      await registerService(registerPayload);

      setErrMsg(null);

      toast.success("Register successfully", {
        position: "bottom-right",
      });

      return true;
    } catch (error) {
      const msg = extractErrorMsg(error);
      setErrMsg(msg);

      console.error(`Register failed: ${msg}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleRegisterUser,
    isLoading,
    errMsg,
  };
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true);

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
      setErrMsg(null);

      toast.success(`Welcome back, ${user.username}!`, {
        position: "bottom-right",
      });

      return true;
    } catch (error) {
      const message = extractErrorMsg(error);
      setErrMsg(message);

      console.error("Login failed: " + message);

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, errMsg };
};

export const useSyncAuthSession = () => {
  const { setAuth } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSyncAuthSession = async () => {
    setIsLoading(true);
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

      return true;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        useAuthStore.getState().clearAuth();

        setIsCheckingAuth(false);

        return false;
      }

      const message = extractErrorMsg(error);
      toast.error(`Sync session failed: ${message}`, {
        position: "bottom-right",
      });

      return false;
    } finally {
      setIsCheckingAuth(false);
      setIsLoading(false);
    }
  };

  return { isCheckingAuth, handleSyncAuthSession, isLoading };
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    const user = useAuthStore.getState().user;
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };
  return { handleLogout, isLoading };
};
