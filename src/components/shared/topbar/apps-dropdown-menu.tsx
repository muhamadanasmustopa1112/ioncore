import { ReactNode } from "react";
import Link from "next/link";
import { toAbsoluteUrl } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

interface DropdownAppsItem {
  logo: string;
  title: string;
  description: string;
  checkbox: boolean;
}

export function AppsDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const items: DropdownAppsItem[] = [
    {
      logo: "jira.svg",
      title: "Jira",
      description: "Project management",
      checkbox: false,
    },
    {
      logo: "inferno.svg",
      title: "Inferno",
      description: "Ensures healthcare app",
      checkbox: true,
    },
    {
      logo: "evernote.svg",
      title: "Evernote",
      description: "Notes management app",
      checkbox: true,
    },
    {
      logo: "gitlab.svg",
      title: "Gitlab",
      description: "DevOps platform",
      checkbox: false,
    },
    {
      logo: "google-webdev.svg",
      title: "Google webdev",
      description: "Building web experiences",
      checkbox: true,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[325px] p-0" side="bottom" align="end">
        <div className="text-secondary-foreground border-b-border flex items-center justify-between gap-2.5 border-b px-5 py-3 text-xs font-medium">
          <span>Apps</span>
          <span>Enabled</span>
        </div>
        <div className="scrollable-y-auto divide-border flex max-h-[400px] flex-col divide-y">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="bg-accent/60 border-border flex size-10 shrink-0 items-center justify-center rounded-full border">
                  <img
                    src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)}
                    className="size-6"
                    alt={item.title}
                  />
                </div>

                <div className="flex flex-col">
                  <a
                    href="#"
                    className="text-mono hover:text-primary-active text-sm font-semibold"
                  >
                    {item.title}
                  </a>
                  <span className="text-secondary-foreground text-xs font-medium">
                    {item.description}
                  </span>
                </div>
              </div>
              <Switch defaultChecked={item.checkbox} size="sm"></Switch>
            </div>
          ))}
        </div>
        <div className="border-t-border grid border-t p-5">
          <Button asChild variant="outline" size="sm">
            <Link href="#">Go to Apps</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
