import { redirect } from "next/navigation";

export default function AdminLogiRedirectPage() {
  redirect("/admin/login");
}
