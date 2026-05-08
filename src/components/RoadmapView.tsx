import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateRoadmap, RoadmapStep } from '../lib/gemini';
import { Map, ArrowRight } from 'lucide-react';

const FIELDS = [
  "Software Engineering",
  "Artificial Intelligence / ML",
  "Web Development",
  "Data Science",
  "Product Management",
  "UI/UX Design",
];

export function RoadmapView() {
  const [selectedField, setSelectedField] = useState("");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapStep[]>([]);

  const fetchRoadmap = async (field: string) => {
    setSelectedField(field);
    setLoading(true);
    try {
      const steps = await generateRoadmap(field);
      setRoadmap(steps);
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-teal-900">Career <span className="text-pink-500 italic">Roadmaps</span></h2>
        <p className="text-teal-700/70 font-light">Discover the path to your dream job.</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {FIELDS.map(field => (
          <button
            key={field}
            onClick={() => fetchRoadmap(field)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              selectedField === field 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-white/50 text-teal-800 hover:bg-white hover:shadow-sm border border-white/60'
            }`}
          >
            {field}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
            </div>
          </motion.div>
        )}

        {!loading && roadmap.length > 0 && (
          <motion.div key="roadmap" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
            {/* Soft connecting line */}
            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-pink-200 via-teal-200 to-pink-200 hidden md:block"></div>

            <div className="space-y-6">
              {roadmap.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-6 md:gap-10">
                  <div className="hidden md:flex relative z-10 w-16 h-16 shrink-0 bg-white shadow-lg rounded-full items-center justify-center border border-pink-100 text-pink-500 font-serif text-xl border-4 border-white">
                    {idx + 1}
                  </div>
                  <div className="flex-1 bg-white/60 backdrop-blur-md border border-white/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition-all group">
                    <h3 className="text-xl font-medium text-teal-950 mb-3 flex items-center gap-3">
                      <span className="md:hidden w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-bold shrink-0">{idx + 1}</span>
                      {step.title}
                    </h3>
                    <p className="text-teal-800/80 leading-relaxed font-light">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
