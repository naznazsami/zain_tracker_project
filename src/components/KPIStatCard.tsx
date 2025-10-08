import { Card } from "@/components/ui/card";
import AnimatedNumber from "./AnimatedNumber";

type Variant = "neutral" | "primary" | "success" | "danger";

export default function KPIStatCard({ title, value, prefix, suffix, trendLabel, trendValue, variant = "neutral" }: {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trendLabel?: string;
  trendValue?: number;
  variant?: Variant;
}) {
  const styles: Record<Variant, { bg: string; ring: string; accent: string }> = {
    neutral: {
      bg: "bg-gradient-to-br from-secondary to-background",
      ring: "ring-1 ring-border",
      accent: "text-muted-foreground",
    },
    primary: {
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-500/0",
      ring: "ring-1 ring-blue-500/20",
      accent: "text-blue-600",
    },
    success: {
      bg: "bg-gradient-to-br from-green-500/10 to-green-500/0",
      ring: "ring-1 ring-green-500/20",
      accent: "text-green-600",
    },
    danger: {
      bg: "bg-gradient-to-br from-red-500/10 to-red-500/0",
      ring: "ring-1 ring-red-500/20",
      accent: "text-red-600",
    },
  };

  const variantStyles = styles[variant];

  return (
    <Card className={`p-4 md:p-6 hover:shadow-lg transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-2 ${variantStyles.bg} ${variantStyles.ring}`}>
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl md:text-3xl font-semibold">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
      </div>
      {typeof trendValue === "number" && (
        <div className="mt-2 text-xs md:text-sm">
          <span className={trendValue >= 0 ? styles.success.accent : styles.danger.accent}>
            {trendValue >= 0 ? "+" : ""}{trendValue}%
          </span>
          {trendLabel ? <span className="text-muted-foreground"> {trendLabel}</span> : null}
        </div>
      )}
    </Card>
  );
}


