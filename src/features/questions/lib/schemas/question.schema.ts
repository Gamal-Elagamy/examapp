import { z } from "zod";

export const answerItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1, "Answer body is required"),
  isCorrect: z.boolean().default(false),
});

export const questionFormSchema = z
  .object({
    examId: z.string().min(1, "Exam is required"),
    text: z.string().trim().min(1, "Question headline is required"),
    answers: z
      .array(answerItemSchema)
      .min(1, "At least one answer is required")
      .max(4, "Answers cannot be more than 4"),
  })
  .refine((data) => data.answers.some((ans) => ans.isCorrect), {
    message: "One correct answer must exist.",
    path: ["answers"],
  });

export type AnswerItem = z.infer<typeof answerItemSchema>;
export type QuestionFormValues = z.infer<typeof questionFormSchema>;
