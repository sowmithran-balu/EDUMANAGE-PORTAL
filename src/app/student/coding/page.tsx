import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentCodingSandbox from "@/components/StudentCodingSandbox";

async function getCodingData(studentId: string) {
  // Get student enrollments
  const enrollments = await db.enrollment.findMany({
    where: { studentId },
    include: {
      class: {
        include: {
          codingAssignments: {
            include: {
              submissions: {
                where: { studentId },
                orderBy: { submittedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const assignments: any[] = [];
  enrollments.forEach((e) => {
    e.class.codingAssignments.forEach((asg) => {
      assignments.push({
        id: asg.id,
        title: asg.title,
        description: asg.description,
        starterCode: asg.starterCode,
        className: e.class.name,
        latestSubmission: asg.submissions[0] || null,
      });
    });
  });

  return assignments;
}

export default async function StudentCodingPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const assignments = await getCodingData(user.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Online Coding Sandbox
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Complete practical programming challenges. Implement and compile solutions directly in your workspace.
        </p>
      </div>

      <StudentCodingSandbox initialAssignments={assignments} />
    </div>
  );
}
