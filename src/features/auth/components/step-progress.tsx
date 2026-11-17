interface StepProgressProps {
  currentStep: number; // 1, 2, 3, 4
  totalSteps?: number;
}

export function StepProgress({ currentStep, totalSteps = 4 }: StepProgressProps) {
  return (
    <div className="w-full flex items-center justify-between mb-8 select-none">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCurrentOrCompleted = stepNumber <= currentStep;
        const isLast = stepNumber === totalSteps;

        return (
          <div key={stepNumber} className="flex-1 flex items-center">
            {/* Diamond Node */}
            <div
              className={`size-2.5 rotate-45 transition-colors duration-200 shrink-0 ${
                isCurrentOrCompleted
                  ? "bg-primary"
                  : "border border-muted-foreground/40 bg-background"
              }`}
            />

            {/* Connecting line */}
            {!isLast && (
              <div
                className={`flex-1 mx-2 transition-colors duration-200 ${
                  stepNumber < currentStep
                    ? "h-0.5 bg-primary"
                    : "border-t border-dashed border-border"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
