import { ReactNode } from "react";
import Link from "next/link";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";

export function BrandedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>
        {`
          .branded-bg {
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/1.png")}');
          }
          .dark .branded-bg {
            background-image: url('${toAbsoluteUrl("/media/images/2600x1600/1-dark.png")}');
          }
        `}
      </style>
      <div className="grid grow lg:grid-cols-2">
        <div className="order-2 flex items-center justify-center p-8 lg:order-1 lg:p-10">
          <Card className="w-full max-w-[400px]">
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>

        <div className="lg:border-border xxl:bg-center branded-bg order-1 bg-top bg-no-repeat lg:order-2 lg:m-5 lg:rounded-xl lg:border xl:bg-cover">
          <div className="flex flex-col gap-4 p-8 lg:p-16">
            <Link href="/">
              <img
                src={toAbsoluteUrl("/media/app/mini-logo.svg")}
                className="h-[28px] max-w-none"
                alt=""
              />
            </Link>

            <div className="flex flex-col gap-3">
              <h3 className="text-mono text-2xl font-semibold">
                Secure Dashboard Access
              </h3>
              <div className="text-secondary-foreground text-base font-medium">
                A robust authentication gateway ensuring
                <br /> secure&nbsp;
                <span className="text-mono font-semibold">
                  efficient user access
                </span>
                &nbsp;to the Metronic
                <br /> Dashboard interface.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
