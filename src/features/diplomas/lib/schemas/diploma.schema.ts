import { z } from "zod";

export const diplomaFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .min(1, "Description is required"),
  image: z
    .string()
    .min(1, "Diploma image is required"),
});

export type DiplomaFormValues = z.infer<typeof diplomaFormSchema>;
