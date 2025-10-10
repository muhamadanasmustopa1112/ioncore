"use client";

import { useState } from "react";
import { Bolt, FolderSymlink, Radar, TrendingUp } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider, SliderThumb } from "@/components/ui/slider";

const tiers = [
  { name: "Lite", color: "#e879f9", points: 0, nextGoal: 1000 },
  { name: "Plus", color: "#8b5cf6", points: 1000, nextGoal: 2500 },
  { name: "Prime", color: "#3b82f6", points: 2500, nextGoal: 4250 },
  { name: "Gold", color: "#f59e0b", points: 4250, nextGoal: 5000 },
  { name: "VIP", color: "#ef4444", points: 5000, nextGoal: null },
];

const stats = [
  {
    icon: <Bolt className="text-secondary-foreground/70 h-5 w-5" />,
    title: "Current Points",
    subtitle: "Earned through actions",
    getValue: (currentPoints: number) => currentPoints.toLocaleString(),
  },
  {
    icon: <Radar className="text-secondary-foreground/70 h-5 w-5" />,
    title: "Next Tier Goal",
    subtitle: "Path to unlock next benefits",
    getValue: (currentPoints: number, nextGoal?: number | null) =>
      `${currentPoints.toLocaleString()}/${nextGoal?.toLocaleString() || "Max"}`,
  },
  {
    icon: <FolderSymlink className="text-secondary-foreground/70 h-5 w-5" />,
    title: "Progress Percentage",
    subtitle: "Tier growth vs last month",
    getValue: (currentPoints: number, nextGoal?: number | null) => {
      const progressPercentage = nextGoal
        ? Math.round((currentPoints / nextGoal) * 100)
        : 100;
      return (
        <div className="flex items-center gap-1">
          <Badge variant="success" size="sm" appearance="light">
            <TrendingUp className="mr-1 h-3 w-3" />
            4%
          </Badge>
          <span className="text-foreground text-sm font-medium">
            {progressPercentage}%
          </span>
        </div>
      );
    },
  },
];

export function EmployeeLoyaltyTier() {
  const [currentTierIndex, setCurrentTierIndex] = useState(3); // Gold tier
  const currentTier = tiers[currentTierIndex];
  const currentPoints = currentTier.points;
  const nextGoal = currentTier.nextGoal || currentTier.points;

  const handleSliderChange = (value: number[]) => {
    setCurrentTierIndex(value[0]);
  };

  return (
    <Card className="bg-accent/50 h-full rounded-md shadow-none">
      <CardContent className="flex h-full flex-col p-0">
        <h3 className="text-foreground py-2.5 ps-2 text-sm font-medium">
          Loyalty Tier
        </h3>
        <div className="bg-background border-input m-1 mt-0 flex h-full flex-col justify-between rounded-md border px-3.5 py-5">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="bg-background border-border flex size-[36px] shrink-0 items-center justify-center rounded-md border">
                  <div className="bg-accent/50 flex size-[30px] items-center justify-center rounded-md">
                    <img
                      src={toAbsoluteUrl(`/media/brand-logos/abstract-24.svg`)}
                      alt="image"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-1.5">
                  <h3 className="text-foreground text-2xl leading-6 font-semibold">
                    {currentTier.name}
                  </h3>
                  <span className="text-muted-foreground text-xs font-normal">
                    Level {currentTierIndex + 1}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Review
              </Button>
            </div>

            {/* Interactive Progress Bar */}
            <div className="space-y-3">
              <div className="relative">
                {/* Background gradient bar */}
                <Slider
                  value={[currentTierIndex]}
                  onValueChange={handleSliderChange}
                  max={4}
                  min={0}
                  step={1}
                  className="relative flex h-1.5 w-full items-center"
                >
                  {/* Full gradient track */}
                  <div className="absolute h-1.5 w-full rounded-sm bg-gradient-to-r from-pink-500 via-blue-500 via-green-400 via-yellow-400 to-orange-500" />

                  <SliderThumb className="bg-primary" />
                </Slider>
              </div>

              {/* Tier labels */}
              <div className="flex justify-between text-sm">
                {tiers.map((tier, index) => (
                  <span
                    key={tier.name}
                    className={`${index === currentTierIndex ? "font-medium" : "text-muted-foreground"}`}
                  >
                    {tier.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Card className="bg-accent/50 flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-md shadow-none">
                      {stat.icon}
                    </Card>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-foreground text-2sm font-medium">
                        {stat.title}
                      </span>
                      <span className="text-muted-foreground text-xs font-normal">
                        {stat.subtitle}
                      </span>
                    </div>
                  </div>
                  <div className="text-foreground text-sm font-medium">
                    {index === 0 && stat.getValue(currentPoints)}
                    {index === 1 && stat.getValue(currentPoints, nextGoal)}
                    {index === 2 && stat.getValue(currentPoints, nextGoal)}
                  </div>
                </div>
                {index < stats.length - 1 && <Separator className="my-3.5" />}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
