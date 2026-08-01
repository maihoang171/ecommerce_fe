import { useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { useRegisterUser } from "@/features/auth/hooks/useAuth";
import { Loading } from "@/components/Loading";
import { extractErrorMsg } from "@/utils/error";

export const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const {
    mutate: handleRegisterUser,
    isPending,
    isError,
    error,
  } = useRegisterUser();

  const { openLogin, close } = useAuthModalStore();

  const handleRegisterSubmit = async (data: RegisterInput) => {
    handleRegisterUser(data, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-5">
      <h1 className="mb-3 text-xl">Create your new account</h1>
      <form
        onSubmit={handleSubmit(handleRegisterSubmit)}
        className="flex flex-col gap-5 justify-center"
      >
        <fieldset>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className={`input w-full ${errors.username ? "input-error" : ""}`}
            {...register("username")}
          />
          {errors.username && (
            <span className="error-message text-red-500 text-xs flex flex-col gap-1 mt-1 text-left">
              • {errors.username.message}
            </span>
          )}
        </fieldset>

        <fieldset className="flex flex-col gap-1">
          <input
            id="password"
            type="password"
            placeholder="Password"
            className={`input w-full ${errors.password ? "input-error" : ""}`}
            {...register("password")}
          />
          {errors.password?.types && (
            <div className="error-message text-red-500 text-xs flex flex-col gap-1 mt-1 text-left">
              {Object.values(errors.password.types)
                .flatMap((msg) => (Array.isArray(msg) ? msg : [msg]))
                .map((message, index) => (
                  <span key={index}>• {String(message)}</span>
                ))}
            </div>
          )}
        </fieldset>

        <fieldset>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            className={`input w-full ${errors.confirmPassword ? "input-error" : ""}`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.types && (
            <div className="error-message text-red-500 text-xs flex flex-col gap-1 mt-1 text-left">
              {Object.values(errors.confirmPassword.types).map((msg, index) => (
                <span key={index}>• {msg}</span>
              ))}
            </div>
          )}
        </fieldset>

        <button
          className="btn bg-black text-white w-full hover:bg-gray-700 transition-colors disabled:bg-gray-400"
          type="submit"
          disabled={isSubmitting}
        >
          Register
        </button>
      </form>

      <p className="text-center mt-2">
        Already have an account? Click{" "}
        <button
          type="button"
          onClick={openLogin}
          className="text-primary link link-hover lowercase"
        >
          here
        </button>{" "}
        to login.
      </p>
      {isPending && <Loading className="h-10" />}

      {isError && (
        <p className="text-center text-red-500">{extractErrorMsg(error)}</p>
      )}
    </div>
  );
};
