import { X } from "lucide-react";
import { Login } from "../AuthModals/Login";
import { useAuthModalStore } from "@/stores/useAuthModalStore";

export const LoginModal = () => {
  const { authMode, close } = useAuthModalStore();

  return (
    <div
      data-testid="login-modal"
      className={`modal ${authMode === "login" ? "modal-open" : ""}`}
    >
      <div className="modal-box border border-base-300 bg-base-100">
        <button
          onClick={close}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          <X />
        </button>
        <Login />
      </div>
      <div className="modal-backdrop" onClick={close} />
    </div>
  );
};
