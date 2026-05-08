import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateMockTest, MockTestQuestion } from '../lib/gemini';
import { Loader2, Timer, CheckCircle2, XCircle } from 'lucide-react';

const FIELDS = [
  "Software Engineering",
  "Artificial Intelligence / ML",
  "Web Development",
  "Data Science",
  "Product Management",
  "UI/UX Design",
];

export function MockTestView() {
  const [selectedField, setSelectedField] = useState("");
  const [testState, setTestState] = useState<'selection' | 'generating' | 'taking' | 'results'>('selection');
  const [questions, setQuestions] = useState<MockTestQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);

  const startTest = async (field: string) => {
    setSelectedField(field);
    setTestState('generating');
    try {
      const qs = await generateMockTest(field);
      setQuestions(qs);
      setTimeLeft(qs.length * 60); // 1 min per question
      setAnswers({});
      setTestState('taking');
    } catch (err) {
      console.error(err);
      alert("Failed to generate test. Please check API key.");
      setTestState('selection');
    }
  };

  useEffect(() => {
    let timer: any;
    if (testState === 'taking' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (testState === 'taking' && timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const finishTest = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setTestState('results');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        
        {testState === 'selection' && (
          <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-4xl font-serif text-teal-900">Choose your <span className="text-pink-500 italic">Domain</span></h2>
              <p className="text-teal-700/70 font-light">Select a field to generate a custom, timed mock assessment.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {FIELDS.map(field => (
                <button
                  key={field}
                  onClick={() => startTest(field)}
                  className="p-6 bg-white/40 hover:bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl text-left transition-all hover:shadow-lg hover:-translate-y-1 group"
                >
                  <h3 className="font-medium text-teal-900 group-hover:text-pink-600 transition-colors">{field}</h3>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {testState === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-serif text-teal-800 animate-pulse">Crafting your custom test...</p>
          </motion.div>
        )}

        {testState === 'taking' && (
          <motion.div key="taking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-sm sticky top-24 z-10">
              <h3 className="font-serif text-xl text-teal-900">{selectedField} Assessment</h3>
              <div className="flex items-center gap-2 text-pink-600 font-mono text-lg bg-pink-50 px-4 py-2 rounded-xl border border-pink-100">
                <Timer className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="space-y-8">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white/50 backdrop-blur-sm border border-white/60 p-6 rounded-3xl shadow-sm">
                  <h4 className="text-lg font-medium text-teal-950 mb-4">{qIndex + 1}. {q.question}</h4>
                  <div className="space-y-3">
                    {q.options.map((opt, oIndex) => (
                      <label 
                        key={oIndex} 
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${answers[qIndex] === oIndex ? 'bg-pink-50 border-pink-300 shadow-sm' : 'bg-white/40 border-transparent hover:bg-white/80 hover:border-teal-200'}`}
                      >
                        <input 
                          type="radio" 
                          name={`q-${qIndex}`} 
                          className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300"
                          checked={answers[qIndex] === oIndex}
                          onChange={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                        />
                        <span className="text-teal-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={finishTest}
                className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Submit Exam
              </button>
            </div>
          </motion.div>
        )}

        {testState === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-10 rounded-[2.5rem] shadow-xl text-center space-y-4">
              <div className="text-6xl font-serif text-teal-900">
                {score} <span className="text-3xl text-teal-700/50">/ {questions.length}</span>
              </div>
              <p className="text-xl text-teal-800 font-light">
                {score === questions.length ? "Perfect score! You're ready." : 
                 score >= questions.length / 2 ? "Good job! Keep reviewing." : 
                 "Needs more practice. Keep going!"}
              </p>
              <button 
                onClick={() => setTestState('selection')}
                className="mt-6 px-6 py-2 bg-pink-100 text-pink-700 rounded-full font-medium hover:bg-pink-200 transition-colors"
              >
                Take another test
              </button>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-teal-900 ml-4">Review Answers</h3>
              {questions.map((q, qIndex) => {
                const isCorrect = answers[qIndex] === q.correctAnswer;
                return (
                  <div key={qIndex} className="bg-white/40 border border-white/50 p-6 rounded-3xl">
                    <div className="flex gap-3">
                      {isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" /> : <XCircle className="w-6 h-6 text-rose-500 shrink-0" />}
                      <div>
                        <p className="font-medium text-teal-950">{q.question}</p>
                        <p className="text-sm mt-2 text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-lg">Correct: {q.options[q.correctAnswer]}</p>
                        {!isCorrect && answers[qIndex] !== undefined && (
                          <p className="text-sm mt-2 ml-2 text-rose-700 bg-rose-50 inline-block px-3 py-1 rounded-lg">You selected: {q.options[answers[qIndex]]}</p>
                        )}
                        {!isCorrect && answers[qIndex] === undefined && (
                          <p className="text-sm mt-2 ml-2 text-slate-500 bg-slate-100 inline-block px-3 py-1 rounded-lg">Skipped</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
