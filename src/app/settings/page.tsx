import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SettingsService, ROLE_PERMISSIONS } from "@/lib/services/settings.service";
import SettingsWorkspace from "@/components/SettingsWorkspace";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Pre-load allowed categories for this user
  const allowedCategories = ROLE_PERMISSIONS[user.role.toLowerCase()] || ["profile"];
  const initialSettings: Record<string, any> = {};

  await Promise.all(
    allowedCategories.map(async (cat) => {
      try {
        initialSettings[cat] = await SettingsService.getSettings(user.id, cat, user.role);
      } catch {}
    })
  );

  return (
    <SettingsWorkspace
      user={{ id: user.id, name: user.name, email: user.email, role: user.role }}
      initialCategory="profile"
      initialSettings={initialSettings}
    />
  );
}
