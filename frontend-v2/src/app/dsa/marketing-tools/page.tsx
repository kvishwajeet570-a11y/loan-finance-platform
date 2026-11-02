"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Globe2,
  FileText,
  Image as ImageIcon,
  Camera,
  Mail,
  Megaphone,
  MessageCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WandSparkles,
  X,
} from "lucide-react";

function formatMarketingAnswer(text: string) {
  const cleaned = text
    .replace(/\\\*\*/g, "**")
    .replace(/\\\*/g, "*")
    .replace(/\r\n/g, "\n");

  return cleaned.split("\n").map((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      return <h3 key={index} className="mt-4 mb-2 text-base font-bold text-slate-900">{trimmed.slice(4)}</h3>;
    }

    if (trimmed.startsWith("## ")) {
      return <h2 key={index} className="mt-4 mb-2 text-lg font-bold text-slate-900">{trimmed.slice(3)}</h2>;
    }

    if (/^---+$/.test(trimmed)) {
      return <hr key={index} className="my-3 border-blue-200" />;
    }

    const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      return <div key={index} className="ml-3 flex gap-2 py-0.5"><span>•</span><span>{renderInline(listMatch[1])}</span></div>;
    }

    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }

    return <p key={index} className="mb-1">{renderInline(trimmed)}</p>;
  });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}
const templates = [
  {
    title: "Personal Loan Offer",
    type: "Personal Loan",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Home Loan Campaign",
    type: "Home Loan",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Business Loan Growth",
    type: "Business Loan",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Car Loan Offer",
    type: "Car Loan",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85",
  },];

