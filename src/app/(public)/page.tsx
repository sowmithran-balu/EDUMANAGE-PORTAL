import Link from "next/link";
import { db } from "@/lib/db";
import { GraduationCap, ArrowRight, BrainCircuit, Sparkles, BookOpen, User, Flame } from "lucide-react";

async function getFeaturedCourses() {
  try {
    return await db.course.findMany({
      include: {
        teacher: true,
        classes: {
          select: { name: true }
        }
      },
      take: 3,
    });
  } catch {
    return [];
  }
}

async function getAnonymizedStudyTips() {
  try {
    const insights = await db.aIInsight.findMany({
      where: { type: "recommendation" },
      select: { payloadJson: true },
      take: 5,
    });

    if (insights.length === 0) {
      return [
        "Create dedicated time blocks for reviewing weak topics like Graph Traversals to prevent pre-exam cramming.",
        "Improve performance trajectory by solving at least 3 practice problems under timed conditions weekly.",
        "Attend lectures consistently; a drop below 85% attendance statistically correlates with a 12% grade decline.",
        "Discuss mid-term paper mistakes with your instructor to clarify core conceptual misunderstandings early.",
      ];
    }

    const tips: string[] = [];
    insights.forEach((insight) => {
      try {
        const payload = JSON.parse(insight.payloadJson);
        const recommendationsText = payload.recommendations || "";
        
        // Clean markdown text into plain sentences
        const cleanLines = recommendationsText
          .split("\n")
          .map((line: string) => line.replace(/[#*`\-]/g, "").trim())
          .filter((line: string) => line.length > 20 && !line.toLowerCase().includes("action plan") && !line.toLowerCase().includes("weak subject"));
        
        if (cleanLines.length > 0) {
          tips.push(cleanLines[0]); // Take the first clean recommendation sentence
        }
      } catch {}
    });

    return tips.length > 0 ? tips : [
      "Dedicate an extra 30 minutes daily to subjects where your average drops 10% below your overall benchmark.",
      "Submit all homework on time; missing even one assignment has a high weight in predictive academic risk models.",
    ];
  } catch {
    return [
      "Review foundations daily to reinforce neural connections.",
      "Stay active in class discussions to clarify questions in real time.",
    ];
  }
}

export default async function HomePage() {
  const courses = await getFeaturedCourses();
  const tips = await getAnonymizedStudyTips();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0f19] via-[#0f172a] to-[#0b0f19]">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center z-10">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-300 uppercase mb-8 animate-pulse">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>AI-Driven Education Intelligence</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            The Classroom of Tomorrow,<br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              Empowered by Predictive AI
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 mb-10 leading-relaxed">
            Aether Academy integrates public syllabus maps, class management metrics, and a proactive AI Academic Engine that tracks attendance, predicts grading risks, and crafts personalized study paths.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/courses"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <span>Explore Courses</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl border border-slate-700/50 transition-all cursor-pointer"
            >
              Enroll Now
            </Link>
          </div>
        </div>
      </section>

      {/* AI Tips Ticker Widget */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16 z-20">
        <div className="glass-panel rounded-3xl p-6 ai-glow relative overflow-hidden flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-3 bg-indigo-500/20 px-4 py-2 rounded-2xl border border-indigo-500/30 shrink-0">
            <BrainCircuit className="h-6 w-6 text-indigo-400 animate-bounce" />
            <span className="font-bold text-sm text-indigo-300 tracking-wide uppercase">AI Study Tips</span>
          </div>
          
          {/* Ticker Loop Container */}
          <div className="flex-grow overflow-hidden w-full h-8 relative">
            <div className="absolute inset-0 flex items-center">
              <p className="text-sm font-medium text-slate-300 animate-[pulse_3s_infinite] truncate">
                💡 <span className="text-slate-400">Anonymized Insights:</span> "{tips[Math.floor(Math.random() * tips.length)]}"
              </p>
            </div>
          </div>

          <div className="shrink-0 text-xs text-indigo-400 font-semibold border-b border-indigo-500/40 pb-0.5">
            Updated hourly
          </div>
        </div>
      </section>

      {/* Featured Courses Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">Featured Curriculums</h2>
            <p className="text-slate-400 mt-2">Explore our premium syllabi mapped directly to career paths.</p>
          </div>
          <Link href="/courses" className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center space-x-1 mt-4 md:mt-0 transition-colors">
            <span>Browse All Courses</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-3xl p-6 hover:translate-y-[-4px] hover:border-slate-700/60 transition-all duration-300 flex flex-col justify-between h-80">
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-xl mb-4 border border-indigo-500/10">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{course.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">{course.description}</p>
              </div>

              <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                    <User className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">{course.teacher.name}</p>
                    <p className="text-[10px] text-slate-500">Course Instructor</p>
                  </div>
                </div>
                <Link
                  href={`/courses/${course.id}`}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center space-x-1"
                >
                  <span>Syllabus</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className="w-full bg-slate-950/40 border-y border-slate-900 py-16 my-16 flex justify-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <p className="text-4xl md:text-5xl font-extrabold text-indigo-400 tracking-tight mb-2">94%</p>
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Predictive Risk Accuracy</p>
            <p className="text-xs text-slate-500 mt-2">XGBoost & logistic factors validated across academic metrics.</p>
          </div>
          <div className="p-6 border-y md:border-y-0 md:border-x border-slate-900">
            <p className="text-4xl md:text-5xl font-extrabold text-sky-400 tracking-tight mb-2">&lt; 1.5s</p>
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Response Speed</p>
            <p className="text-xs text-slate-500 mt-2">Async event-driven engine saves insights to prevent block recomputes.</p>
          </div>
          <div className="p-6">
            <p className="text-4xl md:text-5xl font-extrabold text-emerald-400 tracking-tight mb-2">3-Step</p>
            <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Onboarding Walkthrough</p>
            <p className="text-xs text-slate-500 mt-2">Interactive student panels custom-designed for new enrollee success.</p>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-20 text-center">
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Meet Our Leading Faculty</h2>
          <p className="text-slate-400 mt-2">Instructors leveraging our AI grading assistant dashboard to direct targeted care.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-8">
          <div className="glass-card rounded-3xl p-6 w-full md:w-80 flex flex-col items-center">
            <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center border border-indigo-400/20 mb-4 shadow-lg shadow-indigo-500/10">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Prof. Elena Rostova</h3>
            <p className="text-xs text-indigo-400 font-semibold mb-2">Computer Science Faculty</p>
            <p className="text-slate-400 text-xs leading-relaxed text-center px-4">
              "The AI grading co-pilot surfaces flagging students immediately, allowing me to focus on actual support rather than database parsing."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
