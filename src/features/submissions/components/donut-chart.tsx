"use client";

interface DonutChartProps {
  correctCount: number;
  incorrectCount: number;
}

export function DonutChart({ correctCount, incorrectCount }: DonutChartProps) {
  const total = Math.max(1, correctCount + incorrectCount);
  const correctPercent = (correctCount / total) * 100;
  const incorrectPercent = (incorrectCount / total) * 100;

  const size = 180;
  const strokeWidth = 28;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // Segment stroke lengths
  const correctStroke = (correctPercent / 100) * circumference;
  const incorrectStroke = (incorrectPercent / 100) * circumference;

  return (
  <div className="flex flex-col items-center justify-center space-y-6 select-none">
  {/* SVG Donut Chart */}
  <div className="relative size-[180px] flex items-center justify-center">
  <svg
  width={size}
  height={size}
  viewBox={`0 0 ${size} ${size}`}
  className="-rotate-90 transform"
  >
  {/* Base Track */}
  <circle
  cx={center}
  cy={center}
  r={radius}
  fill="transparent"
  stroke="#f1f5f9"
  strokeWidth={strokeWidth}
  />

  {/* Correct Segment (Emerald Green) */}
  {correctCount > 0 && (
  <circle
  cx={center}
  cy={center}
  r={radius}
  fill="transparent"
  stroke="#00bc7d"
  strokeWidth={strokeWidth}
  strokeDasharray={`${correctStroke} ${circumference}`}
  strokeDashoffset={0}
  className="transition-all duration-700 ease-out"
  />
  )}

  {/* Incorrect Segment (Red) */}
  {incorrectCount > 0 && (
  <circle
  cx={center}
  cy={center}
  r={radius}
  fill="transparent"
  stroke="#ef4444"
  strokeWidth={strokeWidth}
  strokeDasharray={`${incorrectStroke} ${circumference}`}
  strokeDashoffset={-correctStroke}
  className="transition-all duration-700 ease-out"
  />
  )}
  </svg>
  </div>

  {/* Legend below the Donut Chart */}
  <div className="space-y-2 text-xs sm:text-sm font-mono">
  <div className="flex items-center gap-2.5">
  <div className="size-3.5 bg-[#00bc7d] shrink-0" />
  <span className="text-foreground">
  Correct: <span className="font-bold">{correctCount}</span>
  </span>
  </div>
  <div className="flex items-center gap-2.5">
  <div className="size-3.5 bg-[#ef4444] shrink-0" />
  <span className="text-foreground">
  Incorrect: <span className="font-bold">{incorrectCount}</span>
  </span>
  </div>
  </div>
  </div>
  );
}
