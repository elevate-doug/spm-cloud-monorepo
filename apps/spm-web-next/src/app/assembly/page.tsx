import { getRecentBuilds } from "@/lib/actions/builds";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin-layout";
import AssemblyClient from "./assembly-client";

export default async function AssemblyPage() {
  // Ensure user is authenticated
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch builds server-side - this data won't be visible in browser Network tab
  const builds = await getRecentBuilds();

  // Separate by status
  const completedBuilds = builds.filter((b) => b.status === 2);
  const incompleteBuilds = builds.filter((b) => b.status !== 2);

  return (
    <AdminLayout pageTitle="Assembly" session={session}>
      <AssemblyClient
        completedBuilds={completedBuilds}
        incompleteBuilds={incompleteBuilds}
      />
    </AdminLayout>
  );
}
