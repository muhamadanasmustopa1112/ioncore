import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Provider from "@/components/layouts/context/provider";
import "@/styles/globals.css";
import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/layouts/context/theme-provider";
import { LayoutProvider } from "@/components/layouts/context/layout-context";
import { MAIN_NAV } from "@/config/layout-15.config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Metronic",
    default: "Metronic", // a default is required when creating a template
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      className="h-full"
      data-theme-brand="default"
      data-theme-radius="md"
      data-theme-scale="md"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "text-foreground bg-body-background group/layout flex h-full text-base antialiased",
          inter.className,
        )}
        data-theme-content-layout="centered"
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={0}>
              <Suspense>
                <Provider>{children}</Provider>
              </Suspense>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
