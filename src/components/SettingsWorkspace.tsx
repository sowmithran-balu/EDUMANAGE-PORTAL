"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Palette,
  ShieldCheck,
  Bell,
  GraduationCap,
  Eye,
  Globe,
  Sliders,
  CreditCard,
  Building,
  Info,
  Search,
  Check,
  RotateCcw,
  Save,
  AlertCircle,
  Smartphone,
  Mail,
  Key,
  Lock,
  Download,
  Calendar,
  Layers,
  HelpCircle,
  X,
  Upload,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  Database,
  FileText,
  Users,
  Shield,
  Send,
  Star,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/defaults/settings.defaults";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SettingsWorkspaceProps {
  user: UserInfo;
  initialCategory?: string;
  initialSettings?: Record<string, any>;
}

export default function SettingsWorkspace({
  user,
  initialCategory = "profile",
  initialSettings = {}
}: SettingsWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active section state
  const [activeSection, setActiveSection] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Settings State initialized with defaults and user overrides
  const [settings, setSettings] = useState<Record<string, any>>(() => {
    return {
      profile: { ...DEFAULT_SETTINGS.profile, ...(initialSettings.profile || {}) },
      appearance: { ...DEFAULT_SETTINGS.appearance, ...(initialSettings.appearance || {}) },
      security: { ...DEFAULT_SETTINGS.security, ...(initialSettings.security || {}) },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(initialSettings.notifications || {}) },
      academics: { ...DEFAULT_SETTINGS.academics, ...(initialSettings.academics || {}) },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...(initialSettings.privacy || {}) },
      language: { ...DEFAULT_SETTINGS.language, ...(initialSettings.language || {}) },
      accessibility: { ...DEFAULT_SETTINGS.accessibility, ...(initialSettings.accessibility || {}) },
      fees: { ...DEFAULT_SETTINGS.fees, ...(initialSettings.fees || {}) },
      admin: { ...DEFAULT_SETTINGS.admin, ...(initialSettings.admin || {}) },
      about: { ...DEFAULT_SETTINGS.about, ...(initialSettings.about || {}) }
    };
  });

  // Password fields state (Security)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Feedback form state (About)
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Audit filter state (Admin)
  const [auditFilter, setAuditFilter] = useState("ALL");

  // Sync section from URL if present
  useEffect(() => {
    const sec = searchParams.get("section");
    if (sec && settings[sec]) {
      setActiveSection(sec);
    }
  }, [searchParams, settings]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Navigation definition with Role Permissions
  const allSections = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal identity, contacts & batch info", roles: ["student", "parent", "teacher", "admin"] },
    { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme customizer, colors & typography", roles: ["student", "parent", "teacher", "admin"] },
    { id: "security", label: "Account & Security", icon: ShieldCheck, desc: "Password, 2FA, sessions & audit history", roles: ["student", "parent", "teacher", "admin"] },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Channels, quiet hours & category triggers", roles: ["student", "parent", "teacher", "admin"] },
    { id: "academics", label: "Academic Preferences", icon: GraduationCap, desc: "Default views, GPA scales & calendar sync", roles: ["student", "teacher", "admin"] },
    { id: "privacy", label: "Privacy", icon: Eye, desc: "Directory visibility, peer masking & data export", roles: ["student", "teacher", "admin"] },
    { id: "language", label: "Language & Region", icon: Globe, desc: "Locale, timezone, date & time formats", roles: ["student", "parent", "teacher", "admin"] },
    { id: "accessibility", label: "Accessibility", icon: Sliders, desc: "High contrast, motion reduction & shortcuts", roles: ["student", "parent", "teacher", "admin"] },
    { id: "fees", label: "Fees & Payments", icon: CreditCard, desc: "Saved methods, auto-reminders & receipts", roles: ["student", "parent", "admin"] },
    { id: "admin", label: "Administration (RBAC)", icon: Building, desc: "Institution, structure, rules & audit logs", roles: ["admin"] },
    { id: "about", label: "About & Support", icon: Info, desc: "Version, policy docs, contact & feedback", roles: ["student", "parent", "teacher", "admin"] }
  ];

  // Filter sections by user role
  const visibleSections = useMemo(() => {
    const userRole = (user.role || "student").toLowerCase();
    return allSections.filter(s => s.roles.includes(userRole));
  }, [user.role]);

  // Search filter for sections
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return visibleSections;
    const q = searchQuery.toLowerCase();
    return visibleSections.filter(s =>
      s.label.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q)
    );
  }, [visibleSections, searchQuery]);

