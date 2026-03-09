import { getBuild, resumeBuild } from "@/lib/actions/builds";
import { getSession } from "@/lib/auth/session";
import { redirect, notFound } from "next/navigation";
import AdminLayout from "@/components/admin-layout";
import BuildScreenClient from "./build-screen-client";

interface BuildScreenPageProps {
  params: Promise<{ id: string }>;
}

export default async function BuildScreenPage({ params }: BuildScreenPageProps) {
  const { id } = await params;

  // Ensure user is authenticated
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch build details server-side
  let build;
  try {
    build = await getBuild(id);
  } catch {
    notFound();
  }

  // Resume build if not completed
  if (build.status !== 2) {
    try {
      await resumeBuild(id);
    } catch {
      // Ignore resume errors
    }
  }

  return (
    <AdminLayout pageTitle={build.name} session={session}>
      <BuildScreenClient build={build} />
    </AdminLayout>
  );
}
