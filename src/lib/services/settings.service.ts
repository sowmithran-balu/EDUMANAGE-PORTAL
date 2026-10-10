import { SettingsRepository } from "@/lib/repositories/settings.repo";
import { DEFAULT_SETTINGS } from "@/lib/defaults/settings.defaults";
import { SettingsSchemasByCategory } from "@/lib/validators/settings.schema";

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: ["profile", "appearance", "security", "notifications", "academics", "privacy", "language", "accessibility", "fees", "about"],
  parent: ["profile", "appearance", "security", "notifications", "language", "accessibility", "fees", "about"],
  teacher: ["profile", "appearance", "security", "notifications", "academics", "privacy", "language", "accessibility", "about"],
  admin: ["profile", "appearance", "security", "notifications", "academics", "privacy", "language", "accessibility", "fees", "admin", "about"],
};

export class SettingsService {
  /**
   * Verify if a role has access to a specific settings section
   */
  static isSectionAllowed(role: string, category: string): boolean {
    const allowed = ROLE_PERMISSIONS[role.toLowerCase()] || [];
    return allowed.includes(category);
  }

  /**
   * Get merged settings for a user (persisted DB settings + defaults)
   */
  static async getSettings(userId: string, category: string, role: string) {
    if (!this.isSectionAllowed(role, category)) {
      throw new Error(`Unauthorized: Role '${role}' cannot access '${category}' settings.`);
    }

    const defaultVals = DEFAULT_SETTINGS[category] || {};

    // For admin-only global category
    if (category === "admin") {
      const persistedAdmin = await SettingsRepository.getInstitutionSettings("general_admin");
      return { ...defaultVals, ...persistedAdmin };
    }

    const persisted = await SettingsRepository.getUserSettings(userId, category);
    return { ...defaultVals, ...persisted };
  }

  /**
   * Validate and save settings for a user
   */
  static async saveSettings(userId: string, category: string, role: string, incomingData: any) {
    if (!this.isSectionAllowed(role, category)) {
      throw new Error(`Unauthorized: Role '${role}' cannot modify '${category}' settings.`);
    }

    // Server-side Zod validation if schema exists
    const schema = SettingsSchemasByCategory[category];
    let validatedData = incomingData;
    if (schema) {
      const result = schema.safeParse(incomingData);
      if (!result.success) {
        throw new Error(`Validation Error: ${result.error.issues.map((e: any) => e.message).join(", ")}`);
      }
      validatedData = result.data;
    }

    // Save
    if (category === "admin" && role === "admin") {
      await SettingsRepository.saveInstitutionSettings("general_admin", validatedData, userId);
      await SettingsRepository.logAudit(userId, "UPDATE_INSTITUTION_SETTINGS", "Institution Settings", undefined, JSON.stringify(validatedData));
      return validatedData;
    }

    await SettingsRepository.saveUserSettings(userId, category, validatedData);

    if (category === "security") {
      await SettingsRepository.logAudit(userId, "UPDATE_SECURITY_SETTINGS", "User Security", undefined, "Security preferences updated");
    }

    return validatedData;
  }
}
