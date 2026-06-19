"use client";

import {
  useRef,
  useState,
} from "react";

import api from "@/lib/api";

import toast from "react-hot-toast";

import {

  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Eye,
  FileBadge,
  Briefcase,
  User,
  Mail,
  Phone,
  Award,

} from "lucide-react";


export default function UploadResume() {

  /* ========================================
     STATES
  ======================================== */

  const [
    loading,
    setLoading
  ] = useState(false);


  const [
    dragActive,
    setDragActive
  ] = useState(false);


  const [
    resume,
    setResume
  ] = useState(null);


  const [
    preview,
    setPreview
  ] = useState("");


  const [
    formData,
    setFormData
  ] = useState({

    fullName: "",

    email: "",

    phone: "",

    position: "",

    experience: "",

  });


  const fileInputRef =
    useRef(null);


  /* ========================================
     HANDLE INPUT CHANGE
  ======================================== */

  const handleChange =
    (e) => {

      setFormData({

        ...formData,

        [e.target.name]:
          e.target.value,

      });

    };


  /* ========================================
     HANDLE FILE
  ======================================== */

  const handleFile =
    (file) => {

      if (!file) return;


      /* FILE VALIDATION */

      const allowedTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      ];


      if (

        !allowedTypes.includes(

          file.type

        )

      ) {

        toast.error(

          "Only PDF/DOC/DOCX allowed"

        );

        return;

      }


      /* MAX SIZE */

      if (

        file.size >

        5 * 1024 * 1024

      ) {

        toast.error(

          "Max file size is 5MB"

        );

        return;

      }


      setResume(file);

      setPreview(

        URL.createObjectURL(file)

      );


      toast.success(
        "Resume selected successfully"
      );

    };


  /* ========================================
     DRAG EVENTS
  ======================================== */

  const handleDrag =
    (e) => {

      e.preventDefault();

      e.stopPropagation();


      if (

        e.type ===
          "dragenter" ||

        e.type === "dragover"

      ) {

        setDragActive(true);

      } else {

        setDragActive(false);

      }

    };


  const handleDrop =
    (e) => {

      e.preventDefault();

      e.stopPropagation();

      setDragActive(false);


      if (

        e.dataTransfer.files &&
        e.dataTransfer.files[0]

      ) {

        handleFile(

          e.dataTransfer.files[0]

        );

      }

    };


  /* ========================================
     REMOVE FILE
  ======================================== */

  const removeFile =
    () => {

      setResume(null);

      setPreview("");


      if (

        fileInputRef.current

      ) {

        fileInputRef.current.value =
          "";

      }


      toast.success(
        "Resume removed"
      );

    };


  /* ========================================
     UPLOAD RESUME
  ======================================== */

  const uploadResume =
    async () => {

      try {

        /* VALIDATION */

        if (

          !formData.fullName ||

          !formData.email ||

          !formData.position

        ) {

          toast.error(
            "Please fill all required fields"
          );

          return;

        }


        if (!resume) {

          toast.error(
            "Please upload resume"
          );

          return;

        }


        setLoading(true);


        /* FORM DATA */

        const uploadData =
          new FormData();


        uploadData.append(

          "fullName",

          formData.fullName

        );


        uploadData.append(

          "email",

          formData.email

        );


        uploadData.append(

          "phone",

          formData.phone

        );


        uploadData.append(

          "position",

          formData.position

        );


        uploadData.append(

          "experience",

          formData.experience

        );


        uploadData.append(

          "resume",

          resume

        );


        /* API */

        const res =
          await api.post(

            "/career/upload-resume",

            uploadData,

            {

              headers: {

                "Content-Type":
                  "multipart/form-data",

              },

            }

          );


        if (res.data.success) {

          toast.success(
            "Resume uploaded successfully"
          );


          /* RESET */

          setFormData({

            fullName: "",

            email: "",

            phone: "",

            position: "",

            experience: "",

          });


          setResume(null);

          setPreview("");

        }

      } catch (error) {

        console.log(error);

        toast.error(
          "Upload failed"
        );

      } finally {

        setLoading(false);

      }

    };


  return (

    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#020617] via-[#081028] to-[#111827] p-6 lg:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl">

      {/* ========================================
          BACKGROUND GLOW
      ======================================== */}

      <div className="absolute top-0 right-0 w-[320px] h-[320px] bg-cyan-500/10 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-blue-500/10 blur-[120px] rounded-full" />


      {/* ========================================
          HEADER
      ======================================== */}

      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}

        <div>

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/20 px-4 py-2 rounded-full text-cyan-400 text-sm font-semibold mb-5">

            <Sparkles size={15} />

            AI Resume Upload Portal

          </div>


          <h2 className="text-4xl md:text-5xl font-black text-white">

            Upload Resume

          </h2>


          <p className="text-slate-400 text-lg mt-4 max-w-2xl leading-relaxed">

            Upload your resume & apply for jobs with
            secure cloud-based resume management system.

          </p>

        </div>


        {/* RIGHT */}

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-4 rounded-3xl">

          <ShieldCheck
            size={34}
            className="text-cyan-400"
          />


          <div>

            <h3 className="text-white font-bold text-lg">

              Secure Upload

            </h3>


            <p className="text-slate-400 text-sm">

              Encrypted & protected storage

            </p>

          </div>

        </div>

      </div>


      {/* ========================================
          MAIN GRID
      ======================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* ========================================
            LEFT SIDE
        ======================================== */}

        <div className="xl:col-span-2 space-y-8">

          {/* ========================================
              FORM
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

            {/* GLOW */}

            <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-cyan-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              {/* TITLE */}

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-2xl">

                  <FileBadge size={30} />

                </div>


                <div>

                  <h3 className="text-3xl font-black text-white">

                    Applicant Details

                  </h3>


                  <p className="text-slate-400 mt-2">

                    Fill your professional information

                  </p>

                </div>

              </div>


              {/* FORM GRID */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* FULL NAME */}

                <div className="relative">

                  <User

                    size={18}

                    className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

                  />


                  <input

                    type="text"

                    name="fullName"

                    value={
                      formData.fullName
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Full Name"

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

                  />

                </div>


                {/* EMAIL */}

                <div className="relative">

                  <Mail

                    size={18}

                    className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

                  />


                  <input

                    type="email"

                    name="email"

                    value={
                      formData.email
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Email Address"

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

                  />

                </div>


                {/* PHONE */}

                <div className="relative">

                  <Phone

                    size={18}

                    className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

                  />


                  <input

                    type="text"

                    name="phone"

                    value={
                      formData.phone
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Phone Number"

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

                  />

                </div>


                {/* POSITION */}

                <div className="relative">

                  <Briefcase

                    size={18}

                    className="absolute top-1/2 left-5 -translate-y-1/2 text-slate-400"

                  />


                  <input

                    type="text"

                    name="position"

                    value={
                      formData.position
                    }

                    onChange={
                      handleChange
                    }

                    placeholder="Job Position"

                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300"

                  />

                </div>

              </div>


              {/* EXPERIENCE */}

              <div className="relative mt-5">

                <Award

                  size={18}

                  className="absolute top-5 left-5 text-slate-400"

                />


                <textarea

                  rows={5}

                  name="experience"

                  value={
                    formData.experience
                  }

                  onChange={
                    handleChange
                  }

                  placeholder="Write about your experience..."

                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-400/30 text-white pl-14 pr-5 py-4 rounded-2xl outline-none transition-all duration-300 resize-none"

                />

              </div>

            </div>

          </div>


          {/* ========================================
              UPLOAD AREA
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

            {/* GLOW */}

            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-blue-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              {/* TITLE */}

              <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center text-white shadow-2xl">

                  <UploadCloud size={30} />

                </div>


                <div>

                  <h3 className="text-3xl font-black text-white">

                    Upload Resume

                  </h3>


                  <p className="text-slate-400 mt-2">

                    PDF, DOC or DOCX (Max 5MB)

                  </p>

                </div>

              </div>


              {/* DROP ZONE */}

              <div

                onDragEnter={
                  handleDrag
                }

                onDragLeave={
                  handleDrag
                }

                onDragOver={
                  handleDrag
                }

                onDrop={
                  handleDrop
                }

                className={`relative border-2 border-dashed rounded-[32px] p-12 transition-all duration-300 ${
                  dragActive

                    ? "border-cyan-400 bg-cyan-500/10"

                    : "border-white/10 bg-white/5"
                }`}

              >

                <input

                  ref={fileInputRef}

                  type="file"

                  accept=".pdf,.doc,.docx"

                  className="hidden"

                  onChange={(e) =>

                    handleFile(

                      e.target.files[0]

                    )
                  }

                />


                {

                  !resume ? (

                    <div className="flex flex-col items-center justify-center text-center">

                      <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">

                        <UploadCloud size={44} />

                      </div>


                      <h3 className="text-3xl font-black text-white mt-8">

                        Drag & Drop Resume

                      </h3>


                      <p className="text-slate-400 mt-4 max-w-lg leading-relaxed">

                        Upload your professional resume for
                        faster job application processing.

                      </p>


                      <button

                        onClick={() =>

                          fileInputRef.current.click()
                        }

                        className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-2xl"

                      >

                        Choose File

                      </button>

                    </div>

                  ) : (

                    <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/20 bg-cyan-500/10 p-6">

                      {/* FILE INFO */}

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                        {/* LEFT */}

                        <div className="flex items-center gap-5">

                          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white shadow-2xl">

                            <FileText size={38} />

                          </div>


                          <div>

                            <h3 className="text-2xl font-black text-white">

                              {

                                resume.name

                              }

                            </h3>


                            <p className="text-slate-300 mt-2">

                              {

                                (
                                  resume.size /

                                  1024 /

                                  1024
                                ).toFixed(2)

                              } MB

                            </p>


                            <div className="flex items-center gap-2 mt-4 text-emerald-400 text-sm font-semibold">

                              <CheckCircle2 size={18} />

                              File Ready for Upload

                            </div>

                          </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="flex items-center gap-4">

                          <a

                            href={preview}

                            target="_blank"

                            className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all duration-300"

                          >

                            <Eye size={22} />

                          </a>


                          <button

                            onClick={
                              removeFile
                            }

                            className="w-14 h-14 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-400 flex items-center justify-center transition-all duration-300"

                          >

                            <Trash2 size={22} />

                          </button>

                        </div>

                      </div>

                    </div>

                  )

                }

              </div>


              {/* BUTTON */}

              <button

                onClick={
                  uploadResume
                }

                disabled={
                  loading
                }

                className="w-full mt-8 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:opacity-90 disabled:opacity-70 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl flex items-center justify-center gap-4"

              >

                {

                  loading ? (

                    <>

                      <Loader2

                        size={24}

                        className="animate-spin"

                      />

                      Uploading Resume...

                    </>

                  ) : (

                    <>

                      <UploadCloud size={24} />

                      Upload Resume

                    </>

                  )

                }

              </button>

            </div>

          </div>

        </div>


        {/* ========================================
            RIGHT SIDE
        ======================================== */}

        <div className="space-y-8">

          {/* ========================================
              INFO CARD
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-8 text-white shadow-2xl">

            <div className="absolute top-0 right-0 w-[220px] h-[220px] bg-white/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">

                🚀 Career Portal

              </div>


              <h2 className="text-4xl font-black mt-8 leading-tight">

                Apply Smarter <br />
                Get Hired Faster

              </h2>


              <p className="text-white/80 mt-6 leading-relaxed">

                Upload your resume securely and apply for
                high-paying finance & tech opportunities.

              </p>


              <div className="grid grid-cols-2 gap-4 mt-8">

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">

                  <p className="text-white/70 text-sm">

                    Companies

                  </p>


                  <h3 className="text-4xl font-black mt-3">

                    250+

                  </h3>

                </div>


                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5">

                  <p className="text-white/70 text-sm">

                    Open Jobs

                  </p>


                  <h3 className="text-4xl font-black mt-3">

                    1.2K

                  </h3>

                </div>

              </div>

            </div>

          </div>


          {/* ========================================
              TIPS
          ======================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">

            <div className="absolute bottom-0 left-0 w-[180px] h-[180px] bg-cyan-500/10 blur-[100px] rounded-full" />


            <div className="relative z-10">

              <h3 className="text-3xl font-black text-white mb-8">

                Resume Tips

              </h3>


              <div className="space-y-5">

                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">

                    1

                  </div>


                  <div>

                    <h4 className="text-white font-bold">

                      Keep Resume Updated

                    </h4>


                    <p className="text-slate-400 mt-1 text-sm">

                      Add latest skills & experiences.

                    </p>

                  </div>

                </div>


                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">

                    2

                  </div>


                  <div>

                    <h4 className="text-white font-bold">

                      Use Professional Format

                    </h4>


                    <p className="text-slate-400 mt-1 text-sm">

                      Clean resumes get more attention.

                    </p>

                  </div>

                </div>


                <div className="flex items-start gap-4">

                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">

                    3

                  </div>


                  <div>

                    <h4 className="text-white font-bold">

                      Highlight Skills

                    </h4>


                    <p className="text-slate-400 mt-1 text-sm">

                      Mention tech & finance expertise clearly.

                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}