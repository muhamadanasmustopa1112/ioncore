"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function BrandedLayout({ children }: { children: ReactNode }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/media/signin/slide_1.jpg",
    "/media/signin/slide_2.jpeg",
    "/media/signin/slide_3.jpeg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="grid grow lg:grid-cols-1">
        <div className="order-2 flex items-center justify-center p-8 lg:order-1 lg:p-10">
          <Card className="w-full max-w-[1000px] overflow-hidden lg:h-[540px]">
            <CardContent className="p-0 flex items-stretch h-full">
              <div className="flex-1 relative overflow-hidden h-full">
                {slides.map((slide, index) => (
                  <Image
                    key={index}
                    src={toAbsoluteUrl(slide)}
                    fill
                    alt={`Slide ${index + 1}`}
                    className={`object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                  />
                ))}

                {/* Back to Website Button */}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                  <a
                    href="https://techletica.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    suppressHydrationWarning
                    className="px-3 py-1 text-xs md:text-sm bg-black/40 rounded-lg text-white hover:bg-black/60 transition"
                  >
                    ← Back to website
                  </a>
                </div>

                {/* Logo and Title - Bottom Left */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-20 max-w-[85%] md:max-w-md pr-4">
                  <h1 className="text-2xl md:text-3xl font-bold">All-in-One Padel Dashboard</h1>
                  <p className="text-sm md:text-lg opacity-80">
                    Track transactions, manage courts, and access key features easily.
                  </p>
                </div>

                {/* Slider Dots - Bottom Right */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      suppressHydrationWarning
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50 hover:bg-white"
                        }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 p-[40px] h-full">
                {children}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* <div className="lg:border-border xxl:bg-center branded-bg order-1 bg-top bg-no-repeat lg:order-2 lg:m-5 lg:rounded-xl lg:border xl:bg-cover">
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
        </div> */}
      </div>
    </>
  );
}
