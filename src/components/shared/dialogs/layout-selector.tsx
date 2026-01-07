"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import {
    BookOpen,
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
import { MENU } from "@/config/menu";

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

type ConfigSelectorProps = {
  buttonVariant?: "primary" | "mono" | "destructive" | "secondary" | "outline" | "dashed" | "ghost" | "dim" | "foreground" | "inverse";
  buttonSize?: "lg" | "md" | "sm" | "icon";
  buttonClassName?: string;
  buttonMode?: "default" | "icon" | "link" | "input";
};

export function LayoutSelector({ buttonVariant = "outline", buttonSize = "sm", buttonClassName = "", buttonMode = "icon" }: ConfigSelectorProps) {
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
  const router = useRouter();

  // Get Layout Experiences menu items
  const layoutExperiences = MENU.find(
    (item) => item.title === "Master Data"
  )?.children?.find(
    (child) => child.title === "Layout Experiences"
  )?.children || [];

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

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
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              mode={buttonMode}
              variant={buttonVariant}
              size={buttonSize}
              className={buttonClassName}
            >
              <BookOpen />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="end"
            className="border-border/50 w-80 p-0 shadow-xl"
            sideOffset={16}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layout className="h-5 w-5" />
                  Content Layout
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                {layoutExperiences.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 h-auto py-2.5 hover:bg-accent"
                      onClick={() => handleNavigate(item.path || item.title)}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4 shrink-0" />}
                      <span className="text-sm">{item.title}</span>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
    </>
  );
}
