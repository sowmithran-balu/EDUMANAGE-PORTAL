import { db } from "@/lib/db";

export class SettingsRepository {
  /**
   * Get user settings for a given category
   */
  static async getUserSettings(userId: string, category: string): Promise<any | null> {
    const record = await db.userSettings.findUnique({
      where: {
        userId_category: {
          userId,
          category
        }
      }
    });

    if (!record || !record.settings) return null;
    try {
      return JSON.parse(record.settings);
    } catch {
      return null;
    }
  }

  /**
   * Save or update user settings for a category
   */
  static async saveUserSettings(userId: string, category: string, settings: any) {
    const jsonStr = JSON.stringify(settings);
    return await db.userSettings.upsert({
      where: {
        userId_category: {
          userId,
          category
        }
      },
      update: {
        settings: jsonStr
      },
      create: {
        userId,
        category,
        settings: jsonStr
      }
    });
  }

  /**
   * Get institution settings (admin)
   */
  static async getInstitutionSettings(category: string): Promise<any | null> {
    const record = await db.institutionSettings.findUnique({
      where: { category }
    });

    if (!record || !record.settings) return null;
    try {
      return JSON.parse(record.settings);
    } catch {
      return null;
    }
  }

  /**
   * Save institution settings
   */
  static async saveInstitutionSettings(category: string, settings: any, updatedBy?: string) {
    const jsonStr = JSON.stringify(settings);
    return await db.institutionSettings.upsert({
      where: { category },
      update: {
        settings: jsonStr,
        updatedBy
      },
      create: {
        category,
        settings: jsonStr,
        updatedBy
      }
    });
  }

  /**
   * Log an audit event
   */
  static async logAudit(actorId: string, action: string, entity: string, oldValue?: string, newValue?: string) {
    try {
      return await db.auditLog.create({
        data: {
          actorId,
          action,
          entity,
          oldValue,
          newValue
        }
      });
    } catch (err) {
      console.error("Audit log failed:", err);
    }
  }

  /**
   * Get active user sessions
   */
  static async getUserSessions(userId: string) {
    return await db.userSession.findMany({
      where: { userId, revoked: false },
      orderBy: { lastSeen: "desc" }
    });
  }

  /**
   * Revoke all sessions for a user
   */
  static async revokeAllSessions(userId: string) {
    return await db.userSession.updateMany({
      where: { userId },
      data: { revoked: true }
    });
  }
}
