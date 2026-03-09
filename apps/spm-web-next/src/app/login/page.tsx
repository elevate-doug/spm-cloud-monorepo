import { getTenants } from "@/lib/actions/auth";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default async function LoginPage() {
  // If already logged in, redirect to assembly
  const session = await getSession();
  if (session) {
    redirect("/assembly");
  }

  // Fetch tenants server-side - this data won't be visible in browser dev tools
  const tenants = await getTenants();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoginForm tenants={tenants} />
    </div>
  );
}
