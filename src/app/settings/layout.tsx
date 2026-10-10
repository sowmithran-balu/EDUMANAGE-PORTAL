import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import MainLayoutShell from "@/components/MainLayoutShell";

export const metadata = {
  title: "Settings — Aether Academy",
  description: "Account settings, theme customization, academic preferences, and security management."
};

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <MainLayoutShell user={{ id: user.id, name: user.name, email: user.email, role: user.role }}>
      {children}
    </MainLayoutShell>
  );
}
