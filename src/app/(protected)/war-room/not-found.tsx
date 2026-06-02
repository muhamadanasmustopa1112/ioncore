import Link from "next/link";
import { paths } from "@/config/paths";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Link href={paths.dashboard.warRoom.root.getHref()}>
        <Button>Back to War Room</Button>
      </Link>
    </div>
  );
}
