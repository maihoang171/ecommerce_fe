import z from "zod";

export const registerSchema = z.object({
    userName: z
        .string()
        .trim()
        .min(3, "Username must have at least 3 characters")
        .max(20, "Username must have at most 20 characters")
        .regex(
            /^[0-9a-zA-Z_-]+$/,
            "Username must not have special characters (except _ and -)",
        ),
    password: z
        .string()
        .trim()
        .min(8, "Password must have at least 8 characters")
        .regex(/[A-Z]/, "Password must have at least one uppercase letter")
        .regex(/[a-z]/, "Password must have at least one lowercase letter")
        .regex(/[0-9]/, "Password must have at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must have at least one special character"),

    confirmPassword: z.string().trim().min(1, "Please confirm your password")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof registerSchema>;