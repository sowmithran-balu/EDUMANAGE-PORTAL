import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { BookOpen, User, Calendar, GraduationCap, ArrowRight, ShieldCheck } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCourseDetails(courseId: string) {
  try {
    return await db.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        classes: {
          include: {
            enrollments: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export default async function CourseDetailPage(props: PageProps) {
  const params = await props.params;
  const course = await getCourseDetails(params.id);

  if (!course) {
    notFound();
  }

  // Get current session user to customize the enrollment bridge
  const user = await getCurrentUser();
  
  // Check if student is already enrolled in any of the classes of this course
  let isAlreadyEnrolled = false;
  let enrolledClassId = "";
  if (user && user.role === "student") {
    const studentEnrollments = await db.enrollment.findMany({
      where: {
        studentId: user.id,
        classId: { in: course.classes.map((c) => c.id) },
      },
    });
    if (studentEnrollments.length > 0) {
      isAlreadyEnrolled = true;
      enrolledClassId = studentEnrollments[0].classId;
    }
  }

  // Simple mock syllabus list for layout richness
  const syllabusModules = [
    { title: "Module 1: Foundations & Prerequisites", desc: "Core concepts, terminology, and setup requirements." },
    { title: "Module 2: Mid-term Critical Competencies", desc: "Core analytical processes, algorithms, and logical modeling." },
    { title: "Module 3: Advanced Applications", desc: "Real-world scaling, integration constraints, and synthesis." },
    { title: "Module 4: Narrative Summary & Final Review", desc: "Synthesis of student performance maps and final project." },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
      {/* Back link */}
      <Link
        href="/courses"
        className="inline-flex items-center space-x-2 text-slate-400 hover:text-white text-xs font-semibold uppercase tracking-wider mb-8 transition-colors"
      >
        <span>← Back to Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Course Details (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-xl mb-4 border border-indigo-500/10">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{course.category}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mt-4">
              {course.description}
            </p>
          </div>

          {/* Syllabus Outline */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              <span>Syllabus Outline</span>
            </h2>
            <div className="space-y-4">
              {syllabusModules.map((mod, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 border border-slate-800/40">
                  <h3 className="font-bold text-white text-sm tracking-wide">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor Profile */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">Your Instructor</h2>
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="h-16 w-16 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 shrink-0">
                <User className="h-8 w-8 text-indigo-400" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-base font-bold text-white">{course.teacher.name}</h3>
                <p className="text-xs text-indigo-400 font-semibold">Academy Faculty</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Elena specializes in structuring logical and scientific programs, driving student achievements through interactive workflows and continuous guidance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action / Enrollment Box (Right 1 col) */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-indigo-500/20 ai-glow relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 rounded-bl-3xl border-l border-b border-indigo-500/20">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
            </div>

            <h2 className="font-bold text-lg text-white mb-4">Registration Workspace</h2>
            
            {/* Class Info */}
            <div className="space-y-4 text-xs mb-6 text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">Class Schedule</p>
                  <p className="text-[10px] mt-0.5">{course.schedule}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="h-4 w-4 text-sky-400 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-300">Enrolled Students</p>
                  <p className="text-[10px] mt-0.5">
                    {course.classes.reduce((sum, c) => sum + c.enrollments.length, 0)} Active Enrollees
                  </p>
                </div>
              </div>
            </div>

            {/* Core Cohort Chooser */}
            {course.classes.length > 0 ? (
              <div className="space-y-4">
                <p className="text-xs text-slate-400 font-semibold">Available Cohort: {course.classes[0].name}</p>

                {/* Redirect/Bridge logic */}
                {isAlreadyEnrolled ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400 text-center text-xs font-semibold">
                      ✓ Already Enrolled
                    </div>
                    <Link
                      href="/student"
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ) : user && user.role !== "student" ? (
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400 text-center text-xs leading-normal">
                    Workspace is restricted to Student roles. You are logged in as a **{user.role}**.
                  </div>
                ) : user ? (
                  <form action="/api/courses/enroll" method="POST">
                    <input type="hidden" name="classId" value={course.classes[0].id} />
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
                    >
                      <span>Enroll in Class</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  <Link
                    href={`/login?from=/courses/${course.id}`}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-3.5 rounded-2xl transition-all uppercase tracking-wider cursor-pointer"
                  >
                    <span>Sign In & Enroll</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-3 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-500 text-center text-xs">
                No active cohorts scheduled at this time.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
