import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentFeesWorkspace from "@/components/StudentFeesWorkspace";

async function getFeesData(studentId: string) {
  return await db.fee.findMany({
    where: { studentId },
    orderBy: { dueDate: "asc" },
  });
}

export default async function StudentFeesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const fees = await getFeesData(user.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          ERP Finance & Fee Center
        </h1>
        <p className="text-slate-500 text-xs mt-1 font-semibold">
          Review invoices, pay scheduled dues (Tuition, Hostel, Transport), and track overall institutional ledger balances.
        </p>
      </div>

      <StudentFeesWorkspace initialFees={fees} />
    </div>
  );
}
