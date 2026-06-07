export const getInitials = (userName: string) => {
    const targetText = userName || "U"
    return targetText.trim().charAt(0).toLocaleUpperCase()
}