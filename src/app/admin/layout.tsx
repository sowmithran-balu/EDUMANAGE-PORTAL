import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import MainLayoutShell from "@/components/MainLayoutShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "admin") {
    redirect("/api/auth/logout");
  }

  return (
    <MainLayoutShell user={{ id: user.id, name: user.name, email: user.email, role: user.role }}>
      {children}
    </MainLayoutShell>
  );
}
