"use client";

import React, { useState } from "react";
import {
  UserRound,
  CalendarDays,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Building2,
  Landmark,
  WalletCards,
  FileText,
  UploadCloud,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Save,
  Send,
  Sparkles,
  Crown,
  CircleHelp,
  FileCheck2,
  BadgeCheck,
  Zap,
  Trophy,
  Search,
  X,
} from "lucide-react";

type Step = {
  number: number;
  title: string;
  subtitle: string;
};

const steps: Step[] = [
  {
    number: 1,
    title: "Personal Details",
    subtitle: "Enter customer information",
  },
  {
    number: 2,
    title: "Bank Details",
    subtitle: "Add bank account information",
  },
  {
    number: 3,
    title: "Document Upload",
    subtitle: "Upload required documents",
  },
  {
    number: 4,
    title: "Review & Submit",
    subtitle: "Verify and complete KYC",
  },
];

export default function KYCVerificationPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [bank, setBank] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    email: "",
    pan: "",
    city: "",
    pincode: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
  });

  const [files, setFiles] = useState({
    pan: null as File | null,
    aadhaar: null as File | null,
    bank: null as File | null,
    agreement: null as File | null,
  });

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFile = (
    field: "pan" | "aadhaar" | "bank" | "agreement",
    file?: File
  ) => {
    if (!file) return;

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const removeFile = (
    field: "pan" | "aadhaar" | "bank" | "agreement"
  ) => {
    setFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };

  const previousStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="kyc-premium-page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f8ff;
        }

        .kyc-premium-page {
          width: 100%;
          min-height: 100vh;
          padding: 22px;
          background:
            radial-gradient(
              circle at 15% 5%,
              rgba(37, 99, 235, 0.08),
              transparent 28%
            ),
            radial-gradient(
              circle at 85% 20%,
              rgba(6, 182, 212, 0.08),
              transparent 25%
            ),
            linear-gradient(180deg, #f8fbff 0%, #eef5fc 100%);
          color: #101b3d;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .kyc-container {
          width: 100%;
          max-width: 1650px;
          margin: 0 auto;
        }

        /* ================= HERO ================= */

        .kyc-hero {
          position: relative;
          overflow: hidden;
          min-height: 235px;
          border-radius: 24px;
          padding: 30px 36px;
          background:
            radial-gradient(
              circle at 82% 40%,
              rgba(255, 255, 255, 0.2),
              transparent 24%
            ),
            linear-gradient(115deg, #082d85 0%, #1459bc 48%, #0797a8 100%);
          box-shadow:
            0 24px 60px rgba(16, 62, 140, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.22);
          color: white;
        }

        .hero-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          right: -100px;
          top: -120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          filter: blur(2px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 720px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .hero-title {
          margin: 18px 0 6px;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 0.98;
          font-weight: 900;
          letter-spacing: -2px;
        }

        .hero-title span {
          color: #5ee7ff;
        }

        .hero-subtitle {
          margin: 0;
          max-width: 690px;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.88);
        }

        .hero-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 12px;
          font-weight: 700;
        }

        .hero-visual {
          position: absolute;
          right: 35px;
          top: 22px;
          width: 420px;
          height: 190px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .document-card {
          position: absolute;
          width: 215px;
          height: 130px;
          border-radius: 18px;
          background: linear-gradient(145deg, #fff, #e9f4ff);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.22);
          color: #173b8d;
          padding: 18px;
        }

        .document-card.main {
          transform: rotate(-5deg);
          z-index: 3;
        }

        .document-card.back {
          transform: translate(125px, -10px) rotate(8deg);
          opacity: 0.9;
          z-index: 1;
        }

        .document-card.bank {
          transform: translate(-115px, 20px) rotate(-12deg);
          z-index: 2;
        }

        .document-title {
          font-size: 18px;
          font-weight: 900;
        }

        .document-line {
          height: 7px;
          border-radius: 10px;
          margin-top: 12px;
          background: #d5e4fb;
        }

        .document-line.short {
          width: 55%;
        }

        .shield {
          position: absolute;
          right: 20px;
          bottom: 5px;
          z-index: 5;
          width: 68px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 22px;
          background: linear-gradient(145deg, #4ade80, #0ea66a);
          color: white;
          box-shadow: 0 15px 35px rgba(0, 80, 40, 0.3);
        }

        /* ================= MAIN GRID ================= */

        .kyc-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 330px;
          gap: 18px;
          margin-top: 18px;
        }

        .main-column {
          min-width: 0;
        }

        .side-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* ================= STEPPER ================= */

        .stepper {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #dce8f7;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(28, 61, 110, 0.06);
        }

        .step {
          position: relative;
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 55px;
          padding: 8px 12px;
          border-radius: 13px;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .step:hover {
          background: #f4f8ff;
        }

        .step.active {
          background: linear-gradient(
            90deg,
            rgba(30, 99, 235, 0.1),
            rgba(14, 165, 233, 0.04)
          );
        }

        .step-number {
          flex: 0 0 auto;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #9aa8bc;
          color: white;
          font-size: 17px;
          font-weight: 900;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #145bea, #0aa9d9);
          box-shadow: 0 8px 18px rgba(20, 91, 234, 0.25);
        }

        .step.done .step-number {
          background: #10b981;
        }

        .step-info strong {
          display: block;
          font-size: 14px;
          color: #1b2b51;
        }

        .step.active .step-info strong {
          color: #155bea;
        }

        .step-info small {
          display: block;
          margin-top: 3px;
          color: #8290a7;
          font-size: 11px;
        }

        .step-arrow {
          position: absolute;
          right: -2px;
          color: #98a7bd;
        }

        /* ================= CARD ================= */

        .section-card {
          margin-top: 16px;
          overflow: hidden;
          border: 1px solid #dce8f7;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 10px 30px rgba(25, 61, 110, 0.055);
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 22px 13px;
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-icon {
          width: 43px;
          height: 43px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: linear-gradient(145deg, #08e2cb, #10b7ee);
          color: #06385b;
          box-shadow: 0 8px 18px rgba(0, 194, 224, 0.18);
        }

        .section-heading h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 850;
        }

        .section-heading p {
          margin: 3px 0 0;
          color: #7c8da8;
          font-size: 12px;
        }

        .secure-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid #c9f0dc;
          background: #effdf5;
          color: #159447;
          font-size: 11px;
          font-weight: 800;
        }

        .section-body {
          padding: 0 22px 20px;
        }

        /* ================= FORM ================= */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 15px;
        }

        .field {
          min-width: 0;
        }

        .field.span-2 {
          grid-column: span 2;
        }

        .field label {
          display: flex;
          align-items: center;
          gap: 3px;
          margin-bottom: 7px;
          color: #17264a;
          font-size: 12px;
          font-weight: 800;
        }

        .required {
          color: #ef4444;
        }

        .input-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #657a9e;
          pointer-events: none;
        }

        .field input,
        .field select {
          width: 100%;
          height: 43px;
          padding: 0 13px 0 39px;
          border: 1px solid #d9e3f0;
          border-radius: 10px;
          outline: none;
          background: #f9fbfe;
          color: #18274a;
          font-size: 12px;
          transition: 0.18s ease;
        }

        .field input:focus,
        .field select:focus {
          border-color: #2670ed;
          background: white;
          box-shadow: 0 0 0 3px rgba(38, 112, 237, 0.08);
        }

        .field input::placeholder {
          color: #9aa9bd;
        }

        .auto-fill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 11px;
          border: 1px solid #dfd5ff;
          border-radius: 10px;
          background: #faf7ff;
          color: #7346e8;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        /* ================= DOCUMENT UPLOAD ================= */

        .upload-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .upload-card {
          padding: 12px;
          border: 1px solid #dce5f2;
          border-radius: 13px;
          background: #fcfdff;
        }

        .upload-card.pan {
          border-color: #b9d8ff;
        }

        .upload-card.aadhaar {
          border-color: #ffc9c9;
        }

        .upload-card.bank {
          border-color: #b9eedc;
        }

        .upload-card.agreement {
          border-color: #dcc7ff;
        }

        .upload-top {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 10px;
        }

        .upload-doc-icon {
          width: 33px;
          height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #edf5ff;
          color: #1764df;
        }

        .upload-top strong {
          display: block;
          font-size: 12px;
        }

        .upload-top small {
          display: block;
          margin-top: 2px;
          color: #8190a6;
          font-size: 10px;
        }

        .upload-zone {
          min-height: 88px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border: 1.5px dashed #a9c5ee;
          border-radius: 10px;
          background: #f8fbff;
          text-align: center;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .upload-zone:hover {
          background: #eef6ff;
          border-color: #2670ed;
        }

        .upload-zone strong {
          margin-top: 5px;
          color: #175bd0;
          font-size: 11px;
        }

        .upload-zone span {
          margin-top: 3px;
          color: #8090aa;
          font-size: 10px;
        }

        .file-name {
          max-width: 100%;
          margin-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #168052;
          font-size: 10px;
          font-weight: 800;
        }

        .file-remove {
          border: 0;
          background: transparent;
          color: #ef4444;
          cursor: pointer;
          font-size: 10px;
          font-weight: 800;
        }

        /* ================= SIDE CARDS ================= */

        .side-card {
          overflow: hidden;
          border: 1px solid #dce8f7;
          border-radius: 18px;
          background: white;
          box-shadow: 0 10px 30px rgba(25, 61, 110, 0.06);
        }

        .side-card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 16px 9px;
        }

        .side-card-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
        }

        .side-card-body {
          padding: 6px 16px 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
          color: #263858;
          font-size: 12px;
          font-weight: 650;
        }

        .benefit-check {
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: #22d37d;
          color: white;
        }

        .progress-card {
          padding: 17px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(79, 154, 255, 0.18),
              transparent 25%
            ),
            linear-gradient(145deg, #eef5ff, #e8f1ff);
        }

        .progress-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .progress-ring {
          width: 88px;
          height: 88px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at center,
              white 0 57%,
              transparent 58%
            ),
            conic-gradient(#1965ec 0deg, #dce7f8 0deg);
          font-size: 18px;
          font-weight: 900;
          color: #16284d;
        }

        .progress-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .progress-row {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #687b99;
          font-size: 11px;
        }

        .progress-dot {
          width: 8px;
          height: 8px;
          border: 2px solid #8ea0bb;
          border-radius: 50%;
        }

        .format-icons {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          margin-top: 10px;
        }

        .format-box {
          flex: 1;
          padding: 9px 5px;
          text-align: center;
          border-radius: 10px;
          background: #f6f8fc;
          font-size: 10px;
          font-weight: 800;
        }

        .support-card {
          position: relative;
          min-height: 135px;
          background: linear-gradient(145deg, #f7f2ff, #edf6ff);
        }

        .support-card h3 {
          margin: 0 0 4px;
          font-size: 15px;
        }

        .support-card p {
          margin: 0;
          max-width: 190px;
          color: #71829d;
          font-size: 11px;
          line-height: 1.5;
        }

        .support-button {
          margin-top: 12px;
          padding: 9px 13px;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(135deg, #1466ef, #08b5dc);
          color: white;
          font-size: 11px;
          font-weight: 850;
          cursor: pointer;
        }

        /* ================= BOTTOM ================= */

        .bottom-note {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          background: #eef7ff;
          color: #617895;
          font-size: 10px;
        }

        .action-bar {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 14px;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 43px;
          padding: 0 18px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 850;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .action-button.secondary {
          border: 1px solid #d8e3f1;
          background: white;
          color: #1d2d4d;
        }

        .action-button.primary {
          border: 0;
          background: linear-gradient(135deg, #115be7, #7b3ff2);
          color: white;
          box-shadow: 0 10px 25px rgba(55, 76, 218, 0.25);
        }

        .action-button:hover {
          transform: translateY(-1px);
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1250px) {
          .hero-visual {
            opacity: 0.45;
            right: -50px;
          }

          .kyc-layout {
            grid-template-columns: 1fr;
          }

          .side-column {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1000px) {
          .form-grid,
          .upload-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .stepper {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-visual {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .kyc-premium-page {
            padding: 10px;
          }

          .kyc-hero {
            padding: 22px;
            min-height: auto;
          }

          .hero-title {
            font-size: 34px;
          }

          .form-grid,
          .upload-grid,
          .side-column,
          .stepper {
            grid-template-columns: 1fr;
          }

          .field.span-2 {
            grid-column: span 1;
          }

          .section-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .action-bar {
            flex-direction: column;
          }

          .action-button {
            width: 100%;
          }
        }
      `}</style>

      <div className="kyc-container">

        {/* ================= HERO ================= */}

        <section className="kyc-hero">
          <div className="hero-glow" />

          <div className="hero-content">
            <div className="hero-badge">
              <ShieldCheck size={14} />
              KYC VERIFICATION
            </div>

            <h1 className="hero-title">
              Complete <span>KYC</span>
              <br />
              Unlock All Loan Products
            </h1>

            <p className="hero-subtitle">
              Verify customer details securely and get faster loan approvals
              across 50+ banks & NBFC partners.
            </p>

            <div className="hero-chips">
              <div className="hero-chip">
                <CheckCircle2 size={14} />
                100% Secure
              </div>

              <div className="hero-chip">
                <Zap size={14} />
                Quick Verification
              </div>

              <div className="hero-chip">
                <CreditCard size={14} />
                PAN Based KYC
              </div>

              <div className="hero-chip">
                <BadgeCheck size={14} />
                All Financial Products
              </div>

              <div className="hero-chip">
                <Trophy size={14} />
                Trusted by 10,000+ DSAs
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="document-card back">
              <div className="document-title">BANK</div>
              <div className="document-line" />
              <div className="document-line short" />
            </div>

            <div className="document-card bank">
              <div className="document-title">PASSBOOK</div>
              <div className="document-line" />
              <div className="document-line short" />
            </div>

            <div className="document-card main">
              <div className="document-title">PAN CARD</div>
              <div className="document-line" />
              <div className="document-line" />
              <div className="document-line short" />
            </div>

            <div className="shield">
              <ShieldCheck size={36} />
            </div>
          </div>
        </section>

        {/* ================= MAIN ================= */}

        <div className="kyc-layout">

          <main className="main-column">

            {/* STEP INDICATOR */}

            <div className="stepper">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div
                    className={`step ${
                      activeStep === step.number ? "active" : ""
                    } ${activeStep > step.number ? "done" : ""}`}
                    onClick={() => setActiveStep(step.number)}
                  >
                    <div className="step-number">
                      {activeStep > step.number ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        step.number
                      )}
                    </div>

                    <div className="step-info">
                      <strong>{step.title}</strong>
                      <small>{step.subtitle}</small>
                    </div>

                    {index < steps.length - 1 && (
                      <ChevronRight className="step-arrow" size={18} />
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* ================= CUSTOMER ================= */}

            <section className="section-card">
              <div className="section-header">
                <div className="section-heading">
                  <div className="section-icon">
                    <UserRound size={24} />
                  </div>

                  <div>
                    <h2>Customer Information</h2>
                    <p>
                      Enter customer basic details for KYC verification.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="auto-fill"
                  onClick={() => {
                    // UI only
                  }}
                >
                  <Sparkles size={14} />
                  Auto Fill from PAN
                </button>
              </div>

              <div className="section-body">
                <div className="form-grid">

                  <div className="field">
                    <label>
                      Full Name <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <UserRound className="input-icon" size={16} />

                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          updateForm("fullName", e.target.value)
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Date of Birth <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <CalendarDays className="input-icon" size={16} />

                      <input
                        type="date"
                        value={form.dob}
                        onChange={(e) =>
                          updateForm("dob", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Gender <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <UserRound className="input-icon" size={16} />

                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Mobile Number <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <Phone className="input-icon" size={16} />

                      <input
                        value={form.mobile}
                        onChange={(e) =>
                          updateForm("mobile", e.target.value)
                        }
                        placeholder="Enter mobile number"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Email ID</label>

                    <div className="input-wrap">
                      <Mail className="input-icon" size={16} />

                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          updateForm("email", e.target.value)
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      PAN Number <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <CreditCard className="input-icon" size={16} />

                      <input
                        value={form.pan}
                        onChange={(e) =>
                          updateForm(
                            "pan",
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="Enter PAN number (e.g. ABCDE1234F)"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>City</label>

                    <div className="input-wrap">
                      <MapPin className="input-icon" size={16} />

                      <input
                        value={form.city}
                        onChange={(e) =>
                          updateForm("city", e.target.value)
                        }
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>State</label>

                    <div className="input-wrap">
                      <MapPin className="input-icon" size={16} />

                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      >
                        <option value="">Select state</option>
                        <option>Bihar</option>
                        <option>Uttar Pradesh</option>
                        <option>Delhi</option>
                        <option>Maharashtra</option>
                        <option>West Bengal</option>
                        <option>Jharkhand</option>
                        <option>Rajasthan</option>
                        <option>Madhya Pradesh</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Pincode</label>

                    <div className="input-wrap">
                      <MapPin className="input-icon" size={16} />

                      <input
                        value={form.pincode}
                        onChange={(e) =>
                          updateForm("pincode", e.target.value)
                        }
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ================= BANK ================= */}

            <section className="section-card">
              <div className="section-header">
                <div className="section-heading">
                  <div className="section-icon">
                    <Landmark size={24} />
                  </div>

                  <div>
                    <h2>Bank Account Details</h2>
                    <p>
                      Enter customer's bank information for loan
                      disbursal.
                    </p>
                  </div>
                </div>

                <div className="secure-label">
                  <LockKeyhole size={14} />
                  Your bank details are 100% secure
                </div>
              </div>

              <div className="section-body">
                <div className="form-grid">

                  <div className="field">
                    <label>
                      Bank Name <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <Building2 className="input-icon" size={16} />

                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                      >
                        <option value="">Select bank</option>
                        <option>State Bank of India</option>
                        <option>HDFC Bank</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Punjab National Bank</option>
                        <option>Bank of Baroda</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Account Number <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <WalletCards className="input-icon" size={16} />

                      <input
                        value={form.accountNumber}
                        onChange={(e) =>
                          updateForm(
                            "accountNumber",
                            e.target.value
                          )
                        }
                        placeholder="Enter account number"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      IFSC Code <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <CreditCard className="input-icon" size={16} />

                      <input
                        value={form.ifsc}
                        onChange={(e) =>
                          updateForm(
                            "ifsc",
                            e.target.value.toUpperCase()
                          )
                        }
                        placeholder="Enter IFSC code"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>
                      Account Holder Name{" "}
                      <span className="required">*</span>
                    </label>

                    <div className="input-wrap">
                      <UserRound className="input-icon" size={16} />

                      <input
                        value={form.accountHolder}
                        onChange={(e) =>
                          updateForm(
                            "accountHolder",
                            e.target.value
                          )
                        }
                        placeholder="Enter account holder name"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* ================= DOCUMENTS ================= */}

            <section className="section-card">
              <div className="section-header">
                <div className="section-heading">
                  <div
                    className="section-icon"
                    style={{
                      background:
                        "linear-gradient(145deg,#a855f7,#6366f1)",
                      color: "white",
                    }}
                  >
                    <FileText size={24} />
                  </div>

                  <div>
                    <h2>Upload Documents</h2>
                    <p>
                      Upload clear and valid documents. Supported
                      formats: PDF, JPG, PNG (Max 5MB each).
                    </p>
                  </div>
                </div>

                <div className="secure-label">
                  <ShieldCheck size={14} />
                  All documents are encrypted and securely stored
                </div>
              </div>

              <div className="section-body">

                <div className="upload-grid">

                  <UploadBox
                    title="PAN Card"
                    subtitle="Front Side"
                    type="pan"
                    file={files.pan}
                    onUpload={(file) => handleFile("pan", file)}
                    onRemove={() => removeFile("pan")}
                    iconColor="#1764df"
                  />

                  <UploadBox
                    title="Aadhaar Card"
                    subtitle="Front / Back Side"
                    type="aadhaar"
                    file={files.aadhaar}
                    onUpload={(file) => handleFile("aadhaar", file)}
                    onRemove={() => removeFile("aadhaar")}
                    iconColor="#ef4444"
                  />

                  <UploadBox
                    title="Bank Passbook"
                    subtitle="First Page / Cancelled Cheque"
                    type="bank"
                    file={files.bank}
                    onUpload={(file) => handleFile("bank", file)}
                    onRemove={() => removeFile("bank")}
                    iconColor="#16a66d"
                  />

                  <UploadBox
                    title="Agreement"
                    subtitle="Signed Document"
                    type="agreement"
                    file={files.agreement}
                    onUpload={(file) =>
                      handleFile("agreement", file)
                    }
                    onRemove={() => removeFile("agreement")}
                    iconColor="#7c3aed"
                  />

                </div>

                <div className="bottom-note">
                  <CircleHelp size={18} color="#1764df" />
                  <span>
                    <strong>Important Note:</strong> Please ensure
                    all information and uploaded documents are clear
                    before submission. Incorrect information may
                    delay the loan approval process.
                  </span>
                </div>

              </div>
            </section>

            {/* ================= ACTIONS ================= */}

            <div className="action-bar">

              <button
                type="button"
                className="action-button secondary"
                onClick={previousStep}
              >
                <Save size={16} />
                Save as Draft
              </button>

              <button
                type="button"
                className="action-button primary"
                onClick={nextStep}
              >
                <Send size={16} />
                Review & Submit KYC
                <ArrowRight size={16} />
              </button>

            </div>

          </main>

          {/* ================= RIGHT SIDEBAR ================= */}

          <aside className="side-column">

            <div className="side-card">
              <div className="side-card-header">
                <div
                  className="section-icon"
                  style={{
                    width: 38,
                    height: 38,
                    background:
                      "linear-gradient(145deg,#ffd84d,#ffad0a)",
                    color: "#412b00",
                  }}
                >
                  <Crown size={19} />
                </div>

                <h3>KYC Benefits</h3>
              </div>

              <div className="side-card-body">

                {[
                  "Higher Loan Approval Chances",
                  "Faster Disbursal",
                  "Access to Multiple Lenders",
                  "All Financial Products",
                  "Lower Interest Rates",
                  "Dedicated DSA Support",
                ].map((item) => (
                  <div className="benefit-item" key={item}>
                    <div className="benefit-check">
                      <CheckCircle2 size={14} />
                    </div>
                    {item}
                  </div>
                ))}

              </div>
            </div>

            <div className="side-card progress-card">

              <div className="side-card-header">
                <div
                  className="section-icon"
                  style={{
                    width: 38,
                    height: 38,
                    background:
                      "linear-gradient(145deg,#1677ff,#4338ca)",
                    color: "white",
                  }}
                >
                  <FileCheck2 size={19} />
                </div>

                <h3>KYC Progress</h3>
              </div>

              <div className="progress-content">

                <div className="progress-ring">
                  0%
                </div>

                <div className="progress-list">
                  <div className="progress-row">
                    <span className="progress-dot" />
                    Personal Details
                  </div>

                  <div className="progress-row">
                    <span className="progress-dot" />
                    Bank Details
                  </div>

                  <div className="progress-row">
                    <span className="progress-dot" />
                    Document Upload
                  </div>

                  <div className="progress-row">
                    <span className="progress-dot" />
                    Review & Submit
                  </div>
                </div>

              </div>
            </div>

            <div className="side-card">
              <div className="side-card-header">
                <div
                  className="section-icon"
                  style={{
                    width: 38,
                    height: 38,
                    background:
                      "linear-gradient(145deg,#1479ff,#9333ea)",
                    color: "white",
                  }}
                >
                  <FileText size={19} />
                </div>

                <h3>Supported File Formats</h3>
              </div>

              <div className="side-card-body">
                <div
                  style={{
                    color: "#687b99",
                    fontSize: 11,
                    lineHeight: 1.5,
                  }}
                >
                  PDF, JPG, PNG
                  <br />
                  Maximum 5MB each
                </div>

                <div className="format-icons">
                  <div className="format-box">
                    <div
                      style={{
                        fontSize: 20,
                        color: "#ef4444",
                        fontWeight: 900,
                      }}
                    >
                      PDF
                    </div>
                  </div>

                  <div className="format-box">
                    <div
                      style={{
                        fontSize: 20,
                        color: "#2563eb",
                        fontWeight: 900,
                      }}
                    >
                      JPG
                    </div>
                  </div>

                  <div className="format-box">
                    <div
                      style={{
                        fontSize: 20,
                        color: "#7c3aed",
                        fontWeight: 900,
                      }}
                    >
                      PNG
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="side-card support-card">
              <div className="side-card-body">
                <h3>Need Help?</h3>

                <p>
                  Contact our support team for any assistance with
                  customer KYC verification.
                </p>

                <button className="support-button">
                  Contact Support <ArrowRight size={13} />
                </button>
              </div>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   UPLOAD BOX
========================================================= */

function UploadBox({
  title,
  subtitle,
  type,
  file,
  onUpload,
  onRemove,
  iconColor,
}: {
  title: string;
  subtitle: string;
  type: "pan" | "aadhaar" | "bank" | "agreement";
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  iconColor: string;
}) {
  const inputId = `kyc-upload-${type}`;

  return (
    <div className={`upload-card ${type}`}>
      <div className="upload-top">
        <div
          className="upload-doc-icon"
          style={{
            color: iconColor,
          }}
        >
          <FileText size={17} />
        </div>

        <div>
          <strong>
            {title} <span className="required">*</span>
          </strong>
          <small>{subtitle}</small>
        </div>
      </div>

      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: "none" }}
        onChange={(e) => {
          const selected = e.target.files?.[0];

          if (selected) {
            onUpload(selected);
          }

          e.currentTarget.value = "";
        }}
      />

      <label htmlFor={inputId} className="upload-zone">
        <UploadCloud
          size={24}
          color={iconColor}
        />

        {file ? (
          <>
            <strong>Document Uploaded</strong>

            <span className="file-name">
              {file.name}
            </span>
          </>
        ) : (
          <>
            <strong>
              Click to upload or drag & drop
            </strong>

            <span>
              PDF, JPG, PNG (Max 5MB)
            </span>
          </>
        )}
      </label>

      {file && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 5,
          }}
        >
          <span
            style={{
              color: "#16a66d",
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            ✓ Ready
          </span>

          <button
            type="button"
            className="file-remove"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}