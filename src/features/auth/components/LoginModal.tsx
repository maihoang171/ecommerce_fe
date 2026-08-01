import { X } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";

export const LoginModal = () => {
  const { authMode, close } = useAuthModalStore();

  if (authMode !== "login") return;
  
  return (
    <div data-testid="login-modal" className={`modal modal-open`}>
      <div className="modal-box border border-base-300 bg-base-100">
        <button
          onClick={close}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          <X />
        </button>
        <LoginForm />
      </div>
      <div className="modal-backdrop" onClick={close} />
    </div>
  );
};
