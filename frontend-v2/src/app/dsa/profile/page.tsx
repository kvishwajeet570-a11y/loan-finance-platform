"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import api from "@/lib/api";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Briefcase,
  Camera,
  CheckCircle2,
  ChevronRight,
  FileText,
  Landmark,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";

type Tab =
  | "overview"
  | "personal"
  | "business"
  | "kyc"
  | "bank"
  | "commission"
  | "lenders"
  | "team"
  | "performance"
  | "documents"
  | "security"
  | "notifications"
  | "activity";

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: User },
  { id: "personal", label: "Personal Details", icon: User },
  { id: "business", label: "Business Details", icon: Briefcase },
  { id: "kyc", label: "KYC & Verification", icon: ShieldCheck },
  { id: "bank", label: "Bank & Payout", icon: Landmark },
  { id: "commission", label: "Commission & Earnings", icon: Wallet },
  { id: "lenders", label: "Lender Access", icon: FileText },
  { id: "team", label: "Team Management", icon: Users },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "activity", label: "Activity History", icon: Activity },
];

type LenderDirectoryItem = {
  name: string;
  records: number;
  products: string[];
  productRecords: number;
  dataType: string;
};

const activities: string[][] = [];

function StatusBadge({ children, type = "success" }: { children: React.ReactNode; type?: "success" | "warning" | "danger" }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[type]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Icon size={17} />
          </span>
        )}
        <span>{label}</span>
      </div>
      <span className="text-right text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition-shadow duration-200 hover:shadow-[0_12px_36px_rgba(15,23,42,0.075)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/70 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export default function DsaProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [lenders, setLenders] = useState<LenderDirectoryItem[]>([]);
  const [lendersLoading, setLendersLoading] = useState(false);
  const [lenderError, setLenderError] = useState("");
  const [lenderSearch, setLenderSearch] = useState("");
  const [lenderProductFilter, setLenderProductFilter] = useState("All");
  const [lenderTotalRecords, setLenderTotalRecords] = useState(0);
  const [profile, setProfile] = useState<{
    id?: string | number;
    name?: string;
    phoneNo?: string;
    email?: string;
    city?: string;
    state?: string;
    address?: string;
    dob?: string;
    createdAt?: string | number;
    profileImage?: string;
    isBlocked?: boolean;
    isActive?: boolean;
    isVerified?: boolean;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    [key: string]: unknown;
  } | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [bankError, setBankError] = useState("");
  const [dashboardStats, setDashboardStats] = useState<Record<string, unknown> | null>(null);
  const [monthlyHistory, setMonthlyHistory] = useState<Record<string, unknown>[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [commissionRecords, setCommissionRecords] = useState<Record<string, unknown>[]>([]);
  const [commissionLoading, setCommissionLoading] = useState(false);
  const [commissionError, setCommissionError] = useState("");
  const [kycRecord, setKycRecord] = useState<Record<string, unknown> | null>(null);
  const [kycLoading, setKycLoading] = useState(true);
  const [documents, setDocuments] = useState<Record<string, unknown>[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState('');
  const [profileNotifications, setProfileNotifications] = useState<Record<string, unknown>[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState("");
  const [profileActivities, setProfileActivities] = useState<Record<string, unknown>[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState("");
  const [bankAccounts, setBankAccounts] = useState<Record<string, unknown>[]>([]);
  const [bankLoading, setBankLoading] = useState(true);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [personalMessage, setPersonalMessage] = useState("");
  const [personalForm, setPersonalForm] = useState({ name: "", phoneNo: "", dob: "" });
  const [photo, setPhoto] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Record<string, unknown>[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState("");

  useEffect(() => {
    if (activeTab !== "lenders") return;

    let cancelled = false;

    const loadLenders = async () => {
      setLendersLoading(true);
      setLenderError("");

      try {
        const response = await api.get("/lender/directory");
        const payload = response.data;
        const rows = payload?.data;

        if (!Array.isArray(rows)) {
          throw new Error("Unexpected lender directory response.");
        }

        if (!cancelled) {
          setLenders(rows);
          setLenderTotalRecords(
            typeof payload.totalRecords === "number" ? payload.totalRecords : 0
          );
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setLenderError(
            error instanceof Error
              ? error.message
              : "Unable to load lender directory. Check the backend connection."
          );
        }
      } finally {
        if (!cancelled) setLendersLoading(false);
      }
    };

    void loadLenders();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;

    async function loadTeamMembers() {
      setTeamLoading(true);
      setTeamError("");

      try {
        const profileResponse = await api.get("/profile/me");
        const user = profileResponse.data?.user
          ?? profileResponse.data?.data?.user
          ?? profileResponse.data?.data
          ?? profileResponse.data;

        const dsaId = user?.id;
        if (!dsaId) {
          throw new Error("DSA profile ID is unavailable. Please sign in again.");
        }

        const response = await api.get(
          `/sub-agent/dsa/${encodeURIComponent(String(dsaId))}`
        );

        const payload = response.data?.data
          ?? response.data?.subAgents
          ?? response.data;

        if (!Array.isArray(payload)) {
          throw new Error("Unexpected response from the Sub-Agent API.");
        }

        if (!cancelled) setTeamMembers(payload);
      } catch (error: unknown) {
        if (!cancelled) {
          setTeamMembers([]);
          setTeamError(
            error instanceof Error
              ? error.message
              : "Unable to load team members right now."
          );
        }
      } finally {
        if (!cancelled) setTeamLoading(false);
      }
    }

    loadTeamMembers();

    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (activeTab !== "lenders") return;

    let cancelled = false;

    const loadLenders = async () => {
      setLendersLoading(true);
      setLenderError("");

      try {
        const response = await api.get("/lender/directory");
        const payload = response.data;
        const rows = payload?.data;

        if (!Array.isArray(rows)) {
          throw new Error("Unexpected lender directory response.");
        }

        if (!cancelled) {
          setLenders(rows);
          setLenderTotalRecords(
            typeof payload.totalRecords === "number" ? payload.totalRecords : 0
          );
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setLenderError(
            error instanceof Error
              ? error.message
              : "Unable to load lender directory. Check the backend connection."
          );
        }
      } finally {
        if (!cancelled) setLendersLoading(false);
      }
    };

    void loadLenders();

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  useEffect(() => {
    api.get("/profile/me")
      .then((response) => {
        const data = response.data?.user ?? response.data?.data?.user ?? response.data?.data ?? response.data;
        setProfile(data);
        if (data?.id) {
          setCommissionLoading(true);
          setCommissionError("");
          api.get(`/commission/user/${encodeURIComponent(String(data.id))}`)
            .then((commissionResponse) => {
              const records = commissionResponse.data?.commissions
                ?? commissionResponse.data?.data?.commissions
                ?? [];
              setCommissionRecords(Array.isArray(records) ? records : []);
            })
            .catch((error: unknown) => {
              console.error("Failed to load commission history:", error);
              setCommissionRecords([]);
              setCommissionError(
                error instanceof Error
                  ? error.message
                  : "Unable to load commission history."
              );
            })
            .finally(() => setCommissionLoading(false));

          api.get(`/bank/user/${encodeURIComponent(data.id)}`)
            .then((bankResponse) => {
              const accounts = bankResponse.data?.data ?? bankResponse.data?.accounts ?? [];
              setBankAccounts(Array.isArray(accounts) ? accounts : []);
            })
            .catch((error: unknown) => { console.error("Failed to load bank accounts:", error); setBankError(error instanceof Error ? error.message : "Unable to load bank accounts. Please try again."); })
            .finally(() => setBankLoading(false));
        } else {
          setBankLoading(false);
        }
        if (data?.profileImage) setPhoto(data.profileImage);
      })
      .catch((error: unknown) => { console.error("Failed to load profile:", error); setProfileError(error instanceof Error ? error.message : "Unable to load your profile. Please try again."); })
      .finally(() => setProfileLoading(false));

    api.get("/profile/dashboard")
      .then((response) => {
        const payload = response.data?.data ?? response.data;
        const rawStats = payload?.stats ?? null;

        const stats = rawStats && typeof rawStats === "object"
          ? {
              ...rawStats,
              totalApplications: Number(rawStats.totalApplications ?? 0),
              approvedLoans: Number(rawStats.approvedLoans ?? 0),
              pendingLoans: Number(rawStats.pendingLoans ?? 0),
              rejectedLoans: Number(rawStats.rejectedLoans ?? 0),
              disbursedLoans: Number(rawStats.disbursedLoans ?? 0),
              approvalRate: Number(rawStats.approvalRate ?? 0),
              disbursalRate: Number(rawStats.disbursalRate ?? 0),
            }
          : null;

        setDashboardStats(stats);

        const history = payload?.commissionHistory;
        setMonthlyHistory(Array.isArray(history) ? history : []);
      })
      .catch((error) => {
        console.error("Failed to load dashboard stats:", error);
        setDashboardStats(null);
        setMonthlyHistory([]);
      })
      .finally(() => setDashboardLoading(false));

    api.get("/profile/notifications")
      .then((response) => {
        const items = response.data?.items ?? response.data?.data?.items ?? [];
        setProfileNotifications(Array.isArray(items) ? items : []);
        setNotificationsError("");
      })
      .catch((error: unknown) => {
        console.error("Failed to load profile notifications:", error);
        setNotificationsError(
          error instanceof Error ? error.message : "Unable to load notifications."
        );
      })
      .finally(() => setNotificationsLoading(false));

    api.get("/profile/activity")
      .then((response) => {
        const items = response.data?.items ?? response.data?.data?.items ?? [];
        setProfileActivities(Array.isArray(items) ? items : []);
        setActivitiesError("");
      })
      .catch((error: unknown) => {
        console.error("Failed to load profile activity:", error);
        setActivitiesError(
          error instanceof Error ? error.message : "Unable to load activity history."
        );
      })
      .finally(() => setActivitiesLoading(false));
    api.get("/profile/kyc")
      .then((response) => {
        const record = response.data?.item ?? response.data?.data?.item ?? null;
        setKycRecord(record);
      })
      .catch((error) => console.error("Failed to load KYC:", error))
      .finally(() => setKycLoading(false));

    api.get("/profile/documents")
      .then((response) => {
        const items = response.data?.items ?? response.data?.data?.items ?? [];
        setDocuments(Array.isArray(items) ? items : []);
        setDocumentsError("");
      })
      .catch((error: unknown) => {
        console.error("Failed to load profile documents:", error);
        setDocumentsError(
          error instanceof Error
            ? error.message
            : "Unable to load documents. Please try again."
        );
      })
      .finally(() => setDocumentsLoading(false));
  }, []);
  const fileRef = useRef<HTMLInputElement>(null);
  const savePersonalInfo = async () => {
    setSavingPersonal(true);
    setPersonalMessage("");
    try {
      const response = await api.put("/profile/personal-info", {
        name: personalForm.name.trim(),
        phoneNo: personalForm.phoneNo.trim(),
        ...(personalForm.dob ? { dob: personalForm.dob } : {}),
      });
      const updated = response.data?.user ?? response.data?.data?.user ?? response.data?.data;
      if (updated) setProfile((current) => ({ ...(current ?? {}), ...updated }));
      else {
        const refreshed = await api.get("/profile/me");
        const data = refreshed.data?.user ?? refreshed.data?.data?.user ?? refreshed.data?.data ?? refreshed.data;
        setProfile(data);
        if (data?.id) {
          setCommissionLoading(true);
          setCommissionError("");
          api.get(`/commission/user/${encodeURIComponent(String(data.id))}`)
            .then((commissionResponse) => {
              const records = commissionResponse.data?.commissions
                ?? commissionResponse.data?.data?.commissions
                ?? [];
              setCommissionRecords(Array.isArray(records) ? records : []);
            })
            .catch((error: unknown) => {
              console.error("Failed to load commission history:", error);
              setCommissionRecords([]);
              setCommissionError(
                error instanceof Error
                  ? error.message
                  : "Unable to load commission history."
              );
            })
            .finally(() => setCommissionLoading(false));

          api.get(`/bank/user/${encodeURIComponent(data.id)}`)
            .then((bankResponse) => {
              const accounts = bankResponse.data?.data ?? bankResponse.data?.accounts ?? [];
              setBankAccounts(Array.isArray(accounts) ? accounts : []);
            })
            .catch((error: unknown) => { console.error("Failed to load bank accounts:", error); setBankError(error instanceof Error ? error.message : "Unable to load bank accounts. Please try again."); })
            .finally(() => setBankLoading(false));
        } else {
          setBankLoading(false);
        }
      }
      setEditingPersonal(false);
      setPersonalMessage("Personal information saved successfully.");
    } catch (error: unknown) {
      setPersonalMessage(error instanceof Error ? error.message : "Could not save changes. Please try again.");
    } finally {
      setSavingPersonal(false);
    }
  };

  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      input.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be below 5 MB.");
      input.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/upload/profile-image", formData);
      const result = response.data?.data ?? response.data;
      const imageUrl = result?.profileImage ?? result?.fileUrl;

      if (!imageUrl) {
        throw new Error("Upload response did not contain the image URL.");
      }

      setPhoto(imageUrl);
      setProfile((current) => current ? { ...current, profileImage: imageUrl } : current);
      alert("Profile photo updated successfully.");
    } catch (error: unknown) {
      console.error("Profile photo upload failed:", error);
      alert(error instanceof Error ? error.message : "Photo upload failed. Please try again.");
    } finally {
      input.value = "";
    }
  };

  const statCards = [
    {
      label: "Total Applications",
      value: dashboardLoading ? "Ã¢â‚¬Â¦" : String(dashboardStats?.totalApplications ?? 0),
      change: "",
      icon: FileText,
    },
    {
      label: "Approved Loans",
      value: dashboardLoading ? "Ã¢â‚¬Â¦" : String(dashboardStats?.approvedLoans ?? 0),
      change: "",
      icon: CheckCircle2,
    },
    {
      label: "Disbursed Volume",
      value: "Ã¢â‚¬â€Ã‚Â",
      change: "",
      icon: TrendingUp,
    },
    {
      label: "Total Earnings",
      value: dashboardLoading ? "Ã¢â‚¬Â¦" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(dashboardStats?.totalEarnings ?? 0)),
      change: "",
      icon: Wallet,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f3f6fc] px-3 py-5 sm:px-5 md:px-7 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] space-y-7">

        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span>DSA Portal</span>
              <ChevronRight size={15} />
              <span className="font-medium text-slate-700">Profile</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl">
              My Profile
            </h1>

            <p className="mt-1 text-base text-slate-500">
              Manage your DSA identity, KYC, bank details, earnings and account settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge type={profile?.isBlocked ? "danger" : "success"}>{profileLoading ? "Loading..." : profile?.isBlocked ? "Account Blocked" : "Account Active"}</StatusBadge>
            <button
              onClick={() => setActiveTab("personal")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </div>

        {(profileError || bankError) && (
          <div
            role="alert"
            className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p className="font-bold">Some profile information could not be loaded</p>
            {profileError && (
              <p className="mt-1">Profile: {profileError}</p>
            )}
            {bankError && (
              <p className="mt-1">Bank accounts: {bankError}</p>
            )}
            <p className="mt-2 text-amber-800">
              Please refresh the page or try again later.
            </p>
          </div>
        )}
        {/* PROFILE HERO */}
        <section className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.09)] transition-shadow duration-300 hover:shadow-[0_22px_65px_rgba(15,23,42,0.13)]">
          <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#061435] via-[#123f91] to-[#087f8c] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(45,212,191,0.30),transparent_55%)] after:absolute after:inset-0 after:bg-[linear-gradient(120deg,transparent_35%,rgba(255,255,255,0.10),transparent_70%)] sm:h-36" />

          <div className="relative px-6 pb-6 md:px-8">
            <div className="-mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              <div className="flex flex-col items-start gap-5 md:flex-row md:items-end">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-blue-600 to-cyan-400 text-4xl font-extrabold text-white shadow-xl">
                    {photo ? (
                      <img src={photo} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      "D"
                    )}
                  </div>

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                    title="Change photo"
                  >
                    <Camera size={17} />
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className="hidden"
                  />
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-slate-950">
                      {profile?.name || (profileLoading ? "Loading..." : "Ã¢â‚¬â€Ã‚Â")}
                    </h2>
                    <StatusBadge type={profile?.isVerified ? "success" : "warning"}>{profileLoading ? "Loading..." : profile?.isVerified ? "Verified" : "Verification Pending"}</StatusBadge>
                  </div>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    DSA ID: <span className="font-bold text-slate-800">{profile?.id || "Ã¢â‚¬â€Ã‚Â"}</span>
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Phone size={15} /> {profile?.phoneNo || "Ã¢â‚¬â€Ã‚Â"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Mail size={15} /> {profile?.email || "Ã¢â‚¬â€Ã‚Â"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} /> {[profile?.city, profile?.state, profile?.address].filter(Boolean).join(", ") || "Ã¢â‚¬â€Ã‚Â"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Profile Completion
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-slate-900">{dashboardLoading ? "Ã¢â‚¬Â¦" : `${dashboardStats?.profileCompletion ?? "Ã¢â‚¬â€Ã‚Â"}${dashboardStats?.profileCompletion != null ? "%" : ""}`}</p>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                    Partner Since
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-emerald-800">{profile?.createdAt ? new Date(profile.createdAt).getFullYear() : "Ã¢â‚¬â€Ã‚Â"}</p>
                </div>
              </div>
            </div>

            <div className="mt-7 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400" style={{ width: `${dashboardStats?.profileCompletion ?? 0}%` }} />
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_5px_22px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_14px_30px_rgba(37,99,235,0.10)] before:absolute before:left-0 before:top-0 before:h-1 before:w-full before:bg-gradient-to-r before:from-blue-700 before:to-teal-400 before:opacity-0 before:transition-opacity group-hover:before:opacity-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-950">{item.value}</p>
                    <p className="mt-1 text-xs font-bold text-emerald-600">
                      {item.change} this month
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN LAYOUT */}
        <div className="grid items-start gap-5 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-7">

          {/* PROFILE NAV */}
          <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_28px_rgba(15,23,42,0.05)] lg:sticky lg:top-5">
            <div className="px-3 py-3">
              <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Profile Management
              </p>
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-gradient-to-r from-[#0b3b91] to-[#1768d5] text-white shadow-lg shadow-blue-900/20 ring-1 ring-blue-500/20"
                        : "text-slate-600 hover:bg-blue-50/80 hover:text-blue-800"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{tab.label}</span>
                    {active && <ChevronRight size={16} />}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CONTENT */}
          <div className="space-y-6">

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <>
                <SectionCard
                  title="Account Overview"
                  subtitle="Your complete DSA account snapshot"
                  icon={User}
                  action={
                    <button
                      onClick={() => setActiveTab("personal")}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  }
                >
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    <InfoRow label="Full Name" value={profile?.name || (profileLoading ? "Loading..." : "Ã¢â‚¬â€Ã‚Â")} />
                    <InfoRow label="DSA ID" value="Ã¢â‚¬â€Ã‚Â" />
                    <InfoRow label="Mobile Number" value={profile?.phoneNo || "Ã¢â‚¬â€Ã‚Â"} icon={Phone} />
                    <InfoRow label="Email Address" value={profile?.email || "Ã¢â‚¬â€Ã‚Â"} icon={Mail} />
                    <InfoRow label="Location" value={[profile?.city, profile?.state, profile?.address].filter(Boolean).join(", ") || "Ã¢â‚¬â€Ã‚Â"} icon={MapPin} />
                    <InfoRow label="Account Status" value={profile?.isBlocked ? "Blocked" : profile?.isActive === false ? "Inactive" : profile?.isVerified ? "Active & Verified" : "Active Ã¢â‚¬â€Ã‚Â verification status unavailable"} />
                  </div>
                </SectionCard>

                <div className="grid gap-6 xl:grid-cols-2">
                  <SectionCard
                    title="Verification Status"
                    subtitle="Your important verification checkpoints"
                    icon={ShieldCheck}
                  >
                    <div className="space-y-4">
                      {([
                        ["PAN Verification", String(kycRecord?.panVerificationStatus ?? "NOT AVAILABLE")],
                        ["Mobile Verification", profile?.phoneVerified === true ? "VERIFIED" : profile?.phoneVerified === false ? "NOT VERIFIED" : "NOT AVAILABLE"],
                        ["Email Verification", profile?.emailVerified === true ? "VERIFIED" : profile?.emailVerified === false ? "NOT VERIFIED" : "NOT AVAILABLE"],
                        ["Bank Account", bankAccounts.length > 0 ? "ADDED Ã¢â‚¬â€Ã‚Â VERIFICATION UNKNOWN" : bankLoading ? "LOADING" : "NOT AVAILABLE"],
                        ["Agreement", "NOT AVAILABLE"],
                      ] as [string, string][]).map(([name, status]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="text-emerald-500" size={19} />
                            <span className="text-sm font-semibold text-slate-700">{name}</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-600">{status}</span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Quick Actions"
                    subtitle="Frequently used profile actions"
                    icon={Activity}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {([
                        ["Update Personal Details", "personal", User],
                        ["Complete KYC", "kyc", ShieldCheck],
                        ["Manage Bank Account", "bank", Landmark],
                        ["Security Settings", "security", Lock],
                      ] as [string, Tab, LucideIcon][]).map(([label, tab, Icon]) => (
                        <button
                          key={label}
                          onClick={() => setActiveTab(tab)}
                          className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Icon size={18} />
                          </span>
                          <span className="flex-1 text-sm font-bold text-slate-700">{label}</span>
                          <ChevronRight size={16} className="text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </SectionCard>
                </div>
              </>
            )}
            {/* PERSONAL */}
            {activeTab === "personal" && (
              <SectionCard
                title="Personal Information"
                subtitle="Edit the personal details supported by your account"
                icon={User}
                action={
                  editingPersonal ? (
                    <button type="button" onClick={() => { setEditingPersonal(false); setPersonalMessage(""); }} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">Cancel</button>
                  ) : (
                    <button type="button" onClick={() => { setPersonalForm({ name: profile?.name ?? "", phoneNo: profile?.phoneNo ?? "", dob: profile?.dob ? String(profile.dob).slice(0, 10) : "" }); setPersonalMessage(""); setEditingPersonal(true); }} className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600">
                      <Pencil size={15} /> Edit
                    </button>
                  )
                }
              >
                {editingPersonal ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">Full Name
                      <input value={personalForm.name} onChange={(e) => setPersonalForm((v) => ({ ...v, name: e.target.value }))} required maxLength={100} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">Mobile Number
                      <input value={personalForm.phoneNo} onChange={(e) => setPersonalForm((v) => ({ ...v, phoneNo: e.target.value }))} required inputMode="tel" maxLength={20} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">Date of Birth
                      <input type="date" value={personalForm.dob} onChange={(e) => setPersonalForm((v) => ({ ...v, dob: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-500" />
                    </label>
                    <button type="button" disabled={savingPersonal || !personalForm.name.trim() || !personalForm.phoneNo.trim()} onClick={savePersonalInfo} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{savingPersonal ? "Saving..." : "Save Changes"}</button>
                  </div>
                ) : (
                  <div className="grid gap-x-8 md:grid-cols-2">
                    <InfoRow label="Full Name" value={profile?.name || (profileLoading ? "Loading..." : "Ã¢â‚¬â€Ã‚Â")} />
                    <InfoRow label="Date of Birth" value={profile?.dob ? String(profile.dob).slice(0, 10) : "Not provided"} />
                    <InfoRow label="Mobile Number" value={profile?.phoneNo || "Ã¢â‚¬â€Ã‚Â"} icon={Phone} />
                    <InfoRow label="Email Address" value={profile?.email || "Ã¢â‚¬â€Ã‚Â"} icon={Mail} />
                    <InfoRow label="Gender" value="Not available" />
                    <InfoRow label="PAN Number" value="Not available" />
                    <InfoRow label="Referral Code" value="Not available" />
                    <InfoRow label="Preferred Language" value="Not available" />
                  </div>
                )}
                {personalMessage && <p role="status" className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{personalMessage}</p>}
              </SectionCard>
            )}


            {/* BUSINESS */}
            {activeTab === "business" && (
              <SectionCard
                title="Business & DSA Information"
                subtitle="Your professional and business profile"
                icon={Briefcase}
                action={
                  <button className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600">
                    <Pencil size={15} />
                    Edit
                  </button>
                }
              >
                <div className="grid gap-x-8 md:grid-cols-2">
                  <InfoRow label="Business Name" value="DSA FinCorp" />
                  <InfoRow label="Business Type" value="Loan DSA / Financial Services" />
                  <InfoRow label="Business Category" value="Loan & Credit Distribution" />
                  <InfoRow label="Experience" value="5+ Years" />
                  <InfoRow label="Business PAN" value="ABCDE****F" />
                  <InfoRow label="GST Status" value="Registered" />
                  <InfoRow label="Operating Area" value="Bihar & Nearby States" />
                  <InfoRow label="Partner Type" value="Individual DSA" />
                </div>
              </SectionCard>
            )}

            {/* KYC */}
            {activeTab === "kyc" && (
              <SectionCard
                title="KYC & Verification"
                subtitle="Identity, address and compliance verification"
                icon={ShieldCheck}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {([
                    ["PAN Verification", kycRecord?.panVerificationStatus, "PAN verification status from your KYC record."],
                    ["Identity Verification", kycRecord?.aadhaarVerificationStatus, "Identity verification status from your KYC record."],
                    ["Address Verification", kycRecord?.status, "Overall KYC status; separate address verification is not recorded here."],
                    ["Bank Verification", bankAccounts.find((account) => account.isPrimary)?.verificationStatus ?? bankAccounts[0]?.verificationStatus, "Bank account verification status from your saved bank account."],
                    ["Business Verification", null, "No separate business verification status is available here."],
                    ["Agreement", null, "Agreement status is not available from the current profile API."],
                  ] as [string, unknown, string][]).map(([title, rawStatus, description]) => {
                    const status = rawStatus == null || String(rawStatus).trim() === "" ? "NOT AVAILABLE" : String(rawStatus).replace(/_/g, " ").toUpperCase();
                    const badgeType = ["VERIFIED", "APPROVED", "ACTIVE"].includes(String(rawStatus ?? "").toUpperCase())
                      ? "success"
                      : String(rawStatus ?? "").toUpperCase() === "REJECTED"
                        ? "danger"
                        : "warning";
                    return (
                    <div
                      key={title}
                      className="rounded-2xl border border-slate-200 p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{title}</h3>
                          <p className="mt-1 text-sm text-slate-500">{description}</p>
                        </div>
                        <StatusBadge type={badgeType}>{kycLoading && title !== "Bank Verification" ? "Loading..." : bankLoading && title === "Bank Verification" ? "Loading..." : status}</StatusBadge>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </SectionCard>
            )}

            {/* BANK */}
            {activeTab === "bank" && (
              <SectionCard
                title="Bank & Payout Details"
                subtitle="Manage your verified payout account"
                icon={Landmark}
                action={
                  <button
                    type="button"
                    onClick={() => router.push("/customer/bank-accounts")}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-bold text-blue-600"
                  >
                    <Landmark size={15} />
                    Manage Accounts
                  </button>
                }
              >
                <div className="mb-5 rounded-2xl bg-gradient-to-r from-[#071a45] to-[#0b4dbb] p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-blue-100">Primary Payout Account</p>
                      <h3 className="mt-2 text-xl font-extrabold">{bankLoading ? "Loading account..." : bankAccounts.length ? String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0]).bankName ?? "Bank account saved") : "Not configured"}</h3>
                    </div>
                    <StatusBadge type={bankAccounts.some((account) => String(account.verificationStatus ?? "").toUpperCase() === "VERIFIED") ? "success" : "warning"}>{bankLoading ? "Loading..." : bankAccounts.length ? String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0]).verificationStatus ?? "PENDING").replace(/_/g, " ") : "Not configured"}</StatusBadge>
                  </div>

                  <p className="mt-7 text-xl font-bold tracking-widest">
                    {bankLoading ? "Loading account details..." : bankAccounts.length ? `Account ending ${String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0]).accountNumber ?? "").slice(-4) || "Ã¢â‚¬â€Ã‚Â"}` : "Account details unavailable"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-10 text-sm">
                    <div>
                      <p className="text-blue-200">Account Holder</p>
                      <p className="mt-1 font-bold">{String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0])?.accountHolderName ?? profile?.name ?? (profileLoading ? "Loading..." : "Not available"))}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">IFSC</p>
                      <p className="mt-1 font-bold">{String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0])?.ifscCode ?? "Not available")}</p>
                    </div>
                    <div>
                      <p className="text-blue-200">Branch</p>
                      <p className="mt-1 font-bold">{String((bankAccounts.find((account) => account.isPrimary) ?? bankAccounts[0])?.branchName ?? "Not available")}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-x-8 md:grid-cols-2">
                  <InfoRow label="Payout Cycle" value="Not configured" />
                  <InfoRow label="Next Payout" value="Not available" />
                  <InfoRow label="Payout Status" value={profile?.isBlocked ? "Account blocked" : "Payout status unavailable"} />
                  <InfoRow label="Minimum Payout" value="Not configured" />
                </div>
              </SectionCard>
            )}

            {/* COMMISSION */}
            {activeTab === "commission" && (
              <SectionCard
                title="Commission & Earnings"
                subtitle="Track your DSA revenue and payouts"
                icon={Wallet}
              >
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ["Total Earned", new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(dashboardStats?.totalEarnings ?? 0))],
                    ["This Month", new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(dashboardStats?.thisMonthEarnings ?? 0))],
                    ["Pending", new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(dashboardStats?.pendingCommission ?? 0))],
                    ["Paid Out", new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(dashboardStats?.paidOut ?? 0))],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-sm font-medium text-slate-500">{label}</p>
                      <p className="mt-2 text-2xl font-extrabold text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-4 gap-3 bg-slate-50 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    <span>Date</span>
                    <span>Loan / Source</span>
                    <span>Loan Amount</span>
                    <span>Commission / Status</span>
                  </div>

                  {commissionLoading ? (
                    <div className="border-t border-slate-100 bg-white px-5 py-10 text-center text-sm text-slate-500">
                      Loading your commission history...
                    </div>
                  ) : commissionError ? (
                    <div className="border-t border-slate-100 bg-white px-5 py-8 text-center">
                      <p className="font-semibold text-red-600">Unable to load commission history</p>
                      <p className="mt-2 break-words text-sm text-slate-500">{commissionError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const userId = profile?.id;
                          if (!userId) return;
                          setCommissionLoading(true);
                          setCommissionError("");
                          api.get(`/commission/user/${encodeURIComponent(String(userId))}`)
                            .then((response) => {
                              const records = response.data?.commissions
                                ?? response.data?.data?.commissions
                                ?? [];
                              setCommissionRecords(Array.isArray(records) ? records : []);
                            })
                            .catch((error: unknown) => {
                              setCommissionError(error instanceof Error ? error.message : "Unable to load commission history.");
                            })
                            .finally(() => setCommissionLoading(false));
                        }}
                        className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Retry
                      </button>
                    </div>
                  ) : commissionRecords.length > 0 ? (
                    <div className="divide-y divide-slate-100 bg-white">
                      {commissionRecords.map((item, index) => {
                        const record = item as Record<string, unknown>;
                        const loan = record.loan && typeof record.loan === "object"
                          ? record.loan as Record<string, unknown>
                          : {};
                        const amount = Number(
                          record.loanAmount ?? loan.amount ?? record.principalAmount ?? 0
                        );
                        const earnings = Number(
                          record.commissionAmount ?? record.commission ?? record.payoutAmount ?? record.amount ?? 0
                        );
                        const status = String(record.status ?? "PENDING").toUpperCase();
                        const dateValue = record.createdAt ?? record.updatedAt;
                        const date = dateValue
                          ? new Date(String(dateValue)).toLocaleDateString("en-IN")
                          : "â€”";
                        const loanLabel = String(
                          loan.loanType ?? record.source ?? record.loanType ?? record.loanId ?? "Loan commission"
                        );
                        const statusClass = status === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : status === "APPROVED"
                            ? "bg-blue-50 text-blue-700"
                            : status === "REJECTED"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700";

                        return (
                          <div key={String(record.id ?? `${date}-${index}`)} className="grid grid-cols-4 items-center gap-3 px-5 py-4 text-sm">
                            <span className="text-slate-600">{date}</span>
                            <span className="break-words font-medium text-slate-800">{loanLabel}</span>
                            <span className="text-slate-700">
                              {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)}
                            </span>
                            <span className="flex flex-col items-start gap-1">
                              <span className="font-bold text-slate-900">
                                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(earnings)}
                              </span>
                              <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusClass}`}>
                                {status}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border-t border-slate-100 bg-white px-5 py-8">
                      <div className="mx-auto flex max-w-md flex-col items-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Wallet className="h-7 w-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Your commission history</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          No commission records are linked to your account yet. Genuine commission records will appear here when available.
                        </p>
                        <div className="mt-5 grid w-full grid-cols-2 gap-3 text-left sm:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 p-3">
                            <p className="text-xs text-slate-500">Pending</p>
                            <p className="mt-1 font-bold text-amber-600">Awaiting review</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 p-3">
                            <p className="text-xs text-slate-500">Approved</p>
                            <p className="mt-1 font-bold text-blue-600">Ready for payout</p>
                          </div>
                          <div className="rounded-xl border border-slate-200 p-3">
                            <p className="text-xs text-slate-500">Paid</p>
                            <p className="mt-1 font-bold text-emerald-600">Payout complete</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </SectionCard>
            )}
            {/* LENDERS */}
            {activeTab === "lenders" && (
              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0b1f44] via-[#c8a45d] to-[#0b1f44]" />
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1f44] text-[#e8cb85]">
                        <Landmark size={23} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a17c35]">PARTNER NETWORK</p>
                        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">Lender Directory & Access</h2>
                        <p className="mt-1 text-sm text-slate-500">Live lender and product serviceability data</p>
                      </div>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                      <ShieldCheck size={15} className="text-[#a17c35]" />
                      Directory data Â· Access approval separate
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-3 sm:p-5">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Landmark size={15} /> Lenders in directory
                      </div>
                      <p className="mt-2 text-2xl font-extrabold text-slate-900">{lendersLoading ? "â€¦" : lenders.length}</p>
                      <p className="mt-1 text-xs text-slate-500">Distinct lender names in the database</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <BarChart3 size={15} /> Serviceability records
                      </div>
                      <p className="mt-2 text-2xl font-extrabold text-blue-800">{lendersLoading ? "â€¦" : lenderTotalRecords.toLocaleString("en-IN")}</p>
                      <p className="mt-1 text-xs text-slate-500">Pincode serviceability records</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Lock size={15} /> Your access approval
                      </div>
                      <p className="mt-2 text-sm font-bold text-slate-900">Not verified here</p>
                      <p className="mt-1 text-xs text-slate-500">Directory records do not grant DSA access</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="lender-search" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Search lenders or products</label>
                      <input
                        id="lender-search"
                        value={lenderSearch}
                        onChange={(event) => setLenderSearch(event.target.value)}
                        placeholder="e.g. Flexiloan, Business Loan..."
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label htmlFor="lender-product-filter" className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Filter by product</label>
                      <select
                        id="lender-product-filter"
                        value={lenderProductFilter}
                        onChange={(event) => setLenderProductFilter(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="All">All products</option>
                        {Array.from(new Set(lenders.flatMap((lender) => lender.products))).sort().map((product) => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {lendersLoading ? (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-700" />
                    <p className="mt-4 text-sm font-semibold text-slate-700">Loading live lender dataâ€¦</p>
                    <p className="mt-1 text-xs text-slate-500">Fetching records from your backend</p>
                  </div>
                ) : lenderError ? (
                  <div className="rounded-2xl border border-rose-200 bg-white p-6 text-center">
                    <AlertCircle className="mx-auto text-rose-600" size={30} />
                    <h3 className="mt-3 font-bold text-slate-900">Unable to load lender directory</h3>
                    <p className="mt-2 break-words text-sm text-slate-600">{lenderError}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("overview")}
                      className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Back to overview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("lenders")}
                      className="ml-2 mt-4 rounded-xl bg-[#0b1f44] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-900"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  (() => {
                    const query = lenderSearch.trim().toLowerCase();
                    const filteredLenders = lenders.filter((lender) => {
                      const matchesSearch =
                        !query ||
                        lender.name.toLowerCase().includes(query) ||
                        lender.products.some((product) => product.toLowerCase().includes(query));
                      const matchesProduct =
                        lenderProductFilter === "All" ||
                        lender.products.includes(lenderProductFilter);
                      return matchesSearch && matchesProduct;
                    });

                    return filteredLenders.length === 0 ? (
                      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                        <Landmark className="mx-auto text-slate-400" size={32} />
                        <h3 className="mt-3 font-bold text-slate-900">
                          {lenders.length === 0 ? "No lender records returned" : "No matching lenders"}
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          {lenders.length === 0
                            ? "The API returned no directory entries. Confirm that the backend is running and the database contains serviceability records."
                            : "Try a different lender name or product filter."}
                        </p>
                        {(lenderSearch || lenderProductFilter !== "All") && (
                          <button
                            type="button"
                            onClick={() => {
                              setLenderSearch("");
                              setLenderProductFilter("All");
                            }}
                            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">
                          Showing <span className="font-bold text-slate-800">{filteredLenders.length}</span> of {lenders.length} lenders
                        </p>
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {filteredLenders.map((lender) => (
                            <div key={lender.name} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#d7bd7d] hover:shadow-xl hover:shadow-slate-200/60">
                              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0b1f44] to-[#c8a45d]" />
                              <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e8d7ad] bg-[#fffaf0] text-lg font-extrabold text-[#8b6a2b]">
                                  {lender.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="break-words font-bold text-slate-900">{lender.name}</h3>
                                  <p className="mt-1 text-xs text-slate-500">Pincode serviceability directory</p>
                                </div>
                              </div>
                              <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-slate-50 p-3">
                                  <p className="text-xs text-slate-500">Records</p>
                                  <p className="mt-1 text-lg font-extrabold text-slate-900">{lender.records.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="rounded-xl bg-blue-50 p-3">
                                  <p className="text-xs text-blue-700">Product records</p>
                                  <p className="mt-1 text-lg font-extrabold text-blue-900">{lender.productRecords.toLocaleString("en-IN")}</p>
                                </div>
                              </div>
                              <div className="mt-4 border-t border-slate-100 pt-4">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Available product types in source data</p>
                                {lender.products.length > 0 ? (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {lender.products.map((product) => (
                                      <span key={product} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">{product}</span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="mt-2 text-sm text-slate-500">No product type recorded</p>
                                )}
                              </div>
                              <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3">
                                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-amber-700" />
                                <p className="text-xs leading-5 text-amber-900">Directory listing only. Individual DSA approval is not confirmed by these records.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()
                )}
              </div>
            )}


            {/* TEAM */}
            {activeTab === "team" && (
              <SectionCard
                title="Team & Sub-Agent Management"
                subtitle="Manage your team members and delegated access"
                icon={Users}
              >
                <div className="mb-5 flex items-center justify-between rounded-2xl bg-blue-50 p-5">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Team Members</p>
                    <p className="mt-1 text-2xl font-extrabold text-blue-950">{teamLoading ? "ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦" : teamMembers.length}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push("/dsa/sub-agent/add")}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white"
                  >
                    + Add Member
                  </button>
                </div>

                {teamError && (
                  <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{teamError}</p>
                )}
                {teamLoading && (
                  <p className="py-6 text-center text-sm text-slate-500">Loading team membersÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦</p>
                )}
                {!teamLoading && !teamError && teamMembers.length === 0 && (
                  <p className="py-6 text-center text-sm text-slate-500">No Sub-Agents found for this account.</p>
                )}
                {!teamLoading && teamMembers.map((member, i) => {
                  const name = String(member.name || "Unnamed Sub-Agent");
                  const phone = String(member.phoneNo || "");
                  const email = String(member.email || "");
                  const isBlocked = member.isBlocked === true;
                  const isActive = member.isActive === true;
                  const statusLabel = isBlocked ? "Blocked" : isActive ? "Active" : "Inactive";
                  const badgeType = isBlocked ? "danger" : isActive ? "success" : "warning";
                  return (
                    <div
                      key={String(member.id || `${name}-${i}`)}
                      className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-0"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800">{name}</p>
                        <p className="truncate text-sm text-slate-500">
                          {[phone, email].filter(Boolean).join(" Ãƒâ€šÃ‚Â· ") || "Contact details unavailable"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {member.city ? String(member.city) : ""}
                          {member.state ? `, ${String(member.state)}` : ""}
                        </p>
                      </div>
                      <StatusBadge type={badgeType}>{statusLabel}</StatusBadge>
                    </div>
                  );
                })}
              </SectionCard>
            )}

            {/* PERFORMANCE */}
            {activeTab === "performance" && (
              <SectionCard
                title="Performance & Analytics"
                subtitle="Track your DSA business performance"
                icon={BarChart3}
              >
                {(() => {
                  const total = Number(dashboardStats?.totalApplications ?? 0);
                  const approved = Number(dashboardStats?.approvedLoans ?? 0);
                  const disbursed = Number(dashboardStats?.disbursedLoans ?? 0);
                  const conversion = total ? Math.round((disbursed / total) * 100) : 0;
                  const approval = total ? Math.round((approved / total) * 100) : 0;
                  const disbursal = approved ? Math.round((disbursed / approved) * 100) : 0;
                  const metrics: [string, string, string, number][] = [
                    ["Conversion Rate", total ? `${conversion}%` : "\u2014", "Disbursed / total applications", conversion],
                    ["Approval Rate", total ? `${approval}%` : "\u2014", "Approved or disbursed / applications", approval],
                    ["Disbursal Rate", approved ? `${disbursal}%` : "\u2014", "Disbursed / approved loans", disbursal],
                  ];
                  const months = monthlyHistory.slice(-6);
                  const maxApplications = Math.max(1, ...months.map((item) => Number(item.applications ?? 0)));
                  return (
                    <>
                      <div className="grid gap-5 md:grid-cols-3">
                        {metrics.map(([title, value, change, progress]) => (
                          <div key={title} className="rounded-2xl border border-slate-200 p-5">
                            <p className="text-sm font-medium text-slate-500">{title}</p>
                            <p className="mt-2 text-3xl font-extrabold text-slate-950">{value}</p>
                            <p className="mt-2 text-sm text-slate-500">{change}</p>
                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                              <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-slate-900">Monthly Loan Volume</h3>
                            <p className="mt-1 text-sm text-slate-500">Applications submitted in the last 6 months</p>
                          </div>
                          <TrendingUp className="text-emerald-500" />
                        </div>
                        {months.length === 0 ? (
                          <p className="mt-8 text-sm text-slate-500">No monthly history available yet.</p>
                        ) : (
                          <div className="mt-8 flex h-48 items-end gap-4">
                            {months.map((item, index) => {
                              const count = Number(item.applications ?? 0);
                              const height = count ? Math.max(5, (count / maxApplications) * 100) : 0;
                              return (
                                <div key={String(item.month ?? index)} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                                  <span className="text-xs font-bold text-slate-600">{count}</span>
                                  <div className="flex h-36 w-full items-end">
                                    <div
                                      className="w-full rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400"
                                      style={{ height: `${height}%` }}
                                      title={`${String(item.month ?? "")}: ${count} applications; disbursed volume â‚¹${Number(item.disbursed ?? 0).toLocaleString("en-IN")}`}
                                    />
                                  </div>
                                  <span className="text-center text-xs font-semibold text-slate-400">{String(item.month ?? "")}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </SectionCard>
            )}

            {/* DOCUMENTS */}
            {activeTab === "documents" && (
              <SectionCard
                title="Documents & Agreements"
                subtitle="Documents and verification status from your account"
                icon={FileText}
              >
                {documentsLoading ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-6 text-sm text-slate-600">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    Loading your documents...
                  </div>
                ) : documentsError ? (
                  <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
                    <p className="font-bold">Unable to load documents</p>
                    <p className="mt-1">{documentsError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setDocumentsLoading(true);
                        setDocumentsError("");
                        api.get("/profile/documents")
                          .then((response) => {
                            const items = response.data?.items ?? response.data?.data?.items ?? [];
                            setDocuments(Array.isArray(items) ? items : []);
                          })
                          .catch((error: unknown) => {
                            setDocumentsError(
                              error instanceof Error
                                ? error.message
                                : "Unable to load documents. Please try again."
                            );
                          })
                          .finally(() => setDocumentsLoading(false));
                      }}
                      className="mt-3 rounded-xl bg-rose-700 px-4 py-2 font-semibold text-white hover:bg-rose-800"
                    >
                      Try again
                    </button>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                      <FileText size={26} />
                    </div>
                    <p className="mt-4 font-bold text-slate-800">No documents found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Documents linked to your account will appear here once uploaded.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {documents.map((document, index) => {
                      const title = String(
                        document.documentName ?? document.documentType ?? "Document"
                      );
                      const status = String(document.status ?? "PENDING").toUpperCase();
                      const rejectionReason = String(document.rejectionReason ?? "");
                      const fileUrl = String(document.fileUrl ?? "");
                      const statusType =
                        ["VERIFIED", "APPROVED"].includes(status)
                          ? "success"
                          : ["REJECTED", "DECLINED"].includes(status)
                            ? "danger"
                            : "warning";

                      return (
                        <div
                          key={String(document.id ?? `${title}-${index}`)}
                          className="flex min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                            <FileText size={21} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-words font-bold text-slate-900">{title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {document.createdAt
                                ? `Added ${new Date(String(document.createdAt)).toLocaleDateString()}`
                                : "Document record"}
                            </p>
                            {rejectionReason && status === "REJECTED" && (
                              <p className="mt-2 break-words text-sm text-rose-700">
                                <span className="font-semibold">Reason:</span> {rejectionReason}
                              </p>
                            )}
                            {fileUrl && (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
                              >
                                View document
                              </a>
                            )}
                          </div>
                          <StatusBadge type={statusType}>
                            {status.replace(/[_-]/g, " ")}
                          </StatusBadge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            )}
            {/* SECURITY */}
            {activeTab === "security" && (
              <SectionCard
                title="Security & Login"
                subtitle="Protect your DSA account"
                icon={Lock}
              >
                <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  Security settings and active login sessions are not available through this profile page. The statuses below are not confirmed.
                </div>
                <div className="space-y-4">
                  {[
                    ["Password", "Password change status unavailable"],
                    ["Two-Factor Authentication", "Configuration status unavailable"],
                    ["Login Alerts", "Alert preference status unavailable"],
                    ["Active Sessions", "Session information unavailable"],
                  ].map(([title, description]) => (
                    <div
                      key={title}
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 md:flex-row md:items-center"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                        <Lock size={19} className="text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{description}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-500">Not available</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <SectionCard
                title="Notifications"
                subtitle="Account updates from the server"
                icon={Bell}
              >
                {notificationsLoading ? (
                  <div className="py-10 text-center text-sm text-slate-500">
                    Loading notifications...
                  </div>
                ) : notificationsError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{notificationsError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsLoading(true);
                        setNotificationsError("");
                        api.get("/profile/notifications")
                          .then((response) => {
                            const items = response.data?.items ?? response.data?.data?.items ?? [];
                            setProfileNotifications(Array.isArray(items) ? items : []);
                          })
                          .catch((error: unknown) => {
                            console.error("Failed to reload notifications:", error);
                            setNotificationsError(error instanceof Error ? error.message : "Unable to load notifications.");
                          })
                          .finally(() => setNotificationsLoading(false));
                      }}
                      className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Retry
                    </button>
                  </div>
                ) : profileNotifications.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 px-5 py-10 text-center">
                    <Bell className="mx-auto mb-3 text-slate-400" size={28} />
                    <h3 className="font-semibold text-slate-800">No notifications yet</h3>
                    <p className="mt-1 text-sm text-slate-500">New account updates will appear here when available.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {profileNotifications.map((item, index) => {
                      const title = typeof item.title === "string" ? item.title : "Account notification";
                      const message = typeof item.message === "string" ? item.message : "";
                      const createdAt = typeof item.createdAt === "string" || typeof item.createdAt === "number"
                        ? new Date(item.createdAt)
                        : null;
                      const validDate = createdAt && !Number.isNaN(createdAt.getTime());
                      const isRead = item.isRead === true;

                      return (
                        <div
                          key={typeof item.id === "string" || typeof item.id === "number" ? item.id : `${title}-${index}`}
                          className="flex gap-3 rounded-2xl border border-slate-200 p-4"
                        >
                          <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isRead ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-700"}`}>
                            <Bell size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-900">{title}</h3>
                              {!isRead && (
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                  Unread
                                </span>
                              )}
                            </div>
                            {message && <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{message}</p>}
                            {validDate && (
                              <p className="mt-2 text-xs text-slate-400">{createdAt.toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            )}

            {/* ACTIVITY */}
            {activeTab === "activity" && (
              <SectionCard
                title="Recent Account Activity"
                subtitle="Recent records returned by the profile activity API"
                icon={Activity}
              >
                {activitiesLoading ? (
                  <div className="py-10 text-center text-sm text-slate-500">
                    Loading account activity...
                  </div>
                ) : activitiesError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">{activitiesError}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setActivitiesLoading(true);
                        setActivitiesError("");
                        api.get("/profile/activity")
                          .then((response) => {
                            const items = response.data?.items ?? response.data?.data?.items ?? [];
                            setProfileActivities(Array.isArray(items) ? items : []);
                          })
                          .catch((error: unknown) => {
                            console.error("Failed to reload profile activity:", error);
                            setActivitiesError(error instanceof Error ? error.message : "Unable to load account activity.");
                          })
                          .finally(() => setActivitiesLoading(false));
                      }}
                      className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Retry
                    </button>
                  </div>
                ) : profileActivities.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 px-5 py-10 text-center">
                    <Activity className="mx-auto mb-3 text-slate-400" size={28} />
                    <h3 className="font-semibold text-slate-800">No recent activity</h3>
                    <p className="mt-1 text-sm text-slate-500">There are no activity records available to display.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {profileActivities.map((item, index) => {
                      const title = typeof item.title === "string" ? item.title : "Account notification";
                      const description = typeof item.message === "string" ? item.message : "";
                      const createdAt = typeof item.createdAt === "string" || typeof item.createdAt === "number"
                        ? new Date(item.createdAt)
                        : null;
                      const validDate = createdAt && !Number.isNaN(createdAt.getTime());

                      return (
                        <div
                          key={typeof item.id === "string" || typeof item.id === "number" ? item.id : `${title}-${index}`}
                          className="flex gap-4 border-b border-slate-100 py-5 last:border-0"
                        >
                          <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <CheckCircle2 size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-1 md:flex-row">
                              <h3 className="font-bold text-slate-900">{title}</h3>
                              {validDate && (
                                <span className="text-xs font-medium text-slate-400">{createdAt.toLocaleString()}</span>
                              )}
                            </div>
                            {description && <p className="mt-1 whitespace-pre-wrap text-sm text-slate-500">{description}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </SectionCard>
            )}
            {/* ADMIN CONTROL NOTICE */}
            <div className="flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <AlertCircle className="mt-0.5 shrink-0 text-amber-600" size={21} />
              <div>
                <h3 className="font-bold text-amber-900">Profile Control & Verification</h3>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Certain sensitive information such as KYC status, bank verification,
                  lender access, commission configuration and account status may require
                  Super Admin approval in the production system.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}















































