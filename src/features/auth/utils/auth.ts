export const getInitials = (username: string) => {
  const targetText = username || "U";
  return targetText.trim().charAt(0).toLocaleUpperCase();
};
