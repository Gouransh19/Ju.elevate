import { motion } from 'react';
import { Linkedin, Mail } from 'lucide-react';

const HR_PROFILES = [
  {
    name: "Sarah Jenkins",
    role: "Technical Recruiter at Google",
    field: "Software Engineering",
    image: "https://i.pravatar.cc/150?img=1",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Michael Chen",
    role: "University Programs Manager at Meta",
    field: "AI / ML",
    image: "https://i.pravatar.cc/150?img=11",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Elena Rodriguez",
    role: "Talent Acquisition Lead at Stripe",
    field: "Product Management",
    image: "https://i.pravatar.cc/150?img=5",
    linkedin: "https://linkedin.com"
  },
  {
    name: "David Smith",
    role: "Senior Tech Recruiter at Amazon",
    field: "Web Development",
    image: "https://i.pravatar.cc/150?img=8",
    linkedin: "https://linkedin.com"
  },
  {
    name: "Anita Desai",
    role: "Data & Analytics Recruiting at Netflix",
    field: "Data Science",
    image: "https://i.pravatar.cc/150?img=9",
    linkedin: "https://linkedin.com"
  },
  {
    name: "James Wilson",
    role: "Design Talent Partner at Apple",
    field: "UI/UX Design",
    image: "https://i.pravatar.cc/150?img=12",
    linkedin: "https://linkedin.com"
  }
];

export function HRConnectView() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif text-teal-900">Network & <span className="text-teal-600 italic">Connect</span></h2>
        <p className="text-teal-700/70 font-light">Reach out to top recruiters and build your professional network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HR_PROFILES.map((hr, idx) => (
          <div key={idx} className="bg-white/40 hover:bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md group-hover:scale-105 transition-transform">
              <img src={hr.image} alt={hr.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-medium text-teal-950">{hr.name}</h3>
            <p className="text-sm text-teal-800/80 mt-1 h-10">{hr.role}</p>
            <span className="mt-3 px-3 py-1 bg-pink-100/50 text-pink-700 text-xs font-semibold rounded-full uppercase tracking-wider">
              {hr.field}
            </span>
            
            <div className="w-full flex gap-3 mt-8">
              <a 
                href={hr.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-[#0077b5] text-white py-2.5 rounded-xl font-medium hover:bg-[#005e93] transition-colors shadow-sm"
              >
                <Linkedin className="w-4 h-4" /> Connect
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
