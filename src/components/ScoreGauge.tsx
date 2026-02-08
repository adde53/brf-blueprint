import { getScoreColor, getScoreLabel, getScoreBgColor } from "@/data/brfData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ScoreGaugeProps {
  score: number;
  label: string;
  tooltip: string;
  size?: "sm" | "lg";
}

export function ScoreGauge({ score, label, tooltip, size = "sm" }: ScoreGaugeProps) {
  const isLarge = size === "lg";
  const radius = isLarge ? 60 : 40;
  const stroke = isLarge ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const colorClass = getScoreColor(score);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex flex-col items-center gap-2 ${getScoreBgColor(score)} rounded-2xl p-4 transition-all hover:shadow-card-hover cursor-help`}>
          <svg width={svgSize} height={svgSize} className="-rotate-90">
            <circle
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={stroke}
            />
            <circle
              cx={radius + stroke}
              cy={radius + stroke}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              className={`${colorClass} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="flex flex-col items-center -mt-2">
            <span className={`${isLarge ? "text-3xl" : "text-2xl"} font-bold ${colorClass}`}>
              {score}
            </span>
            <span className={`text-xs font-medium ${colorClass}`}>{getScoreLabel(score)}</span>
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs bg-card text-card-foreground">
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}
