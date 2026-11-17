"use client";

import type { IQuestion, IAnswer } from "@/shared/lib/types/question";

interface QuestionCardProps {
  question: IQuestion;
  selectedAnswerId?: string;
  onSelectAnswer: (answerId: string) => void;
}

export function QuestionCard({
  question,
  selectedAnswerId,
  onSelectAnswer,
}: QuestionCardProps) {
  return (
    <div className="space-y-6">
      {/* Question Text */}
      <h2 className="text-lg sm:text-xl font-bold text-primary tracking-tight leading-snug">
        {question.text}
      </h2>

      {/* Answers Options List */}
      <div className="space-y-3" role="radiogroup" aria-label={question.text}>
        {question.answers.map((answer: IAnswer) => {
          const isSelected = selectedAnswerId === answer.id;

          return (
            <div
              key={answer.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onSelectAnswer(answer.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  onSelectAnswer(answer.id);
                }
              }}
              style={{
                backgroundColor: isSelected
                  ? "rgba(239, 246, 255, 1)"
                  : "rgba(248, 250, 252, 1)",
              }}
              className={`w-full rounded-xl p-4 sm:p-4.5 flex items-center gap-3.5 border transition-all duration-150 cursor-pointer select-none group ${
                isSelected
                  ? "border-primary shadow-2xs font-medium text-foreground"
                  : "border-transparent hover:border-primary/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Radio Indicator */}
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? "border-primary bg-white"
                    : "border-gray-300 bg-white group-hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <div className="size-2.5 rounded-full bg-primary" />
                )}
              </div>

              {/* Answer Text */}
              <span className="text-sm sm:text-base leading-relaxed">
                {answer.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
