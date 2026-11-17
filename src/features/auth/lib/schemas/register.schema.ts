import { z } from "zod";

// Step 1: Email
export const emailStepSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
});
export type EmailStepData = z.infer<typeof emailStepSchema>;

// Step 2: OTP
export const otpStepSchema = z.object({
  code: z
    .string()
    .trim()
    .min(5, "Verification code must be at least 5 characters")
    .max(6, "Verification code must be at most 6 characters"),
});
export type OtpStepData = z.infer<typeof otpStepSchema>;

// Step 3: User Info
export const userInfoStepSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters"),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters"),
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Phone must contain digits only"),
});
export type UserInfoStepData = z.infer<typeof userInfoStepSchema>;

// Step 4: Password
export const passwordStepSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type PasswordStepData = z.infer<typeof passwordStepSchema>;

// Full Form Schema
export const registerSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address"),
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
    phone: z.string().trim().min(10, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
