
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

import {
  UploadCloud,
  FileText,
  Github,
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  ShieldCheck,
  BrainCircuit,
  LoaderCircle,
} from "lucide-react";

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"];

function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateAndSetFile = (file) => {
    if (!file) return;

    const extension = file.name
      .toLowerCase()
      .slice(file.name.lastIndexOf("."));

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setErrorMessage(
        "Please upload a PDF, DOCX, or TXT resume."
      );
      return;
    }

    setResumeFile(file);
    setErrorMessage("");
  };

  const handleFileChange = (event) => {
    validateAndSetFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (loading) return;

    validateAndSetFile(event.dataTransfer.files?.[0]);
  };

  const removeFile = () => {
    setResumeFile(null);
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!resumeFile) {
      setErrorMessage("Please upload your resume first.");
      return;
    }

    setLoading(true);

    try {
      // Preserve existing Flask API request format
      const formData = new FormData();

      formData.append("resume", resumeFile);
      formData.append(
        "githubUsername",
        githubUsername.trim()
      );
      formData.append(
        "leetcodeUsername",
        leetcodeUsername.trim()
      );

      const response = await fetch(
        "http://127.0.0.1:5000/api/upload-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Backend returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Could not upload resume."
        );
      }

      // Preserve existing localStorage keys
      localStorage.setItem(
        "resumeFilename",
        resumeFile.name
      );

      localStorage.setItem(
        "githubUsername",
        githubUsername.trim()
      );

      localStorage.setItem(
        "leetcodeUsername",
        leetcodeUsername.trim()
      );

      const resumeText =
        data.resumeText ||
        data.resume_text ||
        data.text ||
        "";

      if (resumeText) {
        localStorage.setItem("resumeText", resumeText);
      }

      localStorage.setItem(
        "analysisData",
        JSON.stringify(data)
      );

      // Preserve existing navigation flow
      navigate("/loading");

    } catch (error) {
      console.error("Upload error:", error);

      setErrorMessage(
        error.message ||
        "Something went wrong while uploading your resume."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="relative isolate min-h-screen overflow-hidden bg-[#fafbff] px-5 py-14 sm:px-6 sm:py-20">

        {/* Background effects */}
        <div className="pointer-events-none absolute -top-40 right-[-150px] h-[500px] w-[500px] rounded-full bg-violet-200/40 blur-[110px]" />

        <div className="pointer-events-none absolute -bottom-40 left-[-150px] h-[450px] w-[450px] rounded-full bg-sky-100/70 blur-[100px]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(#c7d2fe 0.8px, transparent 0.8px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto max-w-3xl">

          {/* PAGE HEADER */}
          <div className="text-center">

            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/90 px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={16} />
              Your Career Journey Starts Here
            </div>

            <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <BrainCircuit size={30} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Discover your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
                career potential
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
              Upload your resume and optionally add your
              coding profiles to unlock personalized career
              readiness insights.
            </p>
          </div>

          {/* UPLOAD FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 overflow-hidden rounded-[28px] border border-white bg-white/95 p-6 shadow-[0_20px_70px_-25px_rgba(79,70,229,0.18)] backdrop-blur-xl sm:p-9"
          >

            {/* FORM HEADING */}
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Upload Your Career Profile
                </h2>

                <p className="text-sm text-slate-500">
                  Let's get to know your skills and experience
                </p>
              </div>
            </div>

            {/* RESUME UPLOAD */}
            <div>
              <label
                htmlFor="resume-upload"
                className="mb-3 block text-sm font-semibold text-slate-800"
              >
                Your Resume{" "}
                <span className="text-rose-500">*</span>
              </label>

              <div
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (!loading) setIsDragging(true);
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (!loading) setIsDragging(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();

                  if (
                    !event.currentTarget.contains(
                      event.relatedTarget
                    )
                  ) {
                    setIsDragging(false);
                  }
                }}
                onDrop={handleDrop}
                className={`relative rounded-[22px] border-2 border-dashed transition-all duration-300 ${
                  isDragging
                    ? "border-indigo-500 bg-indigo-100/70"
                    : resumeFile
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-indigo-200 bg-indigo-50/40 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <input
                  id="resume-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="sr-only"
                />

                {!resumeFile ? (
                  <label
                    htmlFor="resume-upload"
                    className="flex min-h-[235px] cursor-pointer flex-col items-center justify-center px-5 py-9 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-md shadow-indigo-100">
                      <UploadCloud size={31} />
                    </div>

                    <p className="mt-5 text-base font-bold text-slate-900">
                      Drag & Drop your Resume
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      or{" "}
                      <span className="font-semibold text-indigo-600">
                        click to browse files
                      </span>
                    </p>

                    <p className="mt-4 rounded-full border border-indigo-100 bg-white px-4 py-1.5 text-xs font-medium text-slate-500">
                      PDF, DOCX or TXT
                    </p>
                  </label>
                ) : (
                  <div className="flex min-h-[145px] items-center gap-4 p-5 sm:p-7">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                      <FileText size={27} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                        {resumeFile.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {(resumeFile.size / 1024).toFixed(1)} KB
                      </p>

                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 size={15} />
                        File selected successfully
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={removeFile}
                      disabled={loading}
                      aria-label="Remove selected resume"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* OPTIONAL PROFILES */}
            <div className="mt-9">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Connect Your Coding Profiles
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Add your profiles for more detailed insights
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Optional
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* GITHUB INPUT */}
                <div>
                  <label
                    htmlFor="github-username"
                    className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Github size={17} />
                    GitHub Username
                  </label>

                  <div className="relative">
                    <input
                      id="github-username"
                      type="text"
                      value={githubUsername}
                      onChange={(event) =>
                        setGithubUsername(event.target.value)
                      }
                      disabled={loading}
                      placeholder="e.g. your-github-username"
                      autoComplete="off"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* LEETCODE INPUT */}
                <div>
                  <label
                    htmlFor="leetcode-username"
                    className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <Code2
                      size={17}
                      className="text-amber-600"
                    />
                    LeetCode Username
                  </label>

                  <input
                    id="leetcode-username"
                    type="text"
                    value={leetcodeUsername}
                    onChange={(event) =>
                      setLeetcodeUsername(event.target.value)
                    }
                    disabled={loading}
                    placeholder="e.g. your-leetcode-username"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {errorMessage && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              >
                {errorMessage}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 font-semibold text-white shadow-lg shadow-indigo-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-65 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                  Preparing Your Analysis...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Start AI Analysis
                  <ArrowRight
                    size={19}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </>
              )}
            </button>

            {/* PRIVACY NOTE */}
            <div className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-indigo-500"
              />

              <span>
                Your resume is used to generate your career
                analysis. No account required.
              </span>
            </div>
          </form>

          {/* BOTTOM CAPTION */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Powered by intelligent resume analysis and
            career readiness insights
          </p>
        </div>
      </main>
    </>
  );
}

export default Upload;
