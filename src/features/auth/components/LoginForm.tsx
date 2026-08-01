import { useForm } from "react-hook-form";
import {
  baseAuthSchema,
  type LoginInput,
} from "@/features/auth/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { useLogin } from "@/features/auth/hooks/useAuth";
import { Loading } from "@/components/Loading";
import { extractErrorMsg } from "@/utils/error";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(baseAuthSchema),
    mode: "onChange",
    criteriaMode: "all",
  });

  const { openRegister, close } = useAuthModalStore();
  const { mutate: handleLogin, isPending, isError, error } = useLogin();

  const handleLoginSubmit = (data: LoginInput) => {
    handleLogin(data, {
      onSuccess: () => {
        close();
      },
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-5">
      <h1 className="mb-3 text-xl" arial-label="Login">
        Welcome back!
      </h1>

      <form
        className="flex flex-col gap-5 justify-center"
        onSubmit={handleSubmit(handleLoginSubmit)}
      >
        <fieldset>
          <input
            id="username"
            className={`input w-full ${errors.username ? "input-error" : ""}`}
            type="text"
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <span className="error-message text-red-500 text-xs flex flex-col gap-1 mt-1 text-left">
              • {errors.username.message}
            </span>
          )}
        </fieldset>

        <fieldset>
          <input
            id="password"
            type="password"
            className={`input w-full ${errors.password ? "input-error" : ""}`}
            placeholder="Password"
            {...register("password")}
          />
          {errors.password?.types && (
            <div className="error-message text-red-500 text-xs flex flex-col gap-1 mt-1 text-left">
              {Object.values(errors.password.types)
                .flatMap((msg) => (Array.isArray(msg) ? msg : [msg]))
                .map((msg, index) => (
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
          Login
        </button>
      </form>
      <p className="text-center m-2">
        Don't have an account? Register{" "}
        <button
          type="button"
          onClick={openRegister}
          className="text-primary link link-hover lowercase"
        >
          here
        </button>
        .
      </p>

      {isPending && <Loading className="h-10" />}

      {isError && (
        <p className="text-center text-red-500">{extractErrorMsg(error)}</p>
      )}
    </div>
  );
};
