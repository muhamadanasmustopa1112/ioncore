import { Suspense } from "react";
import { Metadata } from "next";
import { ScreenLoader } from "@/components/common/screen-loader";
import { ProductsPage } from "@/features/products/components";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage broadband plans, add-ons, and enterprise services.",
};

export default function Page() {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <ProductsPage />
    </Suspense>
  );
}
