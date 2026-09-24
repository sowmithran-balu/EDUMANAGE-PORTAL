import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import StudentCoursesWorkspace from "@/components/StudentCoursesWorkspace";

export default async function StudentCoursesPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "student") {
    redirect("/login");
  }

  return <StudentCoursesWorkspace />;
}
