import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { RegisterForm } from "./RegisterForm";

export const RegisterModal = () => {
  const { authMode, close } = useAuthModalStore();

  if (authMode !== "register") return; 

  return (
    <div className={`modal modal-open`}>
      <div className="modal-box border border-base-300 bg-base-100">
        <RegisterForm />
      </div>
      <div className="modal-backdrop" data-testid="back-drop" onClick={close} />
    </div>
  );
};
