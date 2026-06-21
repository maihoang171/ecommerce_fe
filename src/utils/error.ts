import { isAxiosError } from "axios";

export const extractErrorMsg = (error: unknown): string => {
  let errMsg = "Something went wrong";

  if (isAxiosError(error)) {
    console.log(error);
    errMsg = error.response?.data?.message || errMsg;
  } else if (error instanceof Error) {
    errMsg = error.message;
  }

  return errMsg;
};
