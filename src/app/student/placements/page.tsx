import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentPlacementsWorkspace from "@/components/StudentPlacementsWorkspace";

async function getPlacementsData(studentId: string) {
  // Fetch available jobs
  const jobs = await db.placementJob.findMany({
    where: { status: "active" },
  });

  // Fetch student's applications
  const applications = await db.placementApplication.findMany({
    where: { studentId },
    include: { job: true },
    orderBy: { appliedAt: "desc" },
  });

  return { jobs, applications };
}

export default async function StudentPlacementsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  // Parse student CGPA from profile
  let cgpa = 7.5; // fallback
  try {
    if (user.profile) {
      const profileData = JSON.parse(user.profile);
      const match = profileData.bio?.match(/CGPA\s*\(?([0-9.]+)\)?/i);
      if (match && match[1]) {
        cgpa = parseFloat(match[1]);
      }
    }
  } catch {}

  const data = await getPlacementsData(user.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Placement & Careers Board
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Apply to ongoing recruitment drives, verify CGPA eligibility requirements, and monitor interview round progress.
        </p>
      </div>

      <StudentPlacementsWorkspace
        jobs={data.jobs}
        initialApplications={data.applications}
        studentCgpa={cgpa}
      />
    </div>
  );
}
