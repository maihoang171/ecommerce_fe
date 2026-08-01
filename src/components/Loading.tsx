interface LoadingProps {
  className?: string;
}

export const Loading = ({ className = "h-[80vh]" }: LoadingProps) => {
  return (
    <div
      role="status"
      className={`loading loading-spinner loading-sm flex mx-auto ${className} justify-center items-center`}
    />
  );
};
