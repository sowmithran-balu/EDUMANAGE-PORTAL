import { z } from "zod";

export const ProfileSettingsSchema = z.object({
  photoUrl: z.string().optional().default(""),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  rollNumber: z.string().default("2024CS104"),
  registerNumber: z.string().default("312424104042"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is too short").default("+91 98401 23456"),
  dob: z.string().default("2004-05-18"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).default("female"),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).default("O+"),
  address: z.string().default("142 Scholars Boulevard, Tech City, Chennai - 600028"),
  department: z.string().default("Computer Science & Engineering"),
  year: z.string().default("3rd Year"),
  section: z.string().default("Section B"),
  batch: z.string().default("2024 - 2028"),
  guardianName: z.string().default("Robert Mercer"),
  guardianRelation: z.string().default("Father"),
  guardianPhone: z.string().default("+91 98401 98765"),
  emergencyContact: z.string().default("+91 98401 98765")
});

export const AppearanceSettingsSchema = z.object({
  mode: z.enum(["light", "dark", "system"]).default("light"),
  primaryColor: z.enum(["navy", "teal", "indigo", "emerald", "rose"]).default("teal"),
  customColor: z.string().default("#0d9488"),
  fontFamily: z.enum(["sans", "serif", "mono"]).default("sans"),
  fontSize: z.enum(["small", "medium", "large"]).default("medium"),
  layoutDensity: z.enum(["compact", "comfortable"]).default("comfortable"),
  sidebarStyle: z.enum(["expanded", "collapsed", "icon_only"]).default("expanded"),
  borderRadius: z.enum(["sharp", "rounded", "pill"]).default("rounded")
});

export const SecuritySettingsSchema = z.object({
  twoFactorEnabled: z.boolean().default(false),
  twoFactorMethod: z.enum(["email", "authenticator"]).default("email"),
  loginAlerts: z.boolean().default(true),
  emailVerified: z.boolean().default(true),
  phoneVerified: z.boolean().default(true)
});

export const NotificationsSettingsSchema = z.object({
  channels: z.object({
    inApp: z.boolean().default(true),
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true)
  }).default({ inApp: true, email: true, sms: false, push: true }),
  categories: z.object({
    attendanceAlerts: z.boolean().default(true),
    feeReminders: z.boolean().default(true),
    examSchedule: z.boolean().default(true),
    resultsPublished: z.boolean().default(true),
    assignmentsDue: z.boolean().default(true),
    circulars: z.boolean().default(true),
    timetableChanges: z.boolean().default(true)
  }).default({
    attendanceAlerts: true,
    feeReminders: true,
    examSchedule: true,
    resultsPublished: true,
    assignmentsDue: true,
    circulars: true,
    timetableChanges: true
  }),
  quietHours: z.object({
    enabled: z.boolean().default(false),
    from: z.string().default("22:00"),
    to: z.string().default("07:00")
  }).default({ enabled: false, from: "22:00", to: "07:00" }),
  digestFrequency: z.enum(["instant", "daily", "weekly"]).default("instant")
});

export const AcademicPreferencesSchema = z.object({
  defaultLandingPage: z.enum(["dashboard", "timetable", "attendance", "courses"]).default("dashboard"),
  defaultSemesterView: z.enum(["current", "previous", "all"]).default("current"),
  gradeDisplay: z.enum(["cgpa", "percentage"]).default("cgpa"),
  timetableView: z.enum(["week", "day"]).default("week"),
  weekStart: z.enum(["monday", "sunday"]).default("monday"),
  calendarSyncEnabled: z.boolean().default(true)
});

export const PrivacySettingsSchema = z.object({
  profileVisibility: z.enum(["classmates", "teachers_only", "private"]).default("classmates"),
  showPhoneToPeers: z.boolean().default(false),
  showEmailToPeers: z.boolean().default(true),
  allowDirectorySearch: z.boolean().default(true)
});

export const LanguageSettingsSchema = z.object({
  language: z.enum(["en", "ta", "hi"]).default("en"),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]).default("DD/MM/YYYY"),
  timeFormat: z.enum(["12h", "24h"]).default("12h"),
  timeZone: z.string().default("Asia/Kolkata")
});

export const AccessibilitySettingsSchema = z.object({
  highContrast: z.boolean().default(false),
  reduceAnimations: z.boolean().default(false),
  largerText: z.boolean().default(false),
  keyboardShortcuts: z.boolean().default(true)
});

export const FeesSettingsSchema = z.object({
  autoReminderDays: z.number().default(5),
  receiptEmailPreference: z.boolean().default(true),
  savedPaymentMethodDefault: z.string().default("card_visa_4242")
});

export const AdminSettingsSchema = z.object({
  institution: z.object({
    name: z.string().default("Aether Academy of Technology & Sciences"),
    logoUrl: z.string().default("/favicon.ico"),
    address: z.string().default("100 Innovation Park, Tech Corridor, Bangalore"),
    academicYear: z.string().default("2026 - 2027"),
    gradingScheme: z.string().default("10-Point Absolute Scale (UGC / AICTE)")
  }).default({
    name: "Aether Academy of Technology & Sciences",
    logoUrl: "/favicon.ico",
    address: "100 Innovation Park, Tech Corridor, Bangalore",
    academicYear: "2026 - 2027",
    gradingScheme: "10-Point Absolute Scale (UGC / AICTE)"
  }),
  attendanceRules: z.object({
    minimumPercentage: z.number().default(75),
    condonationPercentage: z.number().default(65),
    alertThreshold: z.number().default(80)
  }).default({
    minimumPercentage: 75,
    condonationPercentage: 65,
    alertThreshold: 80
  }),
  feeRules: z.object({
    lateFeePerDay: z.number().default(50),
    gracePeriodDays: z.number().default(7),
    installmentAllowed: z.boolean().default(true)
  }).default({
    lateFeePerDay: 50,
    gracePeriodDays: 7,
    installmentAllowed: true
  }),
  integrations: z.object({
    smsGateway: z.object({ provider: z.string().default("Twilio"), enabled: z.boolean().default(true) }),
    emailSmtp: z.object({ provider: z.string().default("SendGrid / AWS SES"), enabled: z.boolean().default(true) }),
    paymentGateway: z.object({ provider: z.string().default("Stripe & Razorpay"), enabled: z.boolean().default(true) })
  }).default({
    smsGateway: { provider: "Twilio", enabled: true },
    emailSmtp: { provider: "SendGrid / AWS SES", enabled: true },
    paymentGateway: { provider: "Stripe & Razorpay", enabled: true }
  })
});

export const SettingsSchemasByCategory: Record<string, z.ZodSchema> = {
  profile: ProfileSettingsSchema,
  appearance: AppearanceSettingsSchema,
  security: SecuritySettingsSchema,
  notifications: NotificationsSettingsSchema,
  academics: AcademicPreferencesSchema,
  privacy: PrivacySettingsSchema,
  language: LanguageSettingsSchema,
  accessibility: AccessibilitySettingsSchema,
  fees: FeesSettingsSchema,
  admin: AdminSettingsSchema
};
