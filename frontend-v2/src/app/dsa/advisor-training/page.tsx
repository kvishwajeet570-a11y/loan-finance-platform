"use client";

import ReactMarkdown from "react-markdown";

import React, { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileVideo,
  GraduationCap,
  LayoutDashboard,
  MessageCircle,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  Users,
  Video,
  X,
} from "lucide-react";

type PublishedTraining = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  type: string;
  fileUrl: string;
  fileName: string;
  posterUrl?: string | null;
  status: string;
};

const TRAINING_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const TRAINING_API_ORIGIN = TRAINING_API_BASE.replace(/\/api$/, "");

function trainingAssetUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${TRAINING_API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}
export default function AdvisorTrainingPage() {
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  const [liveSessionsLoading, setLiveSessionsLoading] = useState(true);
  const [liveSessionsError, setLiveSessionsError] = useState("");
  const [showAllLiveSessions, setShowAllLiveSessions] = useState(false);
  const [registeringSessionId, setRegisteringSessionId] = useState<string | null>(null);
  const [liveSessionMessage, setLiveSessionMessage] = useState("");
  const [trainingQuestion, setTrainingQuestion] = useState("");
  const [trainingAnswer, setTrainingAnswer] = useState("");
  const [trainingAiLoading, setTrainingAiLoading] = useState(false);
  const [trainingAiError, setTrainingAiError] = useState("");
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [showFullCurriculum, setShowFullCurriculum] = useState(false);

  const liveSessionApiBase = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  ).replace(/\/$/, "");

  const getLiveSessionToken = () =>
    typeof window === "undefined" ? "" :
      localStorage.getItem("loan_finance_token") ||
      localStorage.getItem("token") || "";

  async function askTrainingAssistant(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || trainingAiLoading) return;

    setTrainingQuestion(cleanQuestion);
    setTrainingAnswer("");
    setTrainingAiError("");
    setTrainingAiLoading(true);

    try {
      const response = await fetch(`${liveSessionApiBase}/ai/marketing-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getLiveSessionToken()}`
        },
        body: JSON.stringify({
          question: cleanQuestion,
          loanType: "DSA Training and Loan Products"
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.success === false) {
        throw new Error(
          payload.message || `AI request failed (${response.status}). Please try again.`
        );
      }

      if (typeof payload.answer !== "string" || !payload.answer.trim()) {
        throw new Error("The AI service returned an empty answer. Please try again.");
      }

      setTrainingAnswer(payload.answer.trim());
    } catch (error) {
      setTrainingAiError(
        error instanceof Error
          ? error.message
          : "Unable to contact the AI service. Check your connection and try again."
      );
    } finally {
      setTrainingAiLoading(false);
    }
  }

  async function loadLiveSessions() {
    setLiveSessionsLoading(true);
    setLiveSessionsError("");
    try {
      const response = await fetch(`${liveSessionApiBase}/live-sessions`, {
        headers: { Authorization: `Bearer ${getLiveSessionToken()}` },
        cache: "no-store",
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
      }
      const list = Array.isArray(payload) ? payload :
        Array.isArray(payload.sessions) ? payload.sessions :
        Array.isArray(payload.data) ? payload.data :
        Array.isArray(payload.data?.sessions) ? payload.data.sessions : [];
      setLiveSessions(list);
    } catch (error) {
      setLiveSessionsError(error instanceof Error ? error.message : "Unable to load sessions.");
    } finally {
      setLiveSessionsLoading(false);
    }
  }

  useEffect(() => {
    void loadLiveSessions();
  }, []);

  async function registerLiveSession(sessionId: string) {
    setRegisteringSessionId(sessionId);
    setLiveSessionMessage("");
    try {
      const response = await fetch(
        `${liveSessionApiBase}/live-sessions/${encodeURIComponent(sessionId)}/register`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getLiveSessionToken()}` },
        }
      );
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || `Registration failed (${response.status})`);
      }
      setLiveSessionMessage("Registration successful.");
      await loadLiveSessions();
    } catch (error) {
      setLiveSessionMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally {
      setRegisteringSessionId(null);
    }
  }
  const [activeCategory, setActiveCategory] = useState("All Courses");
  const [showUpload, setShowUpload] = useState(false);
  const [communityTitle,setCommunityTitle]=useState("");
  const [communityCategory,setCommunityCategory]=useState("Loan Products");
  const [communityDescription,setCommunityDescription]=useState("");
  const [communityPoster,setCommunityPoster]=useState<File|null>(null);
  const [communityVideo,setCommunityVideo]=useState<File|null>(null);
  const [communityPosterPreview,setCommunityPosterPreview]=useState("");
  const [communityVideoPreview,setCommunityVideoPreview]=useState("");
  const [communityUploadBusy,setCommunityUploadBusy]=useState(false);
  const [communityUploadError,setCommunityUploadError]=useState("");
  const [communityUploadNotice,setCommunityUploadNotice]=useState("");
  const [playing, setPlaying] = useState<string | null>(null);
  const [publishedTraining, setPublishedTraining] = useState<PublishedTraining[]>([]);
  const [mySubmittedTraining, setMySubmittedTraining] = useState<PublishedTraining[]>([]);
  const [myTrainingLoading, setMyTrainingLoading] = useState(true);
  const [myTrainingError, setMyTrainingError] = useState('');
  const publishedCourseCount = publishedTraining.length;
  const [trainingLoading, setTrainingLoading] = useState(true);
  const [trainingError, setTrainingError] = useState("");
  const [activeTraining, setActiveTraining] = useState<PublishedTraining | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPublishedTraining() {
      setTrainingLoading(true);
      setTrainingError("");

      try {
        const authToken =
          localStorage.getItem("loan_finance_token") ||
          localStorage.getItem("token") ||
          "";

        const response = await fetch(`${TRAINING_API_BASE}/training`, {
          headers: authToken
            ? { Authorization: `Bearer ${authToken}` }
            : {},
          cache: "no-store",
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            result.message || result.error || `HTTP ${response.status}`
          );
        }

        if (!cancelled) {
          const rows = Array.isArray(result.data) ? result.data : [];
          setPublishedTraining(
            rows.filter((item: PublishedTraining) => item.status === "PUBLISHED")
          );
        }
      } catch (error) {
        if (!cancelled) {
          setTrainingError(
            error instanceof Error
              ? error.message
              : "Training material is not available yet."
          );
        }
      } finally {
        if (!cancelled) setTrainingLoading(false);
      }
    }

    void loadPublishedTraining();

  return () => {
      cancelled = true;
    };
  }, []);


    async function loadMyDsaTraining() {
      setMyTrainingLoading(true);
      setMyTrainingError("");
      try {
        const authToken =
          localStorage.getItem("loan_finance_token") ||
          localStorage.getItem("token") ||
          "";
        if (!authToken) throw new Error("Session nahi mila. Dobara login karein.");

        const response = await fetch(`${TRAINING_API_BASE}/training/dsa/mine`, {
          headers: { Authorization: `Bearer ${authToken}` },
          cache: "no-store",
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.success === false) {
          throw new Error(result.message || `HTTP ${response.status}`);
        }
        setMySubmittedTraining(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        setMyTrainingError(error instanceof Error ? error.message : "Your videos could not be loaded.");
      } finally {
        setMyTrainingLoading(false);
      }
    }

    useEffect(() => {
      void loadMyDsaTraining();
    }, []);

    async function submitCommunityTraining(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setCommunityUploadError(""); setCommunityUploadNotice("");
    if(!communityTitle.trim()||!communityPoster||!communityVideo){setCommunityUploadError("Title, poster aur video select karein.");return;}
    if(communityPoster.size>10*1024*1024){setCommunityUploadError("Poster maximum 10 MB ka hona chahiye.");return;}
    if(communityVideo.size>200*1024*1024){setCommunityUploadError("Video maximum 200 MB ka hona chahiye.");return;}
    if(!["image/jpeg","image/png","image/webp"].includes(communityPoster.type)){setCommunityUploadError("Poster JPG, PNG ya WEBP hona chahiye.");return;}
    if(!["video/mp4","video/webm","video/quicktime"].includes(communityVideo.type)){setCommunityUploadError("Video MP4, WebM ya MOV hona chahiye.");return;}
    const authToken=localStorage.getItem("loan_finance_token")||localStorage.getItem("token")||"";
    if(!authToken){setCommunityUploadError("Session nahi mila. Dobara login karein.");return;}
    setCommunityUploadBusy(true);
    try{
      const form=new FormData();form.append("title",communityTitle.trim());form.append("category",communityCategory);form.append("description",communityDescription.trim());form.append("type","VIDEO");form.append("file",communityVideo);form.append("poster",communityPoster);
      const response=await fetch(`${TRAINING_API_BASE}/training/dsa/submit`,{method:"POST",headers:{Authorization:`Bearer ${authToken}`},body:form});
      const payload=await response.json().catch(()=>({}));if(!response.ok||payload.success===false)throw new Error(payload.message||payload.error||`Upload failed (${response.status})`);
      setCommunityUploadNotice("Training admin review ke liye submit ho gayi hai.");
      await loadMyDsaTraining();setShowUpload(false);setCommunityTitle("");setCommunityCategory("Loan Products");setCommunityDescription("");setCommunityPoster(null);setCommunityVideo(null);setCommunityPosterPreview("");setCommunityVideoPreview("");
    }catch(e){setCommunityUploadError(e instanceof Error?e.message:"Upload failed.");}finally{setCommunityUploadBusy(false);}
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 h-[70px] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-full items-center gap-5 px-5 lg:px-7">
          <button className="rounded-xl p-2 text-slate-700 hover:bg-slate-100">
            <LayoutDashboard size={22} />
          </button>

          <div className="relative max-w-[390px] flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search anything..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <button className="relative rounded-xl p-2 hover:bg-slate-100">
              <Bell size={21} />
              <span className="absolute right-1 top-1 rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <img
                src="https://i.pravatar.cc/100?img=11"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100"
                alt="Profile"
              />
              <div>
                <p className="text-sm font-bold">DSA Partner</p>
                <p className="text-xs text-slate-500">Advanced Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7">
        {/* BREADCRUMB */}
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>
          <ChevronRight size={15} />
          <span className="font-semibold text-slate-800">
            Advanced Training
          </span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#071b52] via-[#102e9c] to-[#3820b9] p-7 text-white shadow-xl lg:p-9">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute right-[28%] top-0 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold backdrop-blur-md">
                <GraduationCap size={16} />
                DSA FinCorp Learning Academy
              </div>

              <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
                Advanced{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-300 bg-clip-text text-transparent">
                  Training
                </span>{" "}
                Program
              </h1>

              <p className="mt-3 max-w-2xl text-lg font-medium text-blue-100">
                Learn - Grow - Earn More
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/85">
                Master loan products, sales techniques, compliance and digital
                tools with our AI-powered training platform.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {[
                  ["Video Courses", Video],
                  ["Live Sessions", Users],
                  ["Expert Mentorship", Users],
                  ["Certificates", Award],
                ].map(([label, Icon]: any) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold backdrop-blur-md"
                  >
                    <Icon size={16} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[230px] lg:block">
              <div className="absolute right-0 top-0 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2 font-bold">
                  <Sparkles className="text-yellow-300" size={20} />
                  AI Powered Learning
                </div>
              </div>

              <div className="absolute bottom-0 right-5 rounded-3xl bg-white/10 p-4 backdrop-blur-md">
                <div className="flex h-44 w-64 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-300/30 to-purple-400/30">
                  <GraduationCap size={110} className="text-white/90" />
                </div>
              </div>

              <div className="absolute bottom-7 left-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-xs text-blue-100">Your Progress</p>
                <p className="text-sm font-bold">Progress not tracked</p>
              </div>
            </div>
          </div>
        </section>

        {/* KPI */}
        <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {[
            [GraduationCap, String(publishedCourseCount), "Published Courses"],
            [Users, "-", "DSA Trained"],
            [BarChart3, "-", "Completion Rate"],
            [Star, "-", "Average Rating"],
            [Award, "-", "Certificates Earned"],
          ].map(([Icon, value, label]: any) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={22} />
              </div>
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_320px]">
          <div>
            {/* LEARNING PATH */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-black">
                    <Target className="text-blue-600" size={21} />
                    Recommended Learning Path
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Start with these modules to become a successful DSA
                    partner.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullCurriculum((current) => !current)}
                  aria-expanded={showFullCurriculum}
                  className="rounded-xl border border-blue-200 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                >
                  {showFullCurriculum ? "Hide Curriculum" : "View Full Curriculum"}
                </button>
              </div>

              {showFullCurriculum && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    ["1. Foundation", "DSA role, customer handling and loan basics."],
                    ["2. Loan Products", "Personal, business, home and property-backed loans."],
                    ["3. Sales & Pitching", "Lead qualification, customer conversations and objections."],
                    ["4. Compliance", "Documentation, customer consent and responsible selling."],
                    ["5. Advanced", "Case studies, follow-ups and process improvement."]
                  ].map(([title, description]) => (
                    <div key={title} className="rounded-xl border border-blue-100 bg-blue-50 p-3">
                      <h3 className="text-xs font-black text-blue-900">{title}</h3>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{description}</p>
                    </div>
                  ))}
                  <p className="sm:col-span-2 lg:col-span-5 text-xs text-slate-500">
                    These are curriculum overview topics, not verified course completion records. Actual training materials appear below when published by Admin.
                  </p>
                </div>
              )}

              <div className="mt-8 flex items-start">
                {[
                  ["1", "Foundation", "Start Here"],
                  ["2", "Loan Products", "Learn Products"],
                  ["3", "Sales & Pitching", "Improve Skills"],
                  ["4", "Compliance", "Stay Compliant"],
                  ["5", "Advanced", "Expert Level"],
                ].map(([num, title, sub], index) => (
                  <React.Fragment key={num}>
                    <div className="min-w-0 flex-1 text-center">
                      <div
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-black text-white ${
                          index === 0
                            ? "bg-emerald-500"
                            : index < 3
                            ? "bg-blue-500"
                            : "bg-slate-300"
                        }`}
                      >
                        {num}
                      </div>
                      <p className="mt-2 text-[11px] font-bold">{title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{sub}</p>
                    </div>

                    {index < 4 && (
                      <div className="mt-4 h-0.5 flex-1 bg-slate-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>

                        {/* COMMUNITY VIDEO / POSTER UPLOAD */}
            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-black">
                    <Video className="text-blue-600" size={21} />
                    DSA Community Training Videos
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Members & leaders can share their own training videos, posters and knowledge.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUpload(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-200"
                >
                  <Plus size={17} />
                  Upload Training Video
                </button>
              </div>

              {communityUploadNotice && (
                <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
                  {communityUploadNotice}
                </p>
              )}

              <div className="mt-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-extrabold text-slate-800">My Uploaded Videos</h3>
                  <button
                    type="button"
                    onClick={() => void loadMyDsaTraining()}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-50"
                  >
                    Refresh videos
                  </button>
                </div>

                {myTrainingLoading ? (
                  <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">Loading your videos...</p>
                ) : myTrainingError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                    <p>{myTrainingError}</p>
                    <button type="button" onClick={() => void loadMyDsaTraining()} className="mt-2 font-bold underline">Try again</button>
                  </div>
                ) : mySubmittedTraining.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <Video className="mx-auto text-slate-400" size={32} />
                    <p className="mt-3 font-bold text-slate-700">No uploaded videos yet</p>
                    <p className="mt-1 text-sm text-slate-500">Upload a training video to see it here, including its review status.</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {mySubmittedTraining.map((item) => (
                      <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        {item.type?.toUpperCase() === "VIDEO" ? (
                          <video
                            controls
                            preload="metadata"
                            playsInline
                            poster={item.posterUrl ? trainingAssetUrl(item.posterUrl) : undefined}
                            src={trainingAssetUrl(item.fileUrl)}
                            className="aspect-video w-full bg-slate-950 object-contain"
                          >
                            Your browser does not support video playback.
                          </video>
                        ) : (
                          <div className="flex aspect-video items-center justify-center bg-slate-100">
                            <Video size={36} className="text-slate-400" />
                          </div>
                        )}

                        <div className="p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">{item.category}</span>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${
                              item.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "PENDING_REVIEW"
                                ? "bg-amber-100 text-amber-800"
                                : item.status === "ARCHIVED"
                                ? "bg-slate-200 text-slate-700"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.status === "PENDING_REVIEW" ? "Pending Review" : item.status === "PUBLISHED" ? "Published" : item.status === "ARCHIVED" ? "Archived" : item.status}
                            </span>
                          </div>
                          <h4 className="mt-3 break-words font-extrabold text-slate-900">{item.title}</h4>
                          {item.description && <p className="mt-1 line-clamp-3 text-sm text-slate-500">{item.description}</p>}
                          <p className="mt-3 text-xs text-slate-400">Your submitted training resource</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>

                        {/* POPULAR COURSES */}
            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <BookOpen className="text-purple-600" size={21} />
                  Popular Training Courses
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Training resources published by Admin.
                </p>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {["All Courses", ...Array.from(new Set(publishedTraining.map((item) => item.category).filter(Boolean)))].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCategory(tab)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold ${
                      activeCategory === tab
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {trainingLoading ? (
                <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
                  Loading published training...
                </p>
              ) : trainingError ? (
                <p role="alert" className="mt-5 rounded-xl bg-amber-50 p-5 text-sm text-amber-800">
                  {trainingError}
                </p>
              ) : publishedTraining.filter((item) => activeCategory === "All Courses" || item.category === activeCategory).length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <BookOpen className="mx-auto text-slate-400" size={30} />
                  <p className="mt-3 font-bold text-slate-700">No published courses yet</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Published training resources will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {publishedTraining
                    .filter((item) => activeCategory === "All Courses" || item.category === activeCategory)
                    .map((item) => {
                      const isVideo = item.type?.toUpperCase() === "VIDEO";
                      const assetUrl = trainingAssetUrl(item.fileUrl);

                      return (
                        <article
                          key={item.id}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
                        >
                          <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-700">
                            {item.posterUrl ? <img src={trainingAssetUrl(item.posterUrl)} alt={item.title + " poster"} className="absolute inset-0 h-full w-full object-cover" /> : isVideo ? <Video className="text-white/80" size={44} /> : <FileVideo className="text-white/80" size={44} />}
                            <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-blue-700">
                              {item.type || "TRAINING"}
                            </span>
                          </div>

                          <div className="p-4">
                            <h3 className="min-h-[42px] text-sm font-black leading-5">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500">
                              {item.category}
                            </p>
                            {item.description && (
                              <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                                {item.description}
                              </p>
                            )}
                            <a
                              href={assetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white"
                            >
                              Open Training <ChevronRight size={15} />
                            </a>
                          </div>
                        </article>
                      );
                    })}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            {/* PROGRESS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-black">Your Learning Progress</h3>
                <BarChart3 className="text-blue-600" size={20} />
              </div>

              <div className="mt-5 flex items-center gap-5">
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-full"
                  style={{
                    background:
                      "conic-gradient(#e5e7eb 0 100%, #e5e7eb 100% 100%)",
                  }}
                >
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-sm font-black">-</span>
                    <span className="text-[10px] text-slate-500">Completed</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <p>
                    <b>-</b>
                    <br />
                    <span className="text-slate-500">Courses Completed</span>
                  </p>
                  <p>
                    <b>-</b>
                    <br />
                    <span className="text-slate-500">Video Lessons</span>
                  </p>
                  <p>
                    <b>-</b>
                    <br />
                    <span className="text-slate-500">Assessments Passed</span>
                  </p>
                </div>
              </div>
            </section>

            {/* AI ASSISTANT */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">
                      AI Training Assistant
                    </h3>
                    <p className="text-[10px] text-emerald-600">
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  "What is the difference between LAP and Home Loan?",
                  "How to handle customer objections?",
                  "Explain RBI guidelines in simple words",
                  "Give me a sales pitch for personal loan",
                  "What documents are required for business loan?",
                ].map((q) => (
                  <button
                    type="button"
                    key={q}
                    disabled={trainingAiLoading}
                    onClick={() => void askTrainingAssistant(q)}
                    className="w-full rounded-xl bg-slate-50 p-3 text-left text-[11px] font-semibold text-slate-600 hover:bg-blue-50 disabled:opacity-50"
                  >
                    <MessageCircle
                      size={13}
                      className="mr-2 inline text-blue-500"
                    />
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="mt-4 flex items-center gap-2 rounded-xl border border-slate-200 p-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void askTrainingAssistant(trainingQuestion);
                }}
              >
                <input
                  value={trainingQuestion}
                  onChange={(e) => setTrainingQuestion(e.target.value)}
                  disabled={trainingAiLoading}
                  placeholder="Ask anything about training..."
                  aria-label="Ask the AI Training Assistant"
                  className="min-w-0 flex-1 px-2 text-xs outline-none"
                />
                <button
                  type="submit"
                  disabled={trainingAiLoading || !trainingQuestion.trim()}
                  aria-label="Send question"
                  className="rounded-lg bg-blue-600 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {trainingAiLoading ? "..." : <ChevronRight size={16} />}
                </button>
              </form>

              {trainingAiLoading && (
                <p role="status" className="mt-3 text-xs text-blue-600">
                  AI is preparing your answer...
                </p>
              )}

              {trainingAiError && (
                <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700">
                  {trainingAiError}
                </p>
              )}

              {trainingAnswer && (
                <section aria-live="polite" className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 shadow-sm ring-1 ring-blue-100/50">
                  <div className="flex items-center justify-between gap-3 border-b border-blue-100/80 bg-white/80 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900">AI Response</p>
                        <p className="text-[11px] text-slate-500">Your personalized training answer</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-semibold text-blue-700">AI INSIGHT</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto overscroll-contain px-4 py-4 text-sm leading-6 text-slate-700 whitespace-pre-wrap break-words [scrollbar-width:thin] [scrollbar-color:#93b4f5_#eaf1ff] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-blue-50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 hover:[&::-webkit-scrollbar-thumb]:bg-blue-400">
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <h1 className="mb-3 mt-4 text-lg font-extrabold text-slate-900 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-bold text-slate-900 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-bold text-blue-900 first:mt-0">{children}</h3>,
                        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-slate-900">{children}</strong>,
                        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
                        li: ({ children }) => <li className="pl-1">{children}</li>,
                        hr: () => <hr className="my-4 border-blue-200" />,
                        code: ({ children }) => <code className="rounded bg-blue-100 px-1 py-0.5 text-xs text-blue-900">{children}</code>,
                      }}
                    >
                      {trainingAnswer.replace(/\\\*/g, "*")}
                    </ReactMarkdown>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 border-t border-blue-100/80 bg-white/70 px-3 py-2">
                    <ChevronRight className="h-3.5 w-3.5 -rotate-90 text-blue-500" />
                    <p className="text-[11px] font-medium text-slate-500">Scroll inside this box to read the full answer</p>
                  </div>
                </section>
              )}
            </section>

            {/* LIVE SESSIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div className="flex items-center justify-between">
    <h3 className="font-black">Live Training Sessions</h3>
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => void loadLiveSessions()}
        className="text-xs font-bold text-slate-500">Refresh</button>
      <span className="text-xs text-slate-500">
        {liveSessions.length} session{liveSessions.length === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        disabled={liveSessions.length <= 2}
        onClick={() => setShowAllLiveSessions((v) => !v)}
        aria-expanded={showAllLiveSessions}
        className="text-xs font-bold text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        {showAllLiveSessions ? "Show Less" : "View All"}
      </button>
    </div>
  </div>
  {liveSessionsLoading ? (
    <p className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-500">Loading sessions...</p>
  ) : liveSessionsError ? (
    <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p role="alert" className="text-sm text-amber-800">{liveSessionsError}</p>
      <button type="button" onClick={() => void loadLiveSessions()} className="mt-2 text-xs font-bold text-blue-700">Try again</button>
    </div>
  ) : liveSessions.length === 0 ? (
    <div className="mt-4 rounded-xl border border-dashed border-slate-300 p-5 text-center">
      <Video className="mx-auto text-slate-400" size={24} />
      <p className="mt-2 text-sm font-bold text-slate-700">No live sessions scheduled</p>
      <p className="mt-1 text-xs text-slate-500">Published sessions from Admin will appear here.</p>
    </div>
  ) : (
    <div className="mt-4 space-y-3">
      {(showAllLiveSessions ? liveSessions : liveSessions.slice(0, 2)).map((session: any) => {
        const registered = Boolean(session.isRegistered || session.registered || session.registrations?.length);
        const startDate = new Date(session.startsAt);
        return (
          <div key={session.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                <Video size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="rounded bg-red-500 px-1.5 py-0.5 text-[8px] font-black text-white">LIVE SESSION</span>
                <p className="mt-1 text-xs font-black text-slate-800">{session.title}</p>
                {!Number.isNaN(startDate.getTime()) && (
                  <p className="mt-1 text-[10px] text-slate-500">
                    {startDate.toLocaleString()}{session.platform ? ` - ${session.platform}` : ""}
                  </p>
                )}
                {session.description && <p className="mt-1 text-xs text-slate-500">{session.description}</p>}
                <p className="mt-1 text-[10px] text-slate-500">
                  {session._count?.registrations ?? session.registrationCount ?? 0} registered
                </p>
              </div>
            </div>
            <button type="button"
              disabled={registeringSessionId === session.id || registered}
              onClick={() => void registerLiveSession(session.id)}
              className="mt-3 w-full rounded-lg bg-blue-600 py-2 text-[10px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {registered ? "Registered" : registeringSessionId === session.id ? "Registering..." : "Register Now"}
            </button>
            {registered && session.meetingLink && (
              <a href={session.meetingLink} target="_blank" rel="noreferrer"
                className="mt-2 block text-center text-xs font-bold text-blue-600">Open meeting link</a>
            )}
          </div>
        );
      })}
    </div>
  )}
  {liveSessionMessage && <p role="status" className="mt-3 text-xs font-semibold text-blue-700">{liveSessionMessage}</p>}
</section>
          </aside>
        </div>

        {/* BOTTOM ACTIONS */}
        <section className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            [Award, "Get Certified", "Complete courses and get certified"],
            [TrendingUp, "Track Your Growth", "Monitor your learning progress"],
            [Trophy, "Earn More", "Apply your knowledge and increase earnings"],
          ].map(([Icon, title, desc]: any) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon size={23} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-black">{title}</h3>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
                <button
                  type="button"
                  onClick={() => setExpandedFeature((current) => current === title ? null : title)}
                  aria-expanded={expandedFeature === title}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  {expandedFeature === title ? "Hide Details" : "View Details"}
                </button>
                {expandedFeature === title && (
                  <p role="status" className="mt-2 max-w-xs rounded-lg bg-blue-50 p-3 text-xs leading-5 text-slate-700">
                    {title === "Get Certified"
                      ? "Complete the training resources published by Admin. Certification progress will be available when course completion tracking is connected."
                      : title === "Track Your Growth"
                        ? "Your learning progress and completion statistics are not currently connected to a tracking service."
                        : "Explore loan products and sales training to improve your skills. Earnings are not calculated by this training page."}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>
        {/* PUBLISHED TRAINING FROM ADMIN */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-blue-600">
                DSA Learning Library
              </p>
              <h2 className="mt-1 text-2xl font-black">Published Training from Admin</h2>
              <p className="mt-1 text-sm text-slate-500">
                Videos and documents published by Admin will appear here.
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              {publishedTraining.length} Resources
            </span>
          </div>

          {trainingLoading ? (
            <p className="mt-6 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
              Loading published training...
            </p>
          ) : trainingError ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Could not load data from the Training API.
              </p>
              <p className="mt-1 break-words text-xs text-amber-800">
                {trainingError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-amber-800 px-3 py-2 text-xs font-bold text-white"
              >
                Retry
              </button>
            </div>
          ) : publishedTraining.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <BookOpen className="mx-auto text-slate-400" size={32} />
              <p className="mt-3 font-bold text-slate-700">No published training available yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                Upload training in the Admin Console and publish it.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {publishedTraining.map((item) => {
                const isVideo = item.type?.toUpperCase() === "VIDEO";

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#071b52] via-blue-800 to-indigo-700 text-white">
                      {isVideo ? (
                        <Video size={48} />
                      ) : (
                        <BookOpen size={48} />
                      )}
                    </div>
                    <div className="p-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                        {item.category}
                      </span>
                      <h3 className="mt-3 font-black leading-5">{item.title}</h3>
                      {item.description && (
                        <p className="mt-2 line-clamp-3 text-sm text-slate-500">
                          {item.description}
                        </p>
                      )}
                      <p className="mt-2 truncate text-xs text-slate-400">
                        {item.fileName}
                      </p>

                      {isVideo ? (
                        <button
                          onClick={() => setActiveTraining(item)}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700"
                        >
                          <Play size={15} fill="currentColor" />
                          Play Training
                        </button>
                      ) : (
                        <a
                          href={trainingAssetUrl(item.fileUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-center text-xs font-bold text-white hover:bg-blue-700"
                        >
                          <BookOpen size={15} />
                          Open Document
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      {/* PREMIUM UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-3 backdrop-blur-md sm:p-6">
          <form onSubmit={submitCommunityTraining} className="my-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-white bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-900 to-violet-800 px-6 py-7 text-white sm:px-8">
              <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl"/>
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">DSA Learning Hub</p>
                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">Upload Training Video</h2>
                  <p className="mt-2 text-sm text-blue-100">Share knowledge with the DSA community.</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">Share Knowledge</span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">Admin Review</span>
                  </div>
                </div>
                <button type="button" onClick={() => setShowUpload(false)} disabled={communityUploadBusy} aria-label="Close upload" className="rounded-full border border-white/20 bg-white/10 p-3 hover:bg-white/20"><X size={21}/></button>
              </div>
            </div>

            <div className="max-h-[62vh] space-y-5 overflow-y-auto p-5 sm:p-8">
              {communityUploadError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{communityUploadError}</p>}
              {communityUploadNotice && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{communityUploadNotice}</p>}

              <div className="grid gap-5 md:grid-cols-2">
                <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-slate-900">Training Video <span className="text-red-500">*</span></h3>
                  <p className="mt-1 text-xs text-slate-500">MP4 / MOV / WEBM | Maximum 200 MB</p>
                  <label htmlFor="community-training-video" className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-white/80 p-4 text-center transition hover:border-emerald-500 hover:bg-white">
                    <span className="text-4xl text-emerald-600">Upload</span>
                    <span className="mt-2 max-w-full break-all text-sm font-bold text-slate-800">{communityVideo ? communityVideo.name : "Choose your training video"}</span>
                    <span className="mt-1 text-xs text-slate-500">Browse Videos, Downloads or any folder</span>
                    <span className="mt-3 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow">Browse Videos</span>
                    <input id="community-training-video" required type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" className="sr-only" onChange={e => { const f=e.target.files?.[0]||null; setCommunityVideo(f); setCommunityVideoPreview(f?URL.createObjectURL(f):""); setCommunityUploadError(""); }}/>
                  </label>
                  {communityVideo && <p className="mt-2 break-all rounded-lg bg-white p-2 text-xs text-emerald-800">Selected | {(communityVideo.size/1048576).toFixed(1)} MB</p>}
                  {communityVideoPreview && <video src={communityVideoPreview} controls preload="metadata" className="mt-3 max-h-48 w-full rounded-xl bg-black"/>}
                </section>

                <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-4 sm:p-5">
                  <h3 className="text-sm font-extrabold text-slate-900">Poster / Thumbnail <span className="text-red-500">*</span></h3>
                  <p className="mt-1 text-xs text-slate-500">JPG / PNG / WEBP | Maximum 10 MB</p>
                  <label htmlFor="community-training-poster" className="mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-violet-300 bg-white/80 p-4 text-center transition hover:border-violet-500 hover:bg-white">
                    {communityPosterPreview ? <img src={communityPosterPreview} alt="Poster preview" className="max-h-24 rounded-xl object-contain" /> : <span className="text-4xl text-violet-600">Upload</span>}
                    <span className="mt-2 max-w-full break-all text-sm font-bold text-slate-800">{communityPoster ? communityPoster.name : "Choose poster image"}</span>
                    <span className="mt-1 text-xs text-slate-500">Browse Pictures or any folder</span>
                    <span className="mt-3 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow">Browse Images</span>
                    <input id="community-training-poster" required type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" className="sr-only" onChange={e => { const f=e.target.files?.[0]||null; setCommunityPoster(f); setCommunityPosterPreview(f?URL.createObjectURL(f):""); setCommunityUploadError(""); }}/>
                  </label>
                </section>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-800">Video Title <span className="text-red-500">*</span>
                  <input required maxLength={180} value={communityTitle} onChange={e=>setCommunityTitle(e.target.value)} placeholder="Enter training video title" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"/>
                </label>
                <label className="block text-sm font-bold text-slate-800">Category <span className="text-red-500">*</span>
                  <select value={communityCategory} onChange={e=>setCommunityCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
                    <option>Loan Products</option><option>Sales & Marketing</option><option>Compliance</option><option>Digital Tools</option><option>Customer Handling</option><option>Advanced</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm font-bold text-slate-800">Description <span className="font-normal text-slate-400">(Optional)</span>
                <textarea rows={3} maxLength={2000} value={communityDescription} onChange={e=>setCommunityDescription(e.target.value)} placeholder="Write a short description about this training..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"/>
                <span className="mt-1 block text-right text-xs font-normal text-slate-400">{communityDescription.length}/2000</span>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-gradient-to-r from-blue-50 to-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-slate-500">Your content will be reviewed by an admin.</p>
              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button type="button" disabled={communityUploadBusy} onClick={() => setShowUpload(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" disabled={communityUploadBusy || !communityTitle.trim() || !communityPoster || !communityVideo} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50">
                  {communityUploadBusy ? "Uploading..." : "Submit for Review"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {/* VIDEO PLAYER MODAL */}
      {playing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4">
          <div className="w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between text-white">
              <h3 className="font-bold">{playing}</h3>
              <button
                onClick={() => setPlaying(null)}
                className="rounded-xl bg-white/10 p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
                  <Play size={32} fill="currentColor" />
                </div>
                <p className="mt-4 text-sm font-bold">
                  Video Player Preview
                </p>
                <p className="mt-1 text-xs text-white/60">
                  Backend video streaming can be connected later.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ADMIN-PUBLISHED VIDEO PLAYER */}
      {activeTraining && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeTraining.title}
        >
          <div className="w-full max-w-5xl">
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <div className="min-w-0">
                <h3 className="truncate font-bold">{activeTraining.title}</h3>
                <p className="text-xs text-white/60">{activeTraining.category}</p>
              </div>
              <button
                onClick={() => setActiveTraining(null)}
                className="shrink-0 rounded-xl bg-white/10 p-2 hover:bg-white/20"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
            </div>

            <video
              key={activeTraining.id}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="max-h-[75vh] w-full rounded-2xl bg-black shadow-2xl"
              src={trainingAssetUrl(activeTraining.fileUrl)}
            >
              Your browser does not support HTML video playback.
            </video>

            <p className="mt-3 text-xs text-white/60">
              If the video does not play, check the backend server and uploaded file URL.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
