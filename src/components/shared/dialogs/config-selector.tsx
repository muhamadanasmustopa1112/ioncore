"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import {
  Layout,
  Monitor,
  Moon,
  Palette,
  Scale,
  Settings,
  Square,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
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
  layout: "vertical" | "horizontal";
}

const brandColors = [
  { value: "default", label: "Default", color: "bg-primary" },
  { value: "dark", label: "Dark", color: "bg-zinc-950" },
  { value: "light", label: "Light", color: "bg-indigo-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "green", label: "Green", color: "bg-teal-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
];

const borderRadii = [
  { value: "none", label: "None" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

const scales = [
  { value: "xs", label: "Extra Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
];

export function ConfigSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ConfigState>({
    brand: "default",
    radius: "md",
    scale: "md",
    "content-layout": "centered",
    layout: "vertical",
  });
  const { setLayout } = useStore();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const setHtmlAttr = (key: "brand" | "radius" | "scale", value: string) => {
    document.documentElement.setAttribute(`data-theme-${key}`, value);
  };
  const setBodyAttr = (value: string) => {
    document.body.setAttribute("data-theme-content-layout", value);
  };

  const persist = (key: keyof ConfigState, value: string) => {
    // store keys aligned with existing reader keys
    if (key === "content-layout") {
      localStorage.setItem("contentLayout", value);
      return;
    }
    if (key === "layout") {
      localStorage.setItem("sidebar", value);
      return;
    }
    if (key === "brand") localStorage.setItem("brand", value);
    if (key === "radius") localStorage.setItem("radius", value);
    if (key === "scale") localStorage.setItem("scale", value);
  };

  const updateConfig = (key: keyof ConfigState, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    persist(key, value);

    if (key === "content-layout") {
      setBodyAttr(value);
      return;
    }
    if (key === "layout") {
      setLayout(value as "vertical" | "horizontal");
      return;
    }

    // brand / radius / scale
    setHtmlAttr(key as "brand" | "radius" | "scale", value);
  };

  useEffect(() => {
    const brand = localStorage.getItem("brand") || "default";
    const radius = localStorage.getItem("radius") || "md";
    const scale = localStorage.getItem("scale") || "md";
    const contentLayout = localStorage.getItem("contentLayout") || "centered";
    const layout =
      (localStorage.getItem("sidebar") as "vertical" | "horizontal") ||
      "vertical";

    // sync DOM attributes on first mount so tokens apply instantly
    setHtmlAttr("brand", brand);
    setHtmlAttr("radius", radius);
    setHtmlAttr("scale", scale);
    setBodyAttr(contentLayout);

    setConfig({
      brand,
      radius,
      scale,
      "content-layout": contentLayout,
      layout,
    });
  }, []);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed right-6 bottom-6 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className={cn(
                "h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl",
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "border-primary/20 border-2",
              )}
            >
              <Settings className="h-6 w-6" />
              <span className="sr-only">Open configuration panel</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="end"
            className="border-border/50 w-80 p-0 shadow-xl"
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
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Sun className="h-4 w-4" />
                    Theme
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={
                        resolvedTheme === "light" ? "primary" : "outline"
                      }
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="text-xs capitalize"
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={resolvedTheme === "dark" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="text-xs capitalize"
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="text-xs capitalize"
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>

                {/* Layout Config */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Palette className="h-4 w-4" />
                    Layout
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["vertical", "horizontal"].map((option) => (
                      <Button
                        key={option}
                        variant={
                          config["layout"] === option ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("layout", option)}
                        className="text-xs capitalize"
                      >
                        {option === "vertical" ? "Vertical" : "Horizontal"}
                      </Button>
                    ))}
                  </div>
                </div>

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
                      <SelectValue className="text-xs" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandColors.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-3 w-3 rounded-full",
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

                {/* Border Radius Config */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Square className="h-4 w-4" />
                    Border Radius
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {borderRadii.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          config.radius === option.value ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("radius", option.value)}
                        className="text-xs capitalize"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Scale Config */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Scale className="h-4 w-4" />
                    Scale
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {scales.map((option) => (
                      <Button
                        key={option.value}
                        variant={
                          config.scale === option.value ? "primary" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("scale", option.value)}
                        className="text-xs capitalize"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Content Layout Config */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Layout className="h-4 w-4" />
                    Content Layout
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
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
                        className="text-xs capitalize"
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
