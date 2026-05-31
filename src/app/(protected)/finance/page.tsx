import { redirect } from "next/navigation";
import { paths } from "@/config/paths";

export default function FinancePage() {
  redirect(paths.dashboard.finance.invoice.root.getHref());
}
