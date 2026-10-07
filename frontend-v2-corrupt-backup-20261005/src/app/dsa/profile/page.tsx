"use client";

import {
  Bell,
  Sun,
  ChevronDown,
  Menu,
  Search,
  ShieldCheck,
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
  CheckCircle2,
  ArrowRight,
  Save,
  Send,
  LockKeyhole,
  Sparkles,
  Trophy,
  FileCheck2,
  CircleHelp,
  Rocket,
  BadgeCheck,
  Crown,
  Eye,
} from "lucide-react";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DsaProfilePage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "kyc";

  const [step, setStep] = useState(1);

  return (
    <div className="kyc-page">

      {/* ================= TOP HEADER ================= */}
      <header className="top-header">

        <div className="header-left">
          <button className="menu-button">
            <Menu size={25} />
          </button>

          <div className="global-search">
            <Search size={20} />
            <input
              placeholder="Search customers, applications, documents..."
            />
          </div>
        </div>

        <div className="header-right">

          <button className="header-icon notification">
            <Bell size={22} />
            <span>3</span>
          </button>

          <button className="header-icon">
            <Sun size={22} />
          </button>

          <div className="profile-mini">
            <div className="avatar">
              PK
            </div>

            <div>
              <strong>Prakash Kumar</strong>
              <small>DSA Partner</small>
            </div>

            <ChevronDown size={18} />
          </div>

        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="main-layout">

        <section className="main-content">

          {/* ================= HERO ================= */}
          <section className="hero-banner">

            <div className="hero-content">

              <div className="hero-badge">
                <ShieldCheck size={17} />
                KYC VERIFICATION
              </div>

              <h1>
                Complete <span>KYC</span>
                <br />
                Unlock All Loan Products
              </h1>

              <p>
                Verify customer details securely and get faster loan approvals
                across 50+ banks & NBFC partners.
              </p>

              <div className="hero-pills">

                <div>
                  <CheckCircle2 size={17} />
                  100% Secure
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  Quick Verification
                </div>

                <div>
                  <CreditCard size={16} />
                  PAN Based KYC
                </div>

                <div>
                  <CheckCircle2 size={17} />
                  All Financial Products
                </div>

                <div>
                  <BadgeCheck size={17} />
                  Trusted by 10,000+ DSAs
                </div>

              </div>
            </div>

            <div className="hero-visual">

              <div className="document-stack">

                <div className="doc-card doc-pan">
                  <div className="doc-logo">PAN</div>
                  <div className="doc-lines">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>

                <div className="doc-card doc-aadhaar">
                  <div className="aadhaar-symbol">◉</div>
                  <strong>AADHAAR</strong>
                  <small>IDENTITY CARD</small>
                </div>

                <div className="doc-card doc-bank">
                  <Building2 size={34} />
                  <strong>BANK</strong>
                  <strong>PASSBOOK</strong>
                </div>

                <div className="verified-shield">
                  <ShieldCheck size={70} />
                  <small>Verified</small>
                </div>

              </div>

              <div className="hero-spark spark-one">✦</div>
              <div className="hero-spark spark-two">✦</div>
              <div className="hero-spark spark-three">✦</div>

            </div>

          </section>


          {/* ================= STEPS ================= */}
          <section className="steps-card">

            <Step
              number="1"
              title="Personal Details"
              subtitle="Enter customer information"
              active={step === 1}
              onClick={() => setStep(1)}
            />

            <div className="step-arrow">
              <ArrowRight size={25} />
            </div>

            <Step
              number="2"
              title="Bank Details"
              subtitle="Add bank account information"
              active={step === 2}
              onClick={() => setStep(2)}
            />

            <div className="step-arrow">
              <ArrowRight size={25} />
            </div>

            <Step
              number="3"
              title="Document Upload"
              subtitle="Upload required documents"
              active={step === 3}
              onClick={() => setStep(3)}
            />

            <div className="step-arrow">
              <ArrowRight size={25} />
            </div>

            <Step
              number="4"
              title="Review & Submit"
              subtitle="Verify and complete KYC"
              active={step === 4}
              onClick={() => setStep(4)}
            />

          </section>


          {/* ================= CUSTOMER INFORMATION ================= */}
          <section className="white-card">

            <div className="section-heading">

              <div className="section-icon cyan">
                <UserRound size={27} />
              </div>

              <div>
                <h2>Customer Information</h2>
                <p>Enter customer basic details for KYC verification.</p>
              </div>

              <button className="autofill-button">
                <Sparkles size={17} />
                Auto Fill from PAN
              </button>

            </div>


            <div className="form-grid">

              <Field
                label="Full Name"
                required
                icon={<UserRound size={18} />}
                placeholder="Enter full name"
              />

              <Field
                label="Date of Birth"
                required
                icon={<CalendarDays size={18} />}
                placeholder="DD/MM/YYYY"
                type="date"
              />

              <SelectField
                label="Gender"
                required
                placeholder="Select gender"
              />

              <Field
                label="Mobile Number"
                required
                icon={<Phone size={18} />}
                placeholder="Enter mobile number"
              />

              <Field
                label="Email ID"
                icon={<Mail size={18} />}
                placeholder="Enter email address"
              />

              <Field
                label="PAN Number"
                required
                icon={<CreditCard size={18} />}
                placeholder="Enter PAN number (e.g. ABCDE1234F)"
              />

              <Field
                label="City"
                icon={<MapPin size={18} />}
                placeholder="Enter city"
              />

              <SelectField
                label="State"
                placeholder="Select state"
              />

              <Field
                label="Pincode"
                icon={<MapPin size={18} />}
                placeholder="Enter pincode"
              />

            </div>

          </section>


          {/* ================= BANK ================= */}
          <section className="white-card">

            <div className="section-heading">

              <div className="section-icon cyan">
                <Landmark size={27} />
              </div>

              <div>
                <h2>Bank Account Details</h2>
                <p>Enter customer's bank information for loan disbursal.</p>
              </div>

              <div className="secure-label">
                <LockKeyhole size={16} />
                Your bank details are 100% secure
              </div>

            </div>


            <div className="form-grid bank-grid">

              <SelectField
                label="Bank Name"
                required
                placeholder="Select bank"
              />

              <Field
                label="Account Number"
                required
                icon={<WalletCards size={18} />}
                placeholder="Enter account number"
              />

              <Field
                label="IFSC Code"
                required
                icon={<CreditCard size={18} />}
                placeholder="Enter IFSC code (e.g. SBIN001234)"
              />

              <Field
                label="Account Holder Name"
                required
                icon={<UserRound size={18} />}
                placeholder="Enter account holder name"
              />

            </div>

          </section>


          {/* ================= DOCUMENTS ================= */}
          <section className="white-card">

            <div className="section-heading">

              <div className="section-icon purple">
                <FileText size={27} />
              </div>

              <div>
                <h2>Upload Documents</h2>
                <p>
                  Upload clear and valid documents. Supported formats:
                  PDF, JPG, PNG (Max 5MB each).
                </p>
              </div>

              <div className="secure-label purple-secure">
                <ShieldCheck size={16} />
                All documents are encrypted and securely stored
              </div>

            </div>


            <div className="document-grid">

              <UploadCard
                title="PAN Card"
                subtitle="Front Side"
                icon={<CreditCard size={27} />}
                color="blue"
              />

              <UploadCard
                title="Aadhaar Card"
                subtitle="Front / Back Side"
                icon={<BadgeCheck size={27} />}
                color="red"
              />

              <UploadCard
                title="Bank Passbook"
                subtitle="First Page / Cancelled Cheque"
                icon={<Landmark size={27} />}
                color="green"
              />

              <UploadCard
                title="Agreement"
                subtitle="Signed Document"
                icon={<FileText size={27} />}
                color="purple"
              />

            </div>


            <div className="important-note">
              <div className="info-circle">i</div>
              <div>
                <strong>Important Note</strong>
                <p>
                  Please ensure all information and upload clear documents
                  before submission. Incorrect information may delay the
                  loan approval process.
                </p>
              </div>
            </div>

          </section>


          {/* ================= ACTIONS ================= */}
          <div className="bottom-actions">

            <button className="draft-button">
              <Save size={19} />
              Save as Draft
            </button>

            <button
              className="submit-button"
              onClick={() => setStep(4)}
            >
              <Send size={19} />
              Review & Submit KYC
              <ArrowRight size={20} />
            </button>

          </div>

        </section>


        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="right-sidebar">


          {/* APPROVAL */}
          <div className="approval-card">

            <div className="rocket">
              <Rocket size={75} />
            </div>

            <h3>Faster Approvals<br />with Verified KYC</h3>

            <ul>
              <li><CheckCircle2 /> Higher Loan Approval Chances</li>
              <li><CheckCircle2 /> Faster Disbursal</li>
              <li><CheckCircle2 /> Access to Multiple Lenders</li>
              <li><CheckCircle2 /> All Financial Products</li>
              <li><CheckCircle2 /> Dedicated DSA Support</li>
            </ul>

          </div>


          {/* BENEFITS */}
          <div className="side-card benefits">

            <div className="side-title">
              <Crown size={23} />
              <strong>KYC Benefits</strong>
            </div>

            <ul>
              <li><CheckCircle2 /> Higher Loan Approval Chances</li>
              <li><CheckCircle2 /> Faster Disbursal</li>
              <li><CheckCircle2 /> Access to Multiple Lenders</li>
              <li><CheckCircle2 /> All Financial Products</li>
              <li><CheckCircle2 /> Lower Interest Rates</li>
              <li><CheckCircle2 /> Dedicated DSA Support</li>
            </ul>

            <div className="trophy">
              🏆
            </div>

          </div>


          {/* PROGRESS */}
          <div className="side-card progress-card">

            <div className="side-title">
              <FileCheck2 size={23} />
              <strong>KYC Progress</strong>
            </div>

            <div className="progress-layout">

              <div className="progress-circle">
                <strong>0%</strong>
              </div>

              <div className="progress-list">
                <span>◯ Personal Details</span>
                <span>◯ Bank Details</span>
                <span>◯ Document Upload</span>
                <span>◯ Review & Submit</span>
              </div>

            </div>

          </div>


          {/* FILE FORMAT */}
          <div className="side-card file-card">

            <div className="side-title">
              <FileText size={23} />
              <strong>Supported File Formats</strong>
            </div>

            <p>PDF, JPG, PNG</p>
            <small>Maximum 5MB each</small>

            <div className="file-icons">
              <div className="pdf">PDF</div>
              <div className="jpg">JPG</div>
              <div className="png">PNG</div>
            </div>

          </div>


          {/* SUPPORT */}
          <div className="side-card support-card">

            <div className="side-title">
              <CircleHelp size={23} />
              <strong>Need Help?</strong>
            </div>

            <p>
              Contact our support team for any assistance.
            </p>

            <div className="support-avatar">
              👩🏻‍💼
            </div>

            <button>
              Contact Support
              <ArrowRight size={18} />
            </button>

          </div>

        </aside>

      </main>


      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f7faff;
          font-family:
            Inter,
            Poppins,
            Arial,
            sans-serif;
          color: #101c46;
        }

        button,
        input,
        select {
          font-family: inherit;
        }

        .kyc-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 10% 0%, #edf7ff 0%, transparent 30%),
            #f7faff;
        }

        /* HEADER */

        .top-header {
          height: 64px;
          background: rgba(255,255,255,.96);
          border-bottom: 1px solid #e5ebf5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .header-left,
        .header-right {
          display: flex;
          align-items: center;
        }

        .header-left {
          gap: 25px;
          flex: 1;
        }

        .menu-button {
          border: 0;
          background: transparent;
          color: #183c86;
          cursor: pointer;
        }

        .global-search {
          width: min(650px, 70vw);
          height: 40px;
          border-radius: 22px;
          background: #f0f5fc;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 15px;
          color: #45608e;
        }

        .global-search input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          font-size: 14px;
          color: #1a2c52;
        }

        .header-right {
          gap: 22px;
        }

        .header-icon {
          position: relative;
          border: 0;
          background: transparent;
          color: #101d48;
          cursor: pointer;
        }

        .notification span {
          position: absolute;
          right: -7px;
          top: -8px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #f20d2f;
          color: white;
          font-size: 10px;
          font-weight: 800;
        }

        .profile-mini {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .profile-mini strong,
        .profile-mini small {
          display: block;
        }

        .profile-mini strong {
          font-size: 14px;
        }

        .profile-mini small {
          color: #6c7895;
          font-size: 12px;
          margin-top: 2px;
        }

        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(135deg,#dcecff,#9bbdf5);
          color: #173b87;
          display: grid;
          place-items: center;
          font-weight: 800;
          border: 2px solid white;
          box-shadow: 0 3px 12px rgba(40,80,150,.18);
        }


        /* LAYOUT */

        .main-layout {
          width: calc(100% - 48px);
          max-width: 1680px;
          margin: 0 auto;
          padding: 12px 0 35px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 340px;
          gap: 18px;
        }

        .main-content {
          min-width: 0;
        }


        /* HERO */

        .hero-banner {
          min-height: 232px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          border: 1px solid #dce9fb;
          background:
            radial-gradient(circle at 90% 15%, rgba(255,255,255,.9), transparent 20%),
            linear-gradient(110deg,#eaf7ff 0%,#dcefff 40%,#f7fbff 100%);
          box-shadow: 0 5px 20px rgba(50,100,170,.08);
          display: flex;
        }

        .hero-banner:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg,transparent 30%,rgba(255,255,255,.75) 48%,transparent 65%);
          opacity: .8;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 53%;
          padding: 20px 30px;
        }

        .hero-badge {
          width: fit-content;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 5px 13px;
          border-radius: 20px;
          border: 1px solid #8ab8ff;
          background: #e8f4ff;
          color: #13234d;
          font-size: 13px;
          font-weight: 800;
        }

        .hero-badge svg {
          color: #ffb900;
          fill: #ffcf33;
        }

        .hero-content h1 {
          margin: 10px 0 5px;
          font-size: clamp(31px, 3vw, 50px);
          line-height: .98;
          letter-spacing: -1.8px;
          color: #101f55;
        }

        .hero-content h1 span {
          color: #1753ef;
        }

        .hero-content p {
          max-width: 650px;
          margin: 8px 0 15px;
          color: #40547b;
          font-size: 15px;
          line-height: 1.45;
        }

        .hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .hero-pills div {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          background: rgba(255,255,255,.8);
          border: 1px solid #d3e1f7;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: #233b70;
        }

        .hero-pills svg {
          color: #08ba70;
        }

        .hero-visual {
          flex: 1;
          position: relative;
          min-width: 0;
        }

        .document-stack {
          position: absolute;
          right: 5%;
          bottom: -8px;
          width: 420px;
          height: 205px;
        }

        .doc-card {
          position: absolute;
          border-radius: 13px;
          background: linear-gradient(145deg,#ffffff,#e9f2ff);
          border: 1px solid #d0ddf1;
          box-shadow: 0 15px 25px rgba(25,66,125,.18);
          padding: 15px;
        }

        .doc-pan {
          width: 185px;
          height: 125px;
          right: 145px;
          top: 55px;
          transform: rotate(-8deg);
          z-index: 4;
        }

        .doc-aadhaar {
          width: 170px;
          height: 120px;
          right: 35px;
          top: 52px;
          transform: rotate(4deg);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #cf241b;
        }

        .doc-aadhaar small {
          color: #687693;
          font-size: 9px;
          margin-top: 5px;
        }

        .aadhaar-symbol {
          font-size: 32px;
        }

        .doc-bank {
          width: 180px;
          height: 125px;
          right: 0;
          top: 0;
          transform: rotate(8deg);
          z-index: 2;
          color: #102b72;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .doc-logo {
          font-size: 30px;
          font-weight: 900;
          color: #0646a7;
        }

        .doc-lines {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .doc-lines i {
          height: 5px;
          border-radius: 10px;
          background: #b7c9e6;
        }

        .verified-shield {
          position: absolute;
          right: 35px;
          bottom: -5px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(145deg,#d9fff1,#72e7bd);
          display: grid;
          place-items: center;
          color: #00a967;
          box-shadow: 0 10px 20px rgba(0,170,110,.22);
          z-index: 6;
        }

        .verified-shield small {
          position: absolute;
          bottom: 9px;
          font-size: 11px;
          font-weight: 900;
        }

        .hero-spark {
          position: absolute;
          color: #ffcf38;
          font-size: 25px;
          animation: sparkle 2s infinite alternate;
        }

        .spark-one {
          top: 20px;
          right: 15%;
        }

        .spark-two {
          top: 80px;
          right: 48%;
        }

        .spark-three {
          bottom: 28px;
          right: 45%;
        }

        @keyframes sparkle {
          from { transform: scale(.7) rotate(0deg); opacity:.45; }
          to { transform: scale(1.2) rotate(15deg); opacity:1; }
        }


        /* STEPS */

        .steps-card {
          margin-top: 12px;
          padding: 10px 24px;
          border-radius: 15px;
          background: white;
          border: 1px solid #dae7fa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(40,90,150,.06);
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          cursor: pointer;
        }

        .step-number {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 50%;
          background: #aab6c8;
          color: white;
          display: grid;
          place-items: center;
          font-size: 19px;
          font-weight: 800;
        }

        .step-item.active .step-number {
          background: linear-gradient(135deg,#164ee8,#1c61ff);
          box-shadow: 0 6px 15px rgba(35,84,230,.28);
        }

        .step-item strong {
          display: block;
          color: #53617d;
          font-size: 15px;
        }

        .step-item.active strong {
          color: #1450ed;
        }

        .step-item span {
          display: block;
          color: #8290a9;
          font-size: 12px;
          margin-top: 2px;
        }

        .step-arrow {
          color: #91a2be;
          margin: 0 12px;
        }


        /* CARDS */

        .white-card {
          margin-top: 12px;
          background: white;
          border: 1px solid #e0e8f4;
          border-radius: 15px;
          padding: 14px 22px 16px;
          box-shadow: 0 4px 18px rgba(35,85,140,.05);
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 12px;
        }

        .section-icon {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: #052151;
        }

        .section-icon.cyan {
          background: linear-gradient(135deg,#0ce4cc,#06cbd4);
        }

        .section-icon.purple {
          background: linear-gradient(135deg,#c787ff,#6e3cff);
          color: white;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 18px;
          color: #111d45;
        }

        .section-heading p {
          margin: 2px 0 0;
          font-size: 12px;
          color: #6d7b96;
        }

        .autofill-button {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 12px;
          border: 1px solid #decfff;
          background: #faf7ff;
          border-radius: 9px;
          color: #662be8;
          font-weight: 700;
          cursor: pointer;
        }

        .secure-label {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 7px;
          background: #effff7;
          border: 1px solid #bcebd2;
          color: #15975b;
          border-radius: 9px;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 800;
        }

        .purple-secure {
          color: #405fc1;
          background: #f4f6ff;
          border-color: #dce2ff;
        }


        /* FORM */

        .form-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px 16px;
        }

        .field {
          min-width: 0;
        }

        .field label {
          display: block;
          font-size: 12px;
          font-weight: 800;
          color: #15234e;
          margin-bottom: 5px;
        }

        .required {
          color: #e91d3d;
        }

        .input-wrap {
          height: 37px;
          border-radius: 8px;
          border: 1px solid #d9e2ef;
          background: linear-gradient(180deg,#ffffff,#f8fbff);
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 10px;
        }

        .input-wrap svg {
          color: #14265e;
          flex: 0 0 auto;
        }

        .input-wrap input,
        .input-wrap select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #33415f;
          font-size: 12px;
          min-width: 0;
        }

        .input-wrap input::placeholder {
          color: #9aa8bd;
        }

        .input-wrap select {
          cursor: pointer;
        }


        /* DOCUMENTS */

        .document-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 13px;
        }

        .upload-card {
          border: 1px solid;
          border-radius: 10px;
          padding: 10px;
          min-height: 126px;
        }

        .upload-card.blue {
          border-color: #b9d5ff;
          background: #f8fbff;
        }

        .upload-card.red {
          border-color: #ffc5c5;
          background: #fffafa;
        }

        .upload-card.green {
          border-color: #b8ebd2;
          background: #f8fffb;
        }

        .upload-card.purple {
          border-color: #d5c5ff;
          background: #fbf9ff;
        }

        .upload-top {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 7px;
        }

        .upload-top strong {
          font-size: 13px;
        }

        .upload-top small {
          display: block;
          color: #73809a;
          font-size: 10px;
          margin-top: 2px;
        }

        .upload-zone {
          height: 64px;
          border: 1px dashed #a9c7f5;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          color: #1d5cf0;
          background: rgba(255,255,255,.75);
          cursor: pointer;
        }

        .upload-zone strong {
          font-size: 11px;
        }

        .upload-zone small {
          font-size: 9px;
        }


        .important-note {
          margin-top: 9px;
          border-radius: 8px;
          background: #edf6ff;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 7px 10px;
        }

        .info-circle {
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: #0867e9;
          color: white;
          display: grid;
          place-items: center;
          font-weight: 900;
        }

        .important-note strong {
          font-size: 11px;
        }

        .important-note p {
          margin: 1px 0 0;
          font-size: 9px;
          color: #66758e;
        }


        /* ACTIONS */

        .bottom-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 12px;
        }

        .draft-button,
        .submit-button {
          height: 43px;
          padding: 0 20px;
          border-radius: 9px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .draft-button {
          background: white;
          border: 1px solid #d9e2ee;
          color: #172143;
        }

        .submit-button {
          border: 0;
          color: white;
          background: linear-gradient(90deg,#0877ed,#792eff);
          box-shadow: 0 8px 18px rgba(67,62,240,.2);
        }


        /* RIGHT SIDE */

        .right-sidebar {
          min-width: 0;
        }

        .approval-card,
        .side-card {
          border-radius: 15px;
          overflow: hidden;
          border: 1px solid #dce5f5;
          margin-bottom: 12px;
        }

        .approval-card {
          min-height: 232px;
          position: relative;
          padding: 22px 20px;
          background:
            radial-gradient(circle at 85% 20%,#ffffff,transparent 25%),
            linear-gradient(135deg,#f4f1ff,#ffffff 70%);
        }

        .approval-card h3 {
          margin: 0;
          font-size: 20px;
          line-height: 1.15;
          color: #2d1e9c;
          max-width: 230px;
          position: relative;
          z-index: 3;
        }

        .approval-card ul,
        .side-card ul {
          padding: 0;
          margin: 13px 0 0;
          list-style: none;
          position: relative;
          z-index: 3;
        }

        .approval-card li,
        .side-card li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 700;
          margin: 8px 0;
        }

        .approval-card li svg,
        .side-card li svg {
          width: 18px;
          height: 18px;
          color: #00bc72;
          background: #bdf7da;
          border-radius: 5px;
          padding: 2px;
          flex: 0 0 auto;
        }

        .rocket {
          position: absolute;
          right: 10px;
          top: 16px;
          color: #345eff;
          transform: rotate(25deg);
          opacity: .95;
        }

        .side-card {
          padding: 14px 16px;
          background: white;
          position: relative;
        }

        .side-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #151f47;
        }

        .side-title svg {
          color: #1466e8;
        }

        .benefits {
          background: linear-gradient(145deg,#fffaf0,#ffffff);
        }

        .benefits .side-title svg {
          color: #f1ae00;
          fill: #f1ae00;
        }

        .trophy {
          position: absolute;
          right: 9px;
          bottom: 8px;
          font-size: 50px;
        }

        .progress-card {
          background: linear-gradient(145deg,#edf4ff,#ffffff);
        }

        .progress-layout {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-top: 15px;
        }

        .progress-circle {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          border: 10px solid #dce5f5;
          display: grid;
          place-items: center;
          position: relative;
          flex: 0 0 auto;
        }

        .progress-circle:before {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 10px solid transparent;
          border-top-color: #5272d8;
          transform: rotate(-35deg);
        }

        .progress-circle strong {
          font-size: 19px;
          color: #14214a;
        }

        .progress-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .progress-list span {
          font-size: 11px;
          color: #63708d;
        }

        .file-card {
          background: linear-gradient(145deg,#edf7ff,#ffffff);
        }

        .file-card p {
          margin: 10px 0 1px;
          color: #62718e;
          font-size: 11px;
        }

        .file-card small {
          color: #7d8ba5;
          font-size: 10px;
        }

        .file-icons {
          display: flex;
          gap: 25px;
          margin-top: 13px;
        }

        .file-icons div {
          width: 42px;
          height: 48px;
          border-radius: 7px;
          display: grid;
          place-items: center;
          color: white;
          font-size: 9px;
          font-weight: 900;
          position: relative;
        }

        .file-icons div:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          border-top: 13px solid white;
          border-right: 13px solid transparent;
        }

        .pdf {
          background: #ee2828;
        }

        .jpg {
          background: #248be7;
        }

        .png {
          background: #9b4de7;
        }

        .support-card {
          background: linear-gradient(145deg,#edf4ff,#ffffff);
          min-height: 170px;
        }

        .support-card p {
          max-width: 180px;
          font-size: 11px;
          line-height: 1.4;
          color: #65738e;
        }

        .support-avatar {
          position: absolute;
          right: 14px;
          top: 48px;
          font-size: 65px;
        }

        .support-card button {
          position: relative;
          z-index: 2;
          margin-top: 9px;
          border: 0;
          border-radius: 8px;
          height: 36px;
          padding: 0 17px;
          color: white;
          font-weight: 800;
          background: linear-gradient(90deg,#0574ed,#03b8e9);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }


        /* RESPONSIVE */

        @media (max-width: 1250px) {

          .main-layout {
            grid-template-columns: minmax(0,1fr) 290px;
          }

          .document-stack {
            transform: scale(.82);
            transform-origin: right bottom;
          }

          .form-grid {
            grid-template-columns: repeat(3,1fr);
          }

          .document-grid {
            grid-template-columns: repeat(2,1fr);
          }

        }

        @media (max-width: 950px) {

          .main-layout {
            grid-template-columns: 1fr;
          }

          .right-sidebar {
            display: grid;
            grid-template-columns: repeat(2,1fr);
            gap: 12px;
          }

          .right-sidebar > * {
            margin-bottom: 0;
          }

          .hero-content {
            width: 70%;
          }

          .hero-visual {
            opacity: .55;
          }

        }

        @media (max-width: 700px) {

          .top-header {
            padding: 0 12px;
          }

          .header-right > .header-icon {
            display: none;
          }

          .profile-mini div:nth-child(2) {
            display: none;
          }

          .main-layout {
            width: calc(100% - 20px);
          }

          .hero-banner {
            min-height: 330px;
          }

          .hero-content {
            width: 100%;
            padding: 20px;
          }

          .hero-content h1 {
            font-size: 34px;
          }

          .hero-visual {
            display: none;
          }

          .steps-card {
            overflow-x: auto;
            justify-content: flex-start;
            gap: 10px;
          }

          .step-item {
            min-width: 180px;
          }

          .step-arrow {
            display: none;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .document-grid {
            grid-template-columns: 1fr;
          }

          .right-sidebar {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .autofill-button,
          .secure-label {
            margin-left: 0;
            width: 100%;
            justify-content: center;
          }

          .bottom-actions {
            flex-direction: column;
          }

          .draft-button,
          .submit-button {
            width: 100%;
            justify-content: center;
          }

        }

      `}</style>
    </div>
  );
}


/* ================= COMPONENTS ================= */

function Step({
  number,
  title,
  subtitle,
  active,
  onClick,
}: {
  number: string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`step-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="step-number">
        {number}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}


function Field({
  label,
  required,
  icon,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="field">

      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      <div className="input-wrap">
        {icon}

        <input
          type={type}
          placeholder={placeholder}
        />
      </div>

    </div>
  );
}


function SelectField({
  label,
  required,
  placeholder,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
}) {
  return (
    <div className="field">

      <label>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      <div className="input-wrap">

        <select defaultValue="">
          <option value="" disabled>
            {placeholder}
          </option>

          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <ChevronDown size={16} />

      </div>

    </div>
  );
}


function UploadCard({
  title,
  subtitle,
  icon,
  color,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`upload-card ${color}`}>

      <div className="upload-top">
        {icon}

        <div>
          <strong>{title}</strong>
          <small>{subtitle}</small>
        </div>
      </div>

      <div className="upload-zone">

        <UploadCloud size={27} />

        <strong>
          Click to upload or drag & drop
        </strong>

        <small>
          PDF, JPG, PNG (Max 5MB)
        </small>

      </div>

    </div>
  );
}
