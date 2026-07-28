import { isAxiosError } from "axios";

export const extractErrorMsg = (error: unknown): string => {
  let errMsg = "Something went wrong";

  if (isAxiosError(error)) {
    errMsg = error.response?.data?.message || errMsg;
    console.log(error.response?.data?.message);
  } else if (error instanceof Error) {
    errMsg = error.message;
  }

  return errMsg;
};
