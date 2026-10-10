export const DEFAULT_SETTINGS: Record<string, any> = {
  profile: {
    photoUrl: "",
    fullName: "Sarah Connor",
    rollNumber: "2024CS104",
    registerNumber: "312424104042",
    email: "sarah@school.com",
    phone: "+91 98401 23456",
    dob: "2004-05-18",
    gender: "female",
    bloodGroup: "O+",
    address: "142 Scholars Boulevard, Tech City, Chennai - 600028",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    section: "Section B",
    batch: "2024 - 2028",
    guardianName: "Robert Mercer",
    guardianRelation: "Father",
    guardianPhone: "+91 98401 98765",
    emergencyContact: "+91 98401 98765"
  },
  appearance: {
    mode: "light",
    primaryColor: "teal",
    customColor: "#0d9488",
    fontFamily: "sans",
    fontSize: "medium",
    layoutDensity: "comfortable",
    sidebarStyle: "expanded",
    borderRadius: "rounded"
  },
  security: {
    twoFactorEnabled: false,
    twoFactorMethod: "email",
    loginAlerts: true,
    emailVerified: true,
    phoneVerified: true,
    sessions: [
      { id: "sess_1", device: "Chrome 128 / Windows 11", ip: "192.168.1.42", createdAt: "2026-10-10 09:15", lastSeen: "Just now", current: true },
      { id: "sess_2", device: "Safari 17 / iPhone 15 Pro", ip: "152.58.12.90", createdAt: "2026-10-09 21:30", lastSeen: "Yesterday", current: false }
    ],
    loginHistory: [
      { device: "Chrome 128 / Windows 11", ip: "192.168.1.42", time: "Today at 09:15 AM", status: "Success" },
      { device: "Safari 17 / iPhone 15 Pro", ip: "152.58.12.90", time: "Yesterday at 09:30 PM", status: "Success" },
      { device: "Firefox / MacOS", ip: "103.21.244.0", time: "Oct 05, 2026 14:10 PM", status: "Blocked (Suspicious)" }
    ]
  },
  notifications: {
    channels: { inApp: true, email: true, sms: false, push: true },
    categories: {
      attendanceAlerts: true,
      feeReminders: true,
      examSchedule: true,
      resultsPublished: true,
      assignmentsDue: true,
      circulars: true,
      timetableChanges: true
    },
    quietHours: { enabled: false, from: "22:00", to: "07:00" },
    digestFrequency: "instant"
  },
  academics: {
    defaultLandingPage: "dashboard",
    defaultSemesterView: "current",
    gradeDisplay: "cgpa",
    timetableView: "week",
    weekStart: "monday",
    calendarSyncEnabled: true
  },
  privacy: {
    profileVisibility: "classmates",
    showPhoneToPeers: false,
    showEmailToPeers: true,
    allowDirectorySearch: true
  },
  language: {
    language: "en",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    timeZone: "Asia/Kolkata"
  },
  accessibility: {
    highContrast: false,
    reduceAnimations: false,
    largerText: false,
    keyboardShortcuts: true
  },
  fees: {
    autoReminderDays: 5,
    receiptEmailPreference: true,
    savedPaymentMethodDefault: "card_visa_4242",
    savedCards: [
      { id: "card_1", brand: "Visa", last4: "4242", expiry: "12/28", holder: "Sarah Connor", isDefault: true },
      { id: "card_2", brand: "Mastercard", last4: "8821", expiry: "08/27", holder: "Robert Mercer", isDefault: false }
    ]
  },
  admin: {
    institution: {
      name: "Aether Academy of Technology & Sciences",
      logoUrl: "/favicon.ico",
      address: "100 Innovation Park, Tech Corridor, Bangalore - 560100",
      academicYear: "2026 - 2027",
      gradingScheme: "10-Point Absolute Scale (UGC / AICTE)"
    },
    academicStructure: {
      departments: ["Computer Science & Engineering", "Information Technology", "Electronics & Communication", "Applied Mathematics"],
      courses: ["B.S. Computer Science", "B.Tech AI & Data Science", "B.E. Robotics", "M.S. Software Engineering"],
      sections: ["Section A", "Section B", "Section C"]
    },
    rbac: [
      { role: "Student", permissions: ["View Courses", "Submit Assignments", "View Grades", "Pay Fees", "Book Library"] },
      { role: "Parent", permissions: ["View Ward Attendance", "View Ward Grades", "Pay Fees", "Message Mentor"] },
      { role: "Teacher", permissions: ["Manage Attendance", "Grade Assignments", "Publish Exams", "Advising", "Edit Courses"] },
      { role: "Admin", permissions: ["Full System Administration", "Manage Users", "Fee Head Config", "Audit Logs", "Backups"] }
    ],
    feeRules: {
      lateFeePerDay: 50,
      gracePeriodDays: 7,
      installmentAllowed: true
    },
    attendanceRules: {
      minimumPercentage: 75,
      condonationPercentage: 65,
      alertThreshold: 80
    },
    integrations: {
      smsGateway: { provider: "Twilio API", enabled: true },
      emailSmtp: { provider: "SendGrid Webhook", enabled: true },
      paymentGateway: { provider: "Stripe & Razorpay Live", enabled: true }
    },
    auditLogs: [
      { id: "aud_1", actor: "admin@school.com", action: "UPDATE_GRADING_SCHEME", entity: "Academic Policy", timestamp: "2026-10-10 11:20" },
      { id: "aud_2", actor: "admin@school.com", action: "GRANT_ROLE_PERMISSION", entity: "RBAC Teacher Matrix", timestamp: "2026-10-09 16:45" },
      { id: "aud_3", actor: "sarah@school.com", action: "UPDATE_SECURITY_PASSWORD", entity: "Account Security", timestamp: "2026-10-08 10:15" }
    ],
    backup: {
      autoBackup: true,
      retentionDays: 90,
      lastBackupTime: "Today at 03:00 AM (48.2 MB compressed)"
    }
  },
  about: {
    appVersion: "v2.4.0 (Enterprise Edition)",
    buildHash: "sha256-a94f83e91b",
    framework: "Next.js 16.3.1 (React 19 + Turbopack)",
    supportEmail: "support@aether.edu",
    phone: "+91 (080) 4123-9000",
    termsUrl: "https://portal.aether.edu/terms",
    privacyUrl: "https://portal.aether.edu/privacy"
  }
};
