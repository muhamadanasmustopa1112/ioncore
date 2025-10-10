import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

const MegaMenuFooter = () => {
  return (
    <div className="border-border lg:border-t-border bg-muted/50 flex flex-wrap items-center gap-2.5 rounded-xl border px-4 py-4 lg:justify-between lg:rounded-t-none lg:border-0 lg:border-t lg:px-7.5 lg:py-5">
      <div className="flex flex-col gap-1.5">
        <div className="text-mono text-base leading-none font-semibold">
          Read to Get Started ?
        </div>
        <div className="fomt-medium text-secondary-foreground text-sm">
          Take your docs to the next level of Metronic
        </div>
      </div>
      <NavigationMenuLink>
        <Button variant="mono" asChild>
          <Link href="https://keenthemes.com/metronic" target="_blank">
            Read Documentation
          </Link>
        </Button>
      </NavigationMenuLink>
    </div>
  );
};

export { MegaMenuFooter };
