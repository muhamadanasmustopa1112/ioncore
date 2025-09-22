import { redirect } from "next/navigation";
import { paths } from "@/config/paths";

export default function HomePage() {
  redirect(paths.auth.signin.getHref());
}
