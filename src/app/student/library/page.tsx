import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import StudentLibraryWorkspace from "@/components/StudentLibraryWorkspace";

async function getLibraryData(studentId: string) {
  const books = await db.libraryBook.findMany({
    orderBy: { title: "asc" },
  });

  const loans = await db.libraryLoan.findMany({
    where: { studentId },
    include: { book: true },
    orderBy: { issuedAt: "desc" },
  });

  return { books, loans };
}

export default async function StudentLibraryPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  const data = await getLibraryData(user.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Campus Library Registry
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Search textbook availability, reserve textbooks, and monitor outstanding book returns.
        </p>
      </div>

      <StudentLibraryWorkspace books={data.books} initialLoans={data.loans} />
    </div>
  );
}
