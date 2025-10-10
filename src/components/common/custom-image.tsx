"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface CustomImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    "onError" | "onLoad" | "src"
  > {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  onError?: (error: Event) => void;
  onFallback?: (reason: "error" | "empty") => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  className?: string;
}

export function CustomImage({
  src,
  alt,
  fallbackSrc = "/media/avatars/blank.png",
  onError,
  onFallback,
  onLoad,
  className = "",
  ...props
}: CustomImageProps) {
  const [displaySrc, setDisplaySrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">(
    "idle",
  );
  const fallbackCalledRef = useRef<Set<string>>(new Set());
  const currentSrcRef = useRef<string | null>(null);

  const preloadImage = useCallback((imageSrc: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      // img.crossOrigin = "anonymous"; // Prevent CORS issues

      img.onload = () => resolve();
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageSrc}`));
      };

      img.src = imageSrc;
    });
  }, []);

  const handleImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setLoadState("loaded");
      setIsLoading(false);
      onLoad?.(event);
    },
    [onLoad],
  );

  useEffect(() => {
    // Reset state when src changes
    if (currentSrcRef.current !== src) {
      currentSrcRef.current = src || null;

      // Handle empty/null src
      if (!src || src.trim() === "") {
        setDisplaySrc(fallbackSrc);
        setLoadState("loaded");
        setIsLoading(false);

        const fallbackKey = `empty-${src || "null"}`;
        if (!fallbackCalledRef.current.has(fallbackKey)) {
          fallbackCalledRef.current.add(fallbackKey);
          onFallback?.("empty");
        }
        return;
      }

      // Start loading process
      setIsLoading(true);
      setLoadState("loading");

      // Preload the image
      preloadImage(src)
        .then(() => {
          // Image loaded successfully, safe to display
          if (currentSrcRef.current === src) {
            // Check if src hasn't changed
            setDisplaySrc(src);
            setLoadState("loaded");
            setIsLoading(false);
          }
        })
        .catch((error) => {
          // Image failed to load, use fallback
          if (currentSrcRef.current === src) {
            // Check if src hasn't changed
            setDisplaySrc(fallbackSrc);
            setLoadState("error");
            setIsLoading(false);

            const fallbackKey = `error-${src}`;
            if (!fallbackCalledRef.current.has(fallbackKey)) {
              fallbackCalledRef.current.add(fallbackKey);
              onFallback?.("error");
              onError?.(error as unknown as Event);
            }
          }
        });
    }
  }, [src, fallbackSrc, preloadImage, onFallback, onError]);

  // Clean up fallback tracking when component unmounts
  useEffect(() => {
    return () => {
      fallbackCalledRef.current.clear();
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-100">
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
          </div>
        </div>
      )}
      <img
        {...props}
        src={displaySrc || "/media/avatars/blank.png"}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-50" : "opacity-100"
        } transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={() => {
          // This should rarely trigger now since we preload
          // But it's here as a safety net
          if (displaySrc !== fallbackSrc) {
            setDisplaySrc(fallbackSrc);
            setLoadState("error");
            onFallback?.("error");
          }
        }}
      />
    </div>
  );
}