export default function MarketingToolsPage() {
  const [tab, setTab] = useState("Social Media Post");
  const [category, setCategory] = useState("All Templates");
  const [showPreview, setShowPreview] = useState(false);
  const [loanType, setLoanType] = useState("Personal Loan");
  const [tone, setTone] = useState("Professional");
  const [language, setLanguage] = useState("English");
  const [customInput, setCustomInput] = useState("");
  const [generatedContent, setGeneratedContent] = useState(
    "Need Funds for Your Dreams?\nGet Personal Loan up to INR 25 Lakh\nMinimum Documentation\nQuick Approval\nAttractive Interest Rates\nTurn your plans into reality with DSA FinCorp. Apply now and explore offers from eligible lenders."
  );
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantReply, setAssistantReply] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [marketingActivity, setMarketingActivity] = useState<string[]>([]);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [leadAnalytics, setLeadAnalytics] = useState<{
    totalLeads: number;
    newLeads: number;
    assignedLeads: number;
  } | null>(null);
  const [dailyLeads, setDailyLeads] = useState<
    Array<{ date: string; count: number }>
  >([]);

  useEffect(() => {
    let mounted = true;

    api.get("/lead/analytics")
      .then((response) => {
        if (mounted && response.data?.success && response.data?.data) {
          setLeadAnalytics({
            totalLeads: Number(response.data.data.totalLeads ?? 0),
            newLeads: Number(response.data.data.newLeads ?? 0),
            assignedLeads: Number(response.data.data.assignedLeads ?? 0),
          });
          setDailyLeads(Array.isArray(response.data.data.dailyLeads) ? response.data.data.dailyLeads : []);
        }
      })
      .catch((error) => {
        console.error("Marketing Tools lead analytics fetch failed:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const generateContent = () => {
    const loanNames: Record<string, string> = {
      "Personal Loan": "personal needs",
      "Business Loan": "business growth",
      "Home Loan": "your dream home",
      "Car Loan": "your next car",
      "Loan Against Property": "funding against eligible property",
      "Credit Card": "everyday spending needs",
    };
    const purpose = loanNames[loanType] || "your financial goals";
    const opening =
      tone === "Friendly" ? "Good news! Let's plan your next step." :
      tone === "Persuasive" ? "Your next financial goal could be closer than you think!" :
      "Looking for support with " + purpose + "?";
    const offer =
      language === "Hindi" ? `${loanType} के लिए जानकारी प्राप्त करें। अपनी पात्रता और उपलब्ध ऑफ़र जानने के लिए DSA FinCorp से संपर्क करें।` :
      language === "Hinglish" ? `${loanType} ke options explore karein. Eligibility aur available offers jaanne ke liye DSA FinCorp se contact karein.` :
      `Explore ${loanType} options with DSA FinCorp. Check eligibility, terms and available offers from participating lenders.`;
    const content = [
      opening,
      language === "Hindi" ? `${loanType} के विकल्प देखें` :
      language === "Hinglish" ? `${loanType} ke options dekhein` :
      `Explore ${loanType} Options`,
      offer,
      customInput.trim(),
      "Terms, eligibility and approval depend on the lender. Apply subject to lender criteria."
    ].filter(Boolean).join("\n\n");
    setGeneratedContent(content);
    setShowPreview(true);
    setMarketingActivity((items) => [
      `${tab} created · ${loanType} · ${new Date().toLocaleTimeString()}`,
      ...items
    ].slice(0, 8));
  };

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setMarketingActivity((items) => ["Content copied · " + new Date().toLocaleTimeString(), ...items].slice(0, 8));
      window.alert("Content copied!");
    } catch {
      window.prompt("Copy your content:", generatedContent);
    }
  };

  const shareContent = (platform: string) => {
    const text = generatedContent;
    const encoded = encodeURIComponent(text);
    const pageUrl = encodeURIComponent(window.location.href);
    if (platform === "Share on WhatsApp") {
      window.open("https://wa.me/?text=" + encoded, "_blank", "noopener,noreferrer");
    } else if (platform === "Share on Telegram") {
      window.open("https://t.me/share/url?url=" + pageUrl + "&text=" + encoded, "_blank", "noopener,noreferrer");
    } else if (platform === "Share on Facebook") {
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + pageUrl + "&quote=" + encoded, "_blank", "noopener,noreferrer");
    } else if (platform === "Send via Email") {
      window.location.href = "mailto:?subject=" + encodeURIComponent("DSA FinCorp - " + loanType) + "&body=" + encoded;
    } else if (platform === "Share on Instagram") {
      void copyContent();
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      window.alert("Caption copied. Instagram par post/story mein paste karke creative upload karein.");
    }
  };

    const askMarketingAssistant = async () => {
    const question = assistantQuestion.trim();
    if (!question || assistantLoading) return;

    setAssistantLoading(true);
    setAssistantReply("");

    try {
      const response = await api.post("/ai/marketing-assistant", {
        question,
        loanType,
      });

      const answer = response.data?.answer;
      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("AI returned an empty response.");
      }

      setAssistantReply(answer.trim());
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setAssistantReply(
        err.response?.data?.message ||
        "Could not connect to the AI assistant. Check that the backend is running and try again."
      );
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#102044]">
      {/* TOP HEADER */}
      <header className="sticky top-0 z-50 h-[68px] border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="flex h-full items-center gap-5 px-5 lg:px-7">
          <button className="rounded-lg p-2 hover:bg-slate-100">
            <span className="block h-[2px] w-5 bg-slate-700" />
            <span className="mt-1.5 block h-[2px] w-5 bg-slate-700" />
            <span className="mt-1.5 block h-[2px] w-5 bg-slate-700" />
          </button>

          <div className="relative w-[330px]">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              placeholder="Search anything..."
              className="w-full rounded-full bg-[#f3f6fb] py-2.5 pl-11 pr-4 text-xs outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-5">
            <button className="relative">
              <Bell size={21} />
              <span className="absolute -right-1 -top-2 rounded-full bg-red-500 px-1.5 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/100?img=11"
                className="h-9 w-9 rounded-full object-cover"
                alt=""
              />
              <div className="hidden sm:block">
                <p className="text-xs font-bold">Pritam Prakash</p>
                <p className="text-[10px] text-slate-500">DSA Partner</p>
              </div>
              <ChevronDown size={15} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-4 lg:px-7">
        {/* BREADCRUMB */}
        <div className="mb-3 flex items-center gap-2 text-xs">
          <span>Dashboard</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="font-bold">Marketing Tools</span>
          <span className="ml-auto hidden text-slate-500 md:block">
            Wed, 08 Oct 2026 &nbsp; 05:06 PM
          </span>
        </div>

        {/* =========================================================
            EXACT COMPACT MARKETING HERO
           ========================================================= */}
        <section className="relative h-[160px] overflow-hidden rounded-[13px] bg-gradient-to-r from-[#071952] via-[#14299a] to-[#0787ca] shadow-lg">
          {/* glow */}
          <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
          <div className="absolute right-[25%] top-0 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="relative z-10 flex h-full items-center px-7">
            {/* LEFT */}
            <div className="w-[62%]">
              <h1 className="text-[38px] font-black leading-none tracking-tight text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
                  AI
                </span>{" "}
                Marketing Assistant
              </h1>

              <p className="mt-2 text-[15px] font-medium text-white/90">
                Grow Your Business with AI - Create, Share & Convert More Leads
              </p>

              <div className="mt-4 flex items-center gap-6">
                {[
                  [WandSparkles, "AI Content Generation"],
                  [FileText, "Ready Templates"],
                  [Share2, "Multi-Channel Sharing"],
                  [BarChart3, "Track Performance"],
                ].map(([Icon, text]: any) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-[10px] font-semibold text-white"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 shadow-lg">
                      <Icon size={13} />
                    </span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT ROBOT / CONTENT */}
            <div className="absolute right-0 top-0 h-full w-[38%]">
              <div className="absolute right-[190px] top-5 rotate-[-7deg] rounded-xl bg-white px-4 py-2 text-[11px] font-black text-blue-700 shadow-xl">
                AI
              </div>

              <div className="absolute bottom-[-16px] right-[125px] flex h-[145px] w-[145px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/30 to-purple-500/40">
                <div className="flex h-[108px] w-[108px] items-center justify-center rounded-[38px] bg-gradient-to-br from-slate-100 to-slate-300 shadow-2xl">
                  <Bot size={70} className="text-blue-700" />
                </div>
              </div>

              <div className="absolute right-[20px] top-[23px] w-[145px] rotate-[-4deg] rounded-xl bg-white p-3 shadow-xl">
                <p className="text-[10px] font-black text-slate-800">
                  Create Marketing
                </p>
                <p className="text-[10px] font-black text-slate-800">
                  Content in Seconds
                </p>
                <button className="mt-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-[8px] font-bold text-white">
                  Generate Now -&gt;
                </button>
              </div>

              <div className="absolute right-[-2px] bottom-[13px] space-y-1">
                {[
                  ["WhatsApp", "bg-green-500"],
                  ["Instagram", "bg-pink-500"],
                  ["Facebook", "bg-blue-600"],
                  ["Email", "bg-sky-500"],
                  ["Telegram", "bg-cyan-500"],
                ].map(([name, color]) => (
                  <div
                    key={name}
                    className={`flex w-[104px] items-center gap-2 rounded-md ${color} px-2 py-1 text-[8px] font-bold text-white shadow`}
                  >
                    <span className="h-3 w-3 rounded-full bg-white/90" />
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="mt-3 grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            [Megaphone, "N/A", "Marketing Campaigns", "No verified campaign count", "N/A"],
            [Users, "N/A", "Total Reach", "No verified reach data", "N/A"],
            [Target, leadAnalytics ? String(leadAnalytics.totalLeads) : "...", "Lead Generated", "Total leads in database", "N/A"],
            [TrendingUp, "N/A", "Conversion Rate", "No verified conversion data", "N/A"],
          ].map(([Icon, value, title, sub, growth]: any) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold">{title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-2xl font-black">{value}</p>
                    {growth !== "N/A" && (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600">
                        {growth}
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500">{sub}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* MAIN GRID */}
        <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_265px]">
          <div className="space-y-3">
            {/* AI CONTENT GENERATOR */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-[16px] font-black">
                    <Sparkles className="text-purple-600" size={19} />
                    AI Content Generator
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Create compelling marketing content for your loan business
                    using AI.
                  </p>
                </div>

                <span className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-[9px] font-bold text-purple-600">
                  Powered by AI
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
                <div>
                  <div className="flex gap-1.5 overflow-x-auto">
                    {[
                      "Social Media Post",
                      "WhatsApp Message",
                      "Email Campaign",
                      "Ad Creative",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => setTab(item)}
                        className={`whitespace-nowrap rounded-lg px-3 py-2 text-[9px] font-bold ${
                          tab === item
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Loan Type", value: loanType, setter: setLoanType, options: ["Personal Loan", "Business Loan", "Home Loan", "Car Loan", "Loan Against Property", "Credit Card"] },
                      { label: "Tone", value: tone, setter: setTone, options: ["Professional", "Friendly", "Persuasive"] },
                      { label: "Language", value: language, setter: setLanguage, options: ["English", "Hindi", "Hinglish"] },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-[9px] font-bold">{field.label}</label>
                        <select
                          value={field.value}
                          onChange={(event) => field.setter(event.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[9px] outline-none focus:border-blue-500"
                        >
                          {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="text-[9px] font-bold">
                      Custom Input (Optional)
                    </label>
                    <input
                      value={customInput}
                      onChange={(event) => setCustomInput(event.target.value)}
                      placeholder="e.g. Special offer for salaried customers"
                      className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-[10px] outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={generateContent}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-3 text-[11px] font-bold text-white shadow-lg"
                  >
                    <Sparkles size={14} />
                    Generate Content Now
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* GENERATED PREVIEW */}
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black">
                      Generated Content Preview
                    </h3>
                    <button onClick={copyContent} className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-bold">
                      <Copy size={11} />
                      Copy
                    </button>
                  </div>

                  <div className="mt-3 text-[10px] leading-5 whitespace-pre-line">
                    {generatedContent}
                  </div>
<div className="mt-2 overflow-hidden rounded-lg bg-gradient-to-r from-[#08285c] to-[#1267a8]">
                    <div className="flex h-[86px] items-center justify-between px-3">
                      <div>
                        <p className="text-[9px] font-bold text-white">
                          Personal Loan
                        </p>
                        <p className="text-[18px] font-black text-yellow-300">
                          INR 25 Lakh
                        </p>
                        <span className="rounded bg-white px-2 py-1 text-[7px] font-bold text-blue-700">
                          Apply Now -&gt;
                        </span>
                      </div>
                      <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-blue-300/30">
                        <Users size={45} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {showPreview && (
                    <p className="mt-2 text-[9px] font-bold text-emerald-600">
                      Content generated successfully
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* MARKETING TEMPLATES */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-[16px] font-black">
                    <ImageIcon className="text-purple-600" size={19} />
                    Marketing Templates
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Ready to use professional templates for your loan business
                  </p>
                </div>

                <button onClick={() => setCategory("All Templates")} className="rounded-lg border border-blue-200 px-3 py-2 text-[9px] font-bold text-blue-600">
                  View All Templates -&gt;
                </button>
              </div>

              <div className="mt-3 flex gap-1.5 overflow-x-auto">
                {[
                  "All Templates",
                  "Personal Loan",
                  "Home Loan",
                  "Business Loan",
                  "Car Loan",
                  "Loan Against Property",
                  "Credit Card",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-lg px-3 py-2 text-[8px] font-bold ${
                      category === item
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {templates.filter((template) => category === "All Templates" || template.type === category).map((template) => (
                  <div
                    key={template.title}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[1.15/1] overflow-hidden">
                      <img
                        src={template.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button onClick={() => { setLoanType(template.type); setCustomInput("Create a campaign for " + template.type + ": " + template.title); setTab("Social Media Post"); setShowPreview(false); }} title={"Use " + template.title} className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-blue-600 shadow">
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="p-3">
                      <p className="text-[12px] font-extrabold leading-5 text-slate-900">
                        {template.title}
                      </p>
                      <span className="mt-2 inline-block rounded-full bg-blue-50 px-2 py-1 text-[8px] font-bold text-blue-600">
                        Social Media
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BOTTOM ANALYTICS */}
            <div className="grid gap-3 lg:grid-cols-2">
              {/* PERFORMANCE */}
              <section className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5">
                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-100/60 blur-3xl" />

                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <TrendingUp size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                          Lead Activity
                        </h2>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                          Daily lead generation overview
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Last 30 Days
                  </span>
                </div>

                <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { label: "Reach", value: "N/A", color: "text-blue-600", bg: "bg-blue-50", icon: Users },
                    { label: "Engagement", value: "N/A", color: "text-violet-600", bg: "bg-violet-50", icon: Target },
                    { label: "Total Leads", value: leadAnalytics ? String(leadAnalytics.totalLeads) : "...", color: "text-emerald-600", bg: "bg-emerald-50", icon: TrendingUp },
                    { label: "Assigned Leads", value: leadAnalytics ? String(leadAnalytics.assignedLeads) : "...", color: "text-orange-600", bg: "bg-orange-50", icon: Users },
                  ].map((stat) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={stat.label} className="rounded-xl border border-slate-100 bg-white/90 p-3 transition-colors hover:border-slate-200 hover:bg-slate-50/80">
                        <div className={`mb-2 flex h-7 w-7 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                          <StatIcon size={14} />
                        </div>
                        <p className={`text-xl font-black tracking-tight ${stat.color}`}>
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold text-slate-500">
                          {stat.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="relative mt-5 rounded-xl border border-slate-100 bg-slate-50/70 px-2 pb-2 pt-4 sm:px-3">
                  {dailyLeads.length > 0 ? (
                    <>
                      <div className="relative h-36 sm:h-40">
                        {[0, 1, 2, 3].map((line) => (
                          <div
                            key={line}
                            className="pointer-events-none absolute left-0 right-0 border-t border-dashed border-slate-200/90"
                            style={{ top: `${line * 33.333}%` }}
                          />
                        ))}

                        <div className="absolute inset-0 flex items-end gap-[3px] sm:gap-1">
                          {dailyLeads.map((item) => {
                            const maxCount = Math.max(
                              ...dailyLeads.map((entry) => entry.count),
                              1
                            );
                            const barHeight =
                              item.count > 0
                                ? Math.max(8, (item.count / maxCount) * 100)
                                : 3;

                            return (
                              <div
                                key={item.date}
                                className="group/bar relative flex h-full min-w-0 flex-1 items-end justify-center"
                              >
                                <div className="pointer-events-none absolute bottom-full z-20 mb-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-2 text-[10px] font-semibold text-white shadow-xl group-hover/bar:block">
                                  <span className="block">
                                    {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  </span>
                                  <span className="mt-0.5 block text-emerald-300">
                                    {item.count} {item.count === 1 ? "lead" : "leads"}
                                  </span>
                                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                                </div>
                                <div
                                  title={`${item.date}: ${item.count} ${item.count === 1 ? "lead" : "leads"}`}
                                  className={`w-full max-w-[18px] rounded-t-md transition-all duration-300 ease-out hover:brightness-110 sm:max-w-[22px] ${
                                    item.count > 0
                                      ? "bg-gradient-to-t from-emerald-600 via-emerald-500 to-teal-300 shadow-[0_2px_8px_rgba(16,185,129,0.18)]"
                                      : "bg-slate-300/70"
                                  }`}
                                  style={{ height: `${barHeight}%` }}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between border-t border-slate-200/80 pt-2 text-[9px] font-medium text-slate-400">
                        {dailyLeads
                          .filter((_, index) => index % 5 === 0 || index === dailyLeads.length - 1)
                          .map((item) => (
                            <span key={item.date}>
                              {new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </span>
                          ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 text-[9px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm bg-gradient-to-r from-emerald-600 to-teal-300" />
                          Daily leads
                        </span>
                        <span>
                          Peak: {Math.max(...dailyLeads.map((item) => item.count), 0)} leads/day
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-36 flex-col items-center justify-center text-center">
                      <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                        <TrendingUp size={18} />
                      </span>
                      <p className="text-xs font-bold text-slate-600">No lead activity yet</p>
                      <p className="mt-1 text-[10px] text-slate-400">Lead activity will appear here when data is available.</p>
                    </div>
                  )}
                </div>
              </section>
              {/* TOP CONTENT */}
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="flex items-center gap-2 text-[14px] font-black">
                  Top Performing Content
                </h2>

                <div className="mt-3 space-y-3">
                  {templates.map((item, index) => (
                    <div
                      key={item.title}
                      className="flex items-center gap-3"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-[9px] font-black text-blue-600">
                        {index + 1}
                      </span>

                      <img
                        src={item.image}
                        className="h-10 w-14 rounded-md object-cover"
                        alt=""
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[9px] font-bold">
                          {item.title}
                        </p>
                        <p className="text-[8px] text-slate-500">
                          Campaign-specific performance data is not connected
                        </p>
                      </div>

                      
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="space-y-3">
            {/* SHARING */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="flex items-center gap-2 text-[15px] font-black">
                <Share2 className="text-purple-600" size={19} />
                Multi-Channel Sharing
              </h2>
              <p className="mt-1 text-[9px] text-slate-500">
                Share your marketing content instantly
              </p>

              <div className="mt-4 space-y-2">
                {[
                  ["Share on WhatsApp", "bg-[#16c46a]", MessageCircle],
                  ["Share on Instagram", "bg-gradient-to-r from-pink-500 to-orange-400", Camera],
                  ["Share on Facebook", "bg-[#1877f2]", Globe2],
                  ["Share on Telegram", "bg-[#18a9e8]", Send],
                  ["Send via Email", "bg-purple-600", Mail],
                ].map(([text, color, Icon]: any) => (
                  <button
                    key={text}
                    onClick={() => shareContent(String(text))}
                    className={`flex w-full items-center gap-2 rounded-lg ${color} px-3 py-3 text-left text-[9px] font-bold text-white`}
                  >
                    <Icon size={16} />
                    {text}
                    <ArrowRight size={13} className="ml-auto" />
                  </button>
                ))}
              </div>
            </section>

            {/* AI ASSISTANT */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Bot size={21} />
                </div>
                <div>
                  <h2 className="text-[13px] font-black">
                    Your AI Marketing Assistant
                  </h2>
                  <p className="text-[9px] text-slate-500">
                    Hi! I can help you with:
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-[9px] text-slate-600">
                {[
                  "Create marketing content",
                  "Suggest campaign ideas",
                  "Generate social media posts",
                  "Write WhatsApp messages",
                  "Create ad creatives",
                  "Analyze performance",
                ].map((item) => (
                  <p key={item}>
                    <Sparkles
                      size={11}
                      className="mr-2 inline text-purple-500"
                    />
                    {item}
                  </p>
                ))}
              </div>

              <div className="mt-4 flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <input
                  value={assistantQuestion}
                  onChange={(event) => setAssistantQuestion(event.target.value)}
                  onKeyDown={(event) => { if (event.key === "Enter") askMarketingAssistant(); }}
                  placeholder="Ask me anything about marketing..."
                  className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[8px] outline-none"
                />
                <button onClick={askMarketingAssistant} className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white">
                  <ArrowRight size={13} />
                </button>
              </div>

              {assistantReply && (
                <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-[10px] leading-5 text-slate-700">
                  <p className="mb-1 font-bold text-blue-700">Marketing Helper</p>
                  <div className="max-h-96 overflow-y-auto whitespace-normal break-words">{formatMarketingAnswer(assistantReply)}</div>
                </div>
              )}
            </section>

            {/* RECENT ACTIVITY */}
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[14px] font-black">
                  <Clock3 className="text-blue-600" size={17} />
                  Recent Marketing Activity
                </h2>
                <button onClick={() => setShowAllActivity((value) => !value)} className="text-[9px] font-bold text-blue-600">
                  {showAllActivity ? "Show Less" : "View All"} -&gt;
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {marketingActivity.slice(0, showAllActivity ? marketingActivity.length : 4).map((text, i) => (
                  <div key={text} className="flex gap-3">
                    <div className="relative">
                      <span
                        className={`mt-1 block h-2.5 w-2.5 rounded-full ${
                          i === 0
                            ? "bg-emerald-500"
                            : i === 1
                            ? "bg-blue-500"
                            : i === 2
                            ? "bg-purple-500"
                            : "bg-orange-400"
                        }`}
                      />
                      {i < 4 && (
                        <span className="absolute left-[4px] top-4 h-8 w-px bg-slate-200" />
                      )}
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold leading-4">
                        {text}
                      </p>
                      <p className="text-[8px] text-slate-400">Marketing Tools</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      {/* DISCLAIMER */}
      <div className="mx-auto max-w-[1500px] px-4 pb-6 text-center lg:px-7">
        <p className="text-[9px] text-slate-400">
          Marketing content generated by AI is for promotional assistance only.
          Verify lender terms, rates and eligibility before publishing.
        </p>
      </div>
    </div>
  );
}













