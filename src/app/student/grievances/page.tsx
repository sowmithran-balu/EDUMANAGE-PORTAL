import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentGrievancesWorkspace from "@/components/StudentGrievancesWorkspace";

async function getGrievanceData(studentId: string) {
  return await db.grievance.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });
}

export default async function StudentGrievancesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const grievances = await getGrievanceData(user.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          ERP Student Help Desk
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Lodge tickets for campus concerns (Hostel, Academics, Infrastructure), and track resolution actions.
        </p>
      </div>

      <StudentGrievancesWorkspace initialGrievances={grievances} />
    </div>
  );
}
