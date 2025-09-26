"use client";

import { useEffect, useState } from "react";
import { Layout, Palette, Scale, Settings, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfigState {
  brand: string;
  radius: string;
  scale: string;
  "content-layout": string;
}

const brandColors = [{ value: "wit", label: "WIT", color: "bg-primary" }];

export function ConfigSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfigState>({
    brand: "wit",
    radius: "md",
    scale: "md",
    "content-layout": "centered",
  });

  const updateConfig = (key: keyof ConfigState, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));

    if (key === "content-layout") {
      document.body.setAttribute("data-theme-content-layout", value);
      return;
    }

    document.documentElement.setAttribute(`data-theme-${key}`, value);
  };

  useEffect(() => {
    const brand = localStorage.getItem("brand") || "wit";
    const radius = localStorage.getItem("radius") || "md";
    const scale = localStorage.getItem("scale") || "md";
    const contentLayout = localStorage.getItem("contentLayout") || "centered";

    setConfig({ brand, radius, scale, "content-layout": contentLayout });
  }, []);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "border-2 border-primary/20",
              )}
            >
              <Settings className="h-6 w-6" />
              <span className="sr-only">Open configuration panel</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="end"
            className="w-80 p-0 shadow-xl border-border/50"
            sideOffset={16}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Brand Color Config */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4" />
                    Brand Color
                  </Label>
                  <Select
                    value={config.brand}
                    onValueChange={(value) => updateConfig("brand", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brandColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-3 h-3 rounded-full",
                                color.color,
                              )}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Square className="h-4 w-4" />
                    Border Radius
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {["none", "sm", "md", "lg", "xl"].map((option) => (
                      <Button
                        key={option}
                        variant={
                          config.radius === option ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("radius", option)}
                        className="uppercase"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Scale className="h-4 w-4" />
                    Scale
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["xs", "md", "lg"].map((option) => (
                      <Button
                        key={option}
                        variant={
                          config.scale === option ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("scale", option)}
                        className="uppercase"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Layout className="h-4 w-4" />
                    Layout
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["centered", "boxed"].map((option) => (
                      <Button
                        key={option}
                        variant={
                          config["content-layout"] === option
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("content-layout", option)}
                        className="capitalize"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