function applyThemeDirectly(appearance: {
  mode?: string;
  primaryColor?: string;
  fontFamily?: string;
  fontSize?: string;
  borderRadius?: string;
}) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const mode = appearance.mode || localStorage.getItem("edu_theme_mode") || "light";
  const primaryColor = appearance.primaryColor || localStorage.getItem("edu_theme_color") || "teal";
  const fontFamily = appearance.fontFamily || localStorage.getItem("edu_theme_font") || "sans";
  const fontSize = appearance.fontSize || localStorage.getItem("edu_theme_scale") || "medium";
  const borderRadius = appearance.borderRadius || localStorage.getItem("edu_theme_radius") || "rounded";

  let isDark = false;
  if (mode === "dark") {
    isDark = true;
  } else if (mode === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark = false;
  }

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  root.setAttribute("data-color", primaryColor);
  root.setAttribute("data-font", fontFamily);
  root.setAttribute("data-scale", fontSize);
  root.setAttribute("data-radius", borderRadius);

  try {
    localStorage.setItem("edu_theme_mode", mode);
    localStorage.setItem("edu_theme_color", primaryColor);
    localStorage.setItem("edu_theme_font", fontFamily);
    localStorage.setItem("edu_theme_scale", fontSize);
    localStorage.setItem("edu_theme_radius", borderRadius);
    document.cookie = `edu_theme_mode=${mode}; path=/; max-age=31536000`;
    document.cookie = `edu_theme_color=${primaryColor}; path=/; max-age=31536000`;
  } catch (e) {}
}

  // Initial theme application and system scheme listener
  useEffect(() => {
    if (settings.appearance) {
      applyThemeDirectly(settings.appearance);
    }

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (settings.appearance?.mode === "system") {
        applyThemeDirectly(settings.appearance);
      }
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Update a setting within a category
  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => {
      const nextCategory = {
        ...prev[category],
        [key]: value
      };
      if (category === "appearance") {
        applyThemeDirectly(nextCategory);
      }
      return {
        ...prev,
        [category]: nextCategory
      };
    });
    setHasUnsavedChanges(true);
  };

  // Password Strength calculation
  const passwordStrength = useMemo(() => {
    const p = passwordForm.newPassword;
    if (!p) return { score: 0, text: "Enter password", color: "bg-slate-200" };
    let score = 0;
    if (p.length >= 8) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[^A-Za-z0-9]/.test(p)) score += 25;

    if (score <= 25) return { score, text: "Weak", color: "bg-rose-500" };
    if (score <= 50) return { score, text: "Moderate", color: "bg-amber-500" };
    if (score <= 75) return { score, text: "Strong", color: "bg-teal-500" };
    return { score, text: "Formidable", color: "bg-emerald-600" };
  }, [passwordForm.newPassword]);

  // Save changes handler (API call)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = settings[activeSection];
      const res = await fetch(`/api/settings/${activeSection}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save settings");
      }

      setHasUnsavedChanges(false);
      setToastMessage("Settings successfully synchronized and persisted!");
    } catch (err: any) {
      setToastMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default handler
  const handleReset = () => {
    if (confirm(`Reset ${activeSection.toUpperCase()} settings to system defaults?`)) {
      setSettings(prev => ({
        ...prev,
        [activeSection]: { ...DEFAULT_SETTINGS[activeSection] }
      }));
      setHasUnsavedChanges(true);
      setToastMessage(`Reset ${activeSection} settings to factory defaults.`);
    }
  };

  // Download user data as JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aether-settings-dossier-${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToastMessage("UserData dossier downloaded successfully (JSON).");
  };

  return (
    <div className="w-full text-slate-900 pb-16 font-sans">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* TOP HEADER & CONTROLS (Navy & Teal Design System) */}
      <div className="rounded-2xl z-20 bg-slate-900 text-white border border-slate-800 shadow-md px-5 py-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Title & Active Section Tag */}
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-bold text-white tracking-tight">Portal Settings</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                  {user.role} view
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Workspace customization, security authentication & academic preferences
              </p>
            </div>
          </div>

          {/* Search Box in Header */}
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search setting options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 hover:bg-slate-800 focus:bg-slate-800 text-xs text-white placeholder-slate-400 pl-9 pr-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>

          {/* Action Buttons & Unsaved Indicator */}
          <div className="flex items-center space-x-2.5">
            {hasUnsavedChanges && (
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Unsaved Changes</span>
              </span>
            )}

            <button
              onClick={handleReset}
              title="Reset current section to defaults"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Default</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              <span>{isSaving ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: SECTIONS WITH ICONS & TEAL ACTIVE HIGHLIGHT */}
          <aside className="lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1 sticky top-22">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center">
              <span>Settings Categories</span>
              <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">
                {visibleSections.length} sections
              </span>
            </div>

            <nav className="space-y-0.5">
              {filteredSections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSection(sec.id);
                      router.push(`/settings?section=${sec.id}`);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-teal-50 text-teal-800 font-bold border-l-3 border-teal-600 shadow-2xs"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                      <span className="truncate">{sec.label}</span>
                    </div>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </nav>

            {/* Quick Helper Pin */}
            <div className="mt-4 pt-3 border-t border-slate-100 px-3 py-2 bg-slate-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Logged in as {user.name}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{user.email}</span>
            </div>
          </aside>

          {/* RIGHT CONTENT PANEL: CARD-BASED FORMS */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* 1. SECTION: PROFILE */}
            {activeSection === "profile" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Student & Scholar Profile</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage personal identity details, guardian contacts and residential address.</p>
                </div>

                {/* Avatar upload with crop simulation */}
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="relative h-20 w-20 rounded-2xl bg-teal-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
                    {settings.profile.fullName.charAt(0)}
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px]">✓</span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-sm font-bold text-slate-900">{settings.profile.fullName}</h3>
                    <p className="text-xs text-slate-500">Roll: {settings.profile.rollNumber} • Register: {settings.profile.registerNumber}</p>
                    <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                      <button 
                        onClick={() => alert("Crop photo modal: file uploader ready for 1:1 ratio square crop.")}
                        className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold cursor-pointer shadow-2xs flex items-center space-x-1"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload New Photo</span>
                      </button>
                      <button 
                        onClick={() => updateSetting("profile", "photoUrl", "")}
                        className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) => updateSetting("profile", "fullName", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Institutional Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={settings.profile.phone}
                      onChange={(e) => updateSetting("profile", "phone", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={settings.profile.dob}
                      onChange={(e) => updateSetting("profile", "dob", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                    <select
                      value={settings.profile.gender}
                      onChange={(e) => updateSetting("profile", "gender", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                    <select
                      value={settings.profile.bloodGroup}
                      onChange={(e) => updateSetting("profile", "bloodGroup", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    >
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-600 font-semibold mb-1">Permanent Residential Address</label>
                    <textarea
                      rows={2}
                      value={settings.profile.address}
                      onChange={(e) => updateSetting("profile", "address", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Read-Only Academic Section Managed by Admin */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    <span>Curricular Details (Managed by Office of Registrar)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Department</span>
                      <span className="font-semibold text-slate-800">{settings.profile.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Year & Term</span>
                      <span className="font-semibold text-slate-800">{settings.profile.year}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Class Section</span>
                      <span className="font-semibold text-slate-800">{settings.profile.section}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Cohort Batch</span>
                      <span className="font-semibold text-slate-800">{settings.profile.batch}</span>
                    </div>
                  </div>
                </div>

                {/* Guardian & Emergency Contacts */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Guardian & Emergency Contacts</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Guardian Name</label>
                      <input
                        type="text"
                        value={settings.profile.guardianName}
                        onChange={(e) => updateSetting("profile", "guardianName", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Relation</label>
                      <input
                        type="text"
                        value={settings.profile.guardianRelation}
                        onChange={(e) => updateSetting("profile", "guardianRelation", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-semibold mb-1">Emergency Phone</label>
                      <input
                        type="text"
                        value={settings.profile.emergencyContact}
                        onChange={(e) => updateSetting("profile", "emergencyContact", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTION: APPEARANCE (LIVE THEME CUSTOMIZER) */}
            {activeSection === "appearance" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Appearance & Theme Engine</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Customize interface color schemes, typography, layout density, and border radii.</p>
                </div>

                {/* Mode Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Display Theme Mode</label>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    {[
                      { id: "light", label: "Light Theme", icon: Sun },
                      { id: "dark", label: "Dark Theme", icon: Moon },
                      { id: "system", label: "System Sync", icon: Laptop }
                    ].map(m => {
                      const Icon = m.icon;
                      const selected = settings.appearance.mode === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => updateSetting("appearance", "mode", m.id)}
                          className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 cursor-pointer transition-all ${
                            selected
                              ? "bg-teal-50/70 border-teal-600 text-teal-900 font-bold shadow-2xs"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${selected ? "text-teal-600" : "text-slate-400"}`} />
                          <span>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Color Palette Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Primary Color Accent</label>
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { id: "navy", name: "Navy", hex: "#1e293b", bg: "bg-slate-800" },
                      { id: "teal", name: "Teal", hex: "#0d9488", bg: "bg-teal-600" },
                      { id: "indigo", name: "Indigo", hex: "#4f46e5", bg: "bg-indigo-600" },
                      { id: "emerald", name: "Emerald", hex: "#059669", bg: "bg-emerald-600" },
                      { id: "rose", name: "Rose", hex: "#e11d48", bg: "bg-rose-600" }
                    ].map(preset => {
                      const isSel = settings.appearance.primaryColor === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => updateSetting("appearance", "primaryColor", preset.id)}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                            isSel
                              ? "border-teal-600 bg-teal-50/40 text-teal-600 font-bold shadow-2xs"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className={`w-3.5 h-3.5 rounded-full ${preset.bg}`} />
                          <span>{preset.name}</span>
                          {isSel && <Check className="h-3 w-3 text-teal-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography & Layout Density */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Font Family</label>
                    <select
                      value={settings.appearance.fontFamily}
                      onChange={(e) => updateSetting("appearance", "fontFamily", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="sans">Inter Geometric Sans</option>
                      <option value="serif">Merriweather Scholastic Serif</option>
                      <option value="mono">JetBrains Developer Mono</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Font Scale</label>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={(e) => updateSetting("appearance", "fontSize", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="small">Compact (13px baseline)</option>
                      <option value="medium">Standard (14px baseline)</option>
                      <option value="large">Spacious (16px baseline)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Border Corner Radius</label>
                    <select
                      value={settings.appearance.borderRadius}
                      onChange={(e) => updateSetting("appearance", "borderRadius", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="sharp">Sharp (0px)</option>
                      <option value="rounded">Rounded (12px)</option>
                      <option value="pill">Pill Smooth (24px)</option>
                    </select>
                  </div>
                </div>

                {/* LIVE PREVIEW PANEL CARD */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Live Customizer Preview</span>
                    <span className="text-[10px] text-teal-600 font-semibold font-mono">Real-time Rendering</span>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                        A
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Aether Academy Workspace</div>
                        <div className="text-[11px] text-slate-500">Theme: {settings.appearance.mode} • Color: {settings.appearance.primaryColor} • Scale: {settings.appearance.fontSize}</div>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-sm">
                      Interactive Element
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SECTION: ACCOUNT AND SECURITY */}
            {activeSection === "security" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Account Credentials & Security</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Protect your student account with strong credentials, multi-factor verification, and session control.</p>
                </div>

                {/* Password Change with Strength Meter */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Change Account Password</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white ${passwordStrength.color}`}>
                      Strength: {passwordStrength.text}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Strength Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${passwordStrength.score}%` }} />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!passwordForm.currentPassword || !passwordForm.newPassword) {
                          alert("Please fill in current and new password.");
                          return;
                        }
                        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                          alert("New password and confirmation do not match.");
                          return;
                        }
                        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        setToastMessage("Password updated successfully across all authentication tokens.");
                      }}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA Section */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Require an OTP verification code sent via institutional email or authenticator app.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => updateSetting("security", "twoFactorEnabled", e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {/* Active Sessions List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-800">Active Authorized Sessions</h3>
                      <p className="text-[11px] text-slate-500">Devices currently authenticated into this student account.</p>
                    </div>
                    <button
                      onClick={() => alert("Logged out of all other active devices. Auth tokens revoked.")}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                    >
                      Log out of all devices
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {settings.security.sessions.map((sess: any) => (
                      <div key={sess.id} className="p-3 bg-white flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Laptop className="h-4 w-4 text-slate-500" />
                          <div>
                            <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                              <span>{sess.device}</span>
                              {sess.current && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">This Device</span>}
                            </div>
                            <div className="text-[10px] text-slate-400">IP: {sess.ip} • Last active: {sess.lastSeen}</div>
                          </div>
                        </div>
                        {!sess.current && (
                          <button 
                            onClick={() => alert(`Session ${sess.id} revoked.`)}
                            className="text-xs font-semibold text-slate-400 hover:text-rose-600"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Login History Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-800">Recent Login History</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100">
                        <tr>
                          <th className="py-2.5 px-3">Device / Browser</th>
                          <th className="py-2.5 px-3">IP Address</th>
                          <th className="py-2.5 px-3">Timestamp</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {settings.security.loginHistory.map((item: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-slate-800">{item.device}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{item.ip}</td>
                            <td className="py-2.5 px-3 text-slate-500">{item.time}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status.includes("Success") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. SECTION: NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Notifications & Delivery Channels</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control where and when you receive academic notifications and reminders.</p>
                </div>

                {/* Matrix Grid: Channel x Category */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Event Category</th>
                        <th className="py-3 px-3 text-center">In-App</th>
                        <th className="py-3 px-3 text-center">Email</th>
                        <th className="py-3 px-3 text-center">SMS</th>
                        <th className="py-3 px-3 text-center">Push</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {[
                        { key: "attendanceAlerts", label: "Attendance & Detention Warnings" },
                        { key: "feeReminders", label: "Fee Invoices & Payment Reminders" },
                        { key: "examSchedule", label: "Exam Schedules & Hall Tickets" },
                        { key: "resultsPublished", label: "Term Exam Results & Grades" },
                        { key: "assignmentsDue", label: "Assignment & Lab Due Dates" },
                        { key: "circulars", label: "Official Circulars & Announcements" },
                        { key: "timetableChanges", label: "Lecture & Timetable Adjustments" }
                      ].map((cat) => (
                        <tr key={cat.key} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{cat.label}</td>
                          {["inApp", "email", "sms", "push"].map((ch) => (
                            <td key={ch} className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                defaultChecked={ch !== "sms"}
                                onChange={() => setHasUnsavedChanges(true)}
                                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quiet Hours & Digest Frequency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Quiet Hours</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.quietHours.enabled}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              quietHours: { ...prev.notifications.quietHours, enabled: e.target.checked }
                            }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">Mute all push and SMS alerts during designated rest hours.</p>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="time" 
                        value={settings.notifications.quietHours.from}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              quietHours: { ...prev.notifications.quietHours, from: e.target.value }
                            }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs" 
                      />
                      <span className="text-slate-400">to</span>
                      <input 
                        type="time" 
                        value={settings.notifications.quietHours.to}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              quietHours: { ...prev.notifications.quietHours, to: e.target.value }
                            }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs" 
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-900 block">Email Digest Frequency</span>
                    <p className="text-[11px] text-slate-500">Consolidate low-priority updates into a single digest summary.</p>
                    <select
                      value={settings.notifications.digestFrequency}
                      onChange={(e) => updateSetting("notifications", "digestFrequency", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="instant">Instant (Send as events happen)</option>
                      <option value="daily">Daily Digest (Every morning at 08:00 AM)</option>
                      <option value="weekly">Weekly Summary (Every Monday morning)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SECTION: ACADEMIC PREFERENCES */}
            {activeSection === "academics" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Academic & Schedule Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Configure default workspace views, grade formatting, and external calendar synchronization.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Default Landing Dashboard</label>
                    <select
                      value={settings.academics.defaultLandingPage}
                      onChange={(e) => updateSetting("academics", "defaultLandingPage", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="dashboard">Main Student Workspace</option>
                      <option value="timetable">Weekly Timetable Schedule</option>
                      <option value="attendance">Attendance & Risk Dashboard</option>
                      <option value="courses">Active Course Enrollments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Grade Display Format</label>
                    <select
                      value={settings.academics.gradeDisplay}
                      onChange={(e) => updateSetting("academics", "gradeDisplay", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="cgpa">10-Point CGPA Scale (8.84 / 10.0)</option>
                      <option value="percentage">Percentage Scale (88.4%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Timetable View Layout</label>
                    <select
                      value={settings.academics.timetableView}
                      onChange={(e) => updateSetting("academics", "timetableView", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="week">Full Week Grid (Mon - Fri)</option>
                      <option value="day">Single Day Focus Agenda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Week Starting Day</label>
                    <select
                      value={settings.academics.weekStart}
                      onChange={(e) => updateSetting("academics", "weekStart", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="monday">Monday (Standard)</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                </div>

                {/* Calendar Sync Integration */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-teal-600" />
                      <span className="text-xs font-bold text-slate-900">External Calendar Sync (.ICS)</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Subscribe your Google Calendar, Apple Calendar, or Outlook to class schedules & exam dates.</p>
                  </div>

                  <button
                    onClick={() => alert("Calendar ICS feed generated: webcal://portal.aether.edu/feed/cal/student-2024cs104.ics")}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border border-slate-200 text-xs font-bold cursor-pointer shadow-2xs"
                  >
                    Export .ICS Feed
                  </button>
                </div>
              </div>
            )}

            {/* 6. SECTION: PRIVACY */}
            {activeSection === "privacy" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Privacy & Peer Visibility</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control how your student profile appears to classmates and download your personal data records.</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Classmate Profile Visibility</span>
                      <span className="text-[11px] text-slate-500">Allow other students in enrolled courses to view your academic profile card.</span>
                    </div>
                    <select
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => updateSetting("privacy", "profileVisibility", e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    >
                      <option value="classmates">Visible to Classmates</option>
                      <option value="teachers_only">Faculty & Mentors Only</option>
                      <option value="private">Private (Hidden)</option>
                    </select>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Mask Phone Number from Peers</span>
                      <span className="text-[11px] text-slate-500">Hide personal phone number in class directories.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={!settings.privacy.showPhoneToPeers}
                      onChange={(e) => updateSetting("privacy", "showPhoneToPeers", !e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Allow Institutional Directory Search</span>
                      <span className="text-[11px] text-slate-500">Enable search by student name or roll number in campus search.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowDirectorySearch}
                      onChange={(e) => updateSetting("privacy", "allowDirectorySearch", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Data Rights & Export */}
                <div className="p-4 bg-teal-50/50 border border-teal-200/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-teal-900 block">Download My Complete Data Portfolio</span>
                    <span className="text-[11px] text-teal-700">Export your academic history, attendance logs, and profile records in standard JSON format.</span>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JSON</span>
                  </button>
                </div>
              </div>
            )}

            {/* 7. SECTION: LANGUAGE AND REGION */}
            {activeSection === "language" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Language & Regional Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Set portal interface language, date conventions, time formats, and campus time zones.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Primary Display Language</label>
                    <select
                      value={settings.language.language}
                      onChange={(e) => updateSetting("language", "language", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="en">English (United States / UK)</option>
                      <option value="ta">Tamil (தமிழ்)</option>
                      <option value="hi">Hindi (हिन्दी)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Date Format Convention</label>
                    <select
                      value={settings.language.dateFormat}
                      onChange={(e) => updateSetting("language", "dateFormat", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 10/10/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 10/10/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Time Format</label>
                    <select
                      value={settings.language.timeFormat}
                      onChange={(e) => updateSetting("language", "timeFormat", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value="12h">12-Hour Clock (02:30 PM)</option>
                      <option value="24h">24-Hour Clock (14:30)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Regional Time Zone</label>
                    <select
                      value={settings.language.timeZone}
                      onChange={(e) => updateSetting("language", "timeZone", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata (IST • UTC+05:30)</option>
                      <option value="UTC">UTC (Universal Coordinated Time)</option>
                      <option value="America/New_York">America/New_York (EST • UTC-05:00)</option>
                      <option value="Europe/London">Europe/London (GMT • UTC+00:00)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SECTION: ACCESSIBILITY */}
            {activeSection === "accessibility" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Accessibility & Visual Inclusivity</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Adapt visual contrast, reduce motion effects, and configure assistive keyboard shortcuts.</p>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">High Contrast Mode</span>
                      <span className="text-[11px] text-slate-500">Increases contrast of borders, typography, and interactive buttons for enhanced legibility.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.highContrast}
                      onChange={(e) => updateSetting("accessibility", "highContrast", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Reduce Motion & Animations</span>
                      <span className="text-[11px] text-slate-500">Suppresses fluid layout animations and transitions for users sensitive to motion.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.reduceAnimations}
                      onChange={(e) => updateSetting("accessibility", "reduceAnimations", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Enlarged UI Text Scale</span>
                      <span className="text-[11px] text-slate-500">Applies larger default font sizing across all tables, charts, and input forms.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.largerText}
                      onChange={(e) => updateSetting("accessibility", "largerText", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 block">Keyboard Shortcuts Quick Navigator</span>
                      <span className="text-[11px] text-slate-500">Enable hotkeys (e.g. Press &apos;?&apos; for cheat-sheet, Ctrl+S to save).</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.accessibility.keyboardShortcuts}
                      onChange={(e) => updateSetting("accessibility", "keyboardShortcuts", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 9. SECTION: FEES AND PAYMENTS */}
            {activeSection === "fees" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Fees & Payment Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage payment reminder thresholds, digital receipt emails, and saved payment methods.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Pre-Due Date Notification Lead Time</label>
                    <select
                      value={settings.fees.autoReminderDays}
                      onChange={(e) => updateSetting("fees", "autoReminderDays", Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    >
                      <option value={3}>3 Days Before Due Date</option>
                      <option value={5}>5 Days Before Due Date</option>
                      <option value={7}>7 Days Before Due Date</option>
                      <option value={10}>10 Days Before Due Date</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-900 block">Automatic PDF Receipt Dispatch</span>
                      <span className="text-[10px] text-slate-500">Email official stamped receipt immediately on transaction success.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.fees.receiptEmailPreference}
                      onChange={(e) => updateSetting("fees", "receiptEmailPreference", e.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Saved Payment Methods */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Saved Payment Methods</span>
                    <button 
                      onClick={() => alert("Add payment method modal: Stripe & Razorpay tokenization simulator.")}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer"
                    >
                      + Add New Method
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {settings.fees.savedCards?.map((card: any) => (
                      <div key={card.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-slate-600" />
                          <div>
                            <span className="font-bold text-slate-800 block">{card.brand} •••• {card.last4}</span>
                            <span className="text-[10px] text-slate-400">Expires {card.expiry} • {card.holder}</span>
                          </div>
                        </div>
                        {card.isDefault ? (
                          <span className="text-[9px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">Default</span>
                        ) : (
                          <button 
                            onClick={() => alert(`Set ${card.brand} as default payment method.`)}
                            className="text-[10px] text-slate-500 hover:text-slate-800 font-semibold"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 10. SECTION: ADMIN (RBAC, STRUCTURE, INTEGRATIONS & AUDIT) */}
            {activeSection === "admin" && user.role === "admin" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Institution & System Administration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Institution metadata, RBAC permission matrix, fee schedules, attendance rules, and audit logs.</p>
                </div>

                {/* Institution Metadata Form */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Institution Entity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-500 mb-1">Institution Name</label>
                      <input
                        type="text"
                        value={settings.admin.institution.name}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            admin: { ...prev.admin, institution: { ...prev.admin.institution, name: e.target.value } }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Academic Year</label>
                      <input
                        type="text"
                        value={settings.admin.institution.academicYear}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            admin: { ...prev.admin, institution: { ...prev.admin.institution, academicYear: e.target.value } }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-slate-500 mb-1">Campus Address</label>
                      <input
                        type="text"
                        value={settings.admin.institution.address}
                        onChange={(e) => {
                          setSettings(prev => ({
                            ...prev,
                            admin: { ...prev.admin, institution: { ...prev.admin.institution, address: e.target.value } }
                          }));
                          setHasUnsavedChanges(true);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* RBAC Permission Matrix Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Role-Based Access Control (RBAC) Matrix</h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Granted Permissions</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {settings.admin.rbac.map((r: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{r.role}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex flex-wrap gap-1">
                                {r.permissions.map((p: string, pIdx: number) => (
                                  <span key={pIdx} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button 
                                onClick={() => alert(`Modify permissions modal for role: ${r.role}`)}
                                className="text-teal-600 hover:text-teal-700 font-bold text-[11px]"
                              >
                                Edit Role
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Attendance & Fee Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Attendance Eligibility Thresholds</span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Statutory Minimum Required:</span>
                      <span className="font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{settings.admin.attendanceRules.minimumPercentage}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Condonation Medical Floor:</span>
                      <span className="font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{settings.admin.attendanceRules.condonationPercentage}%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">Fee Schedule Defaults</span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Daily Late Penalty:</span>
                      <span className="font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200">₹{settings.admin.feeRules.lateFeePerDay} / day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Grace Period Post Due Date:</span>
                      <span className="font-bold font-mono bg-white px-2 py-0.5 rounded border border-slate-200">{settings.admin.feeRules.gracePeriodDays} Days</span>
                    </div>
                  </div>
                </div>

                {/* Audit Log Viewer with Filters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">System Audit Trail</h3>
                      <p className="text-[11px] text-slate-500">Security-critical modifications logged with actor identity & timestamp.</p>
                    </div>
                    <select
                      value={auditFilter}
                      onChange={(e) => setAuditFilter(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    >
                      <option value="ALL">All Actions</option>
                      <option value="UPDATE">Updates Only</option>
                      <option value="SECURITY">Security Events</option>
                    </select>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Actor</th>
                          <th className="py-2 px-3">Action Type</th>
                          <th className="py-2 px-3">Entity Scope</th>
                          <th className="py-2 px-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {settings.admin.auditLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{log.actor}</td>
                            <td className="py-2.5 px-3">
                              <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600">{log.entity}</td>
                            <td className="py-2.5 px-3 text-slate-400 text-[11px]">{log.timestamp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 11. SECTION: ABOUT AND SUPPORT */}
            {activeSection === "about" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-base font-bold text-slate-900">About Aether Portal & Support</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Application version release information, governance policies, and helpdesk feedback.</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Core Software Version:</span>
                    <span className="font-mono font-bold text-slate-900">{settings.about.appVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Runtime Framework:</span>
                    <span className="font-mono text-slate-700">{settings.about.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Support Email:</span>
                    <span className="font-semibold text-teal-600">{settings.about.supportEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Emergency Campus Helpline:</span>
                    <span className="font-semibold text-slate-800">{settings.about.phone}</span>
                  </div>
                </div>

                {/* Feedback Submission Form */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-800">Submit User Feedback or Feature Request</h3>
                  
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setFeedbackRating(star)}
                        className={`h-5 w-5 cursor-pointer transition-colors ${
                          star <= feedbackRating ? "text-amber-400 fill-amber-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-500 font-semibold ml-2">{feedbackRating} / 5 Stars</span>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Share any bug reports, UI feedback, or ideas to enhance the student portal..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!feedbackComment.trim()) {
                          alert("Please write a quick comment before submitting feedback.");
                          return;
                        }
                        setFeedbackComment("");
                        setToastMessage("Thank you! Feedback recorded for product engineering team.");
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Submit Feedback</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* STICKY BOTTOM SAVE / CANCEL FOOTER (When changes are made) */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl py-3 px-6 animate-in slide-in-from-bottom-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-bold text-slate-900">You have unsaved changes in &ldquo;{activeSection}&rdquo;</span>
              <span className="text-slate-500 hidden sm:inline">• Save now to synchronize with database</span>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => {
                  setHasUnsavedChanges(false);
                  setToastMessage("Changes reverted to previous session state.");
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-all"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50 flex items-center space-x-1"
              >
                {isSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
