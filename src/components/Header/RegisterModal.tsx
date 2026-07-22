import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { Register } from "../AuthModals/Register";

export const RegisterModal = () => {
  const { authMode, close } = useAuthModalStore();

  return (
    <div className={`modal ${authMode === "register" ? "modal-open" : ""}`}>
      <div className="modal-box border border-base-300 bg-base-100">
        <Register />
      </div>
      <div className="modal-backdrop" onClick={close} />
    </div>
  );
};
