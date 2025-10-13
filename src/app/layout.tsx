import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Provider from "@/components/layouts/context/provider";
import "@/styles/globals.css";
import { ReactNode, Suspense } from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
      data-theme-brand="wit"
      data-theme-radius="md"
      data-theme-scale="md"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "text-foreground bg-background group/layout flex text-base antialiased",
          inter.className,
        )}
        data-theme-content-layout="centered"
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="nextjs-theme"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
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
