"use client";

import { useState } from "react";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Upload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-accent/70 border-border flex h-[240px] w-full items-center justify-center rounded-lg border">
        <div className="relative flex h-full w-full items-center justify-center">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <UserIcon className="text-muted-foreground/60 size-[40px]" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="category-image-upload"
          />
          <label
            htmlFor="category-image-upload"
            className="absolute right-3 bottom-3"
          >
            <Button size="sm" variant="outline" asChild>
              <span>Upload</span>
            </Button>
          </label>
        </div>
      </div>

      {/* Company */}
      <div className="">
        {[
          { label: "Company", value: "HorizonTech" },
          { label: "Email", value: "j.dejong@htech.com" },
          { label: "Phone No.", value: "+31 6 1234 5678" },
          {
            label: "Country",
            value: (
              <div className="flex items-center gap-1.5">
                <img
                  src={toAbsoluteUrl(`/media/flags/netherlands.svg`)}
                  alt="Netherlands flag"
                  className="h-4 w-4"
                />
                <span>Netherlands</span>
              </div>
            ),
          },
          { label: "Time Zone", value: "CET, Amsterdam" },
        ].map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between">
              <span className="text-secondary-foreground/80 text-xs font-normal">
                {item.label}
              </span>
              {item.label === "Email" ? (
                <Link
                  href={"#"}
                  className="text-2sm text-foreground hover:text-primary font-normal"
                >
                  {item.value}
                </Link>
              ) : (
                <span className="text-2sm text-foreground font-normal">
                  {item.value}
                </span>
              )}
            </div>
            {index < 4 && <Separator className="my-2.5" />}
          </div>
        ))}
      </div>
    </div>
  );
}
