import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import AdminLayout from "@/components/admin-layout";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AdminLayout pageTitle={session.userName ?? "Profile"} session={session}>
      <ProfileClient session={session} />
    </AdminLayout>
  );
}
