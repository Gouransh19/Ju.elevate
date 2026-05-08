import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface UploadCardProps {
  onAnalyze: (file: File, jobDescription: string) => void;
}

export function UploadCard({ onAnalyze }: UploadCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile);
      } else {
        alert("Please upload a PDF or DOCX file.");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="space-y-10">
        
        {/* File Upload Section */}
        <section>
          <h2 className="text-lg font-serif text-teal-900 mb-4">1. Upload Resume</h2>
          
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative group flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300",
                  isDragging 
                    ? "border-pink-300 bg-pink-50/50" 
                    : "border-white/50 hover:border-pink-200 hover:bg-white/60"
                )}
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                  <UploadCloud className="w-8 h-8 text-pink-400" />
                </div>
                <p className="text-base font-serif text-teal-900">Drag & drop your resume</p>
                <p className="text-sm text-teal-700/60 mt-1 font-light">Supports PDF and DOCX max 10MB</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
                  }}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="file-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-5 border border-white/60 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-teal-900 line-clamp-1">{file.name}</h3>
                    <p className="text-xs text-teal-700/60">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="p-2 text-teal-700/50 hover:text-rose-500 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Job Description Section */}
        <section>
          <h2 className="text-lg font-serif text-teal-900 mb-4">2. Target Job Description</h2>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-48 p-5 bg-white/40 border border-white/60 rounded-2xl text-teal-900 placeholder:text-teal-900/40 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 transition-all resize-none shadow-sm font-light backdrop-blur-sm"
          />
        </section>

        <div className="pt-2">
          <button
            onClick={() => onAnalyze(file!, jobDescription)}
            disabled={!file || !jobDescription.trim()}
            className={cn(
              "w-full py-4 px-6 rounded-2xl text-white font-medium tracking-wide text-lg transition-all duration-300 shadow-md",
              (!file || !jobDescription.trim()) 
                ? "bg-teal-900/20 text-teal-900/40 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-r from-teal-400 to-pink-400 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            Analyze Match Score
          </button>
        </div>
      </div>
    </motion.div>
  );
}
