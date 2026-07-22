export const ServerError = ({
  message = "Internal server error",
}: {
  message?: string;
}) => {
  return <div className="text-gray-500 p-8 text-center">{message}</div>;
};
