import { z } from "zod";

export const examFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(120, "Title cannot exceed 120 characters"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Exam image is required"),
  duration: z
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(300, "Duration cannot exceed 300 minutes"),
  diplomaId: z.string().min(1, "Diploma is required"),
});

export type ExamFormValues = z.infer<typeof examFormSchema>;
