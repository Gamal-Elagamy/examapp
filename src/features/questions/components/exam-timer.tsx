"use client";

interface ExamTimerProps {
  formattedTime: string;
  progressPercentage: number;
  isTimeUp: boolean;
}

export function ExamTimer({
  formattedTime,
  progressPercentage,
  isTimeUp,
}: ExamTimerProps) {
  // SVG circular progress parameters
  const size = 52;
  const strokeWidth = 3.5;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const isLowTime = !isTimeUp && progressPercentage <= 10; // Under 10% remaining

  return (
    <div className="relative flex items-center justify-center shrink-0 select-none">
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        aria-hidden="true"
      >
        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#dbeafe"
          strokeWidth={strokeWidth}
        />
        {/* Progress Animated Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={isTimeUp || isLowTime ? "#ef4444" : "#155dfc"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>

      {/* Centered Timer Text */}
      <span
        className={`absolute font-mono text-[11px] font-bold tracking-tight ${
          isTimeUp || isLowTime ? "text-destructive animate-pulse" : "text-foreground"
        }`}
      >
        {formattedTime}
      </span>
    </div>
  );
}
