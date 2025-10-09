import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  trend?: "up" | "down" | "neutral";
  color?: "blue" | "green" | "yellow" | "red" | "slate";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  change,
  trend = "neutral",
  color = "blue",
}) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return {
          bg: "bg-green-100",
          icon: "text-green-600",
          trend: "text-green-600",
        };
      case "yellow":
        return {
          bg: "bg-yellow-100",
          icon: "text-yellow-600",
          trend: "text-yellow-600",
        };
      case "red":
        return {
          bg: "bg-red-100",
          icon: "text-red-600",
          trend: "text-red-600",
        };
      case "slate":
        return {
          bg: "bg-slate-100",
          icon: "text-slate-600",
          trend: "text-slate-600",
        };
      default:
        return {
          bg: "bg-primary/10",
          icon: "text-primary",
          trend: "text-primary",
        };
    }
  };

  const colors = getColorClasses(color);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
          {change && (
            <div className={`flex items-center text-sm ${colors.trend}`}>
              {change}
            </div>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {value}
          </div>
          <div className="text-sm text-muted-foreground">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;