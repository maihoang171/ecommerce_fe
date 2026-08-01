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
import { extractErrorMsg } from "../../../utils/error";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { queryClient } from "@/main";
import { syncCartService } from "@/features/cart/services/cart";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data: RegisterInput) => {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      void _confirmPassword;

      return registerService(payload);
    },
    onSuccess: () => {
      toast.success("Register successfully", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      const msg = extractErrorMsg(error);
      console.error("Register failed: " + msg);
    },
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const res = await loginService(data);
      const user = res.data;
      const accessToken = res.accessToken;

      if (!user || !accessToken) {
        throw new Error("Invalid username, password, or missing token");
      }

      return { user, accessToken };
    },
    onSuccess: async ({ user, accessToken }) => {
      setAuth(user, accessToken);

      const localCart = useCartStore.getState().cart;

      if (localCart.length > 0) {
        try {
          await syncCartService(localCart);

          useCartStore.getState().clearLocalCart();
        } catch (syncError) {
          const msg = extractErrorMsg(syncError);
          console.error("Cart sync failed: " + msg);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success(`Welcome back, ${user.username}!`, {
        position: "bottom-right",
      });
    },

    onError: (error) => {
      const msg = extractErrorMsg(error);
      console.error("Login failed: " + msg);
    },
  });
};

export const useSyncAuthSession = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const refreshRes = await getRefreshTokenService();

      if (!refreshRes.success || !refreshRes.accessToken) {
        throw new Error("Session expired!");
      }

      const resSession = await checkAuthSessionService();
      const user = resSession.data;

      if (!resSession.success || !user) {
        throw new Error("User session not found!");
      }

      return { user, accessToken: refreshRes.accessToken };
    },

    onSuccess: async ({ user, accessToken }) => {
      setAuth(user, accessToken);
    },

    onError: (error) => {
      const msg = extractErrorMsg(error);

      toast.error(`Sync session failed: ${msg}`, {
        position: "bottom-right",
      });
    },
  });
};

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return;

      return await logoutService(currentUser.id);
    },

    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success("Logout successfully", {
        position: "bottom-right",
      });
      navigate("/");
    },

    onError: () => {
      clearAuth();
      queryClient.clear();
      toast.error("Server error, forced logout", { position: "bottom-right" });
      navigate("/");
    },
  });
};
