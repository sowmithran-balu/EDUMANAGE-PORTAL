import Link from "next/link";
import { db } from "@/lib/db";
import { BookOpen, Search, ArrowRight, User } from "lucide-react";

interface SearchParams {
  q?: string;
  category?: string;
}

async function getCourses(search: string, category: string) {
  try {
    return await db.course.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              }
            : {},
          category ? { category: { equals: category } } : {},
        ],
      },
      include: {
        teacher: true,
        classes: {
          select: { name: true },
        },
      },
    });
  } catch (error) {
    console.error("Error loading courses:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const courses = await db.course.findMany({ select: { category: true } });
    const unique = Array.from(new Set(courses.map((c) => c.category)));
    return unique;
  } catch {
    return [];
  }
}

export default async function CoursesPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const selectedCategory = searchParams.category || "";

  const courses = await getCourses(query, selectedCategory);
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Course Catalog
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Access high-grade syllabus maps designed and evaluated using academic intelligence metrics. Enroll to feed records to the AI learning stream.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="glass-panel rounded-2xl p-4 mb-10 flex flex-col md:flex-row items-center gap-4 border border-slate-800">
        {/* Search Input Form */}
        <form method="GET" action="/courses" className="relative w-full md:flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search syllabus content, topics, titles..."
            className="w-full glass-input rounded-xl py-3 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-slate-500"
          />
          {selectedCategory && (
            <input type="hidden" name="category" value={selectedCategory} />
          )}
        </form>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0 justify-center">
          <Link
            href="/courses"
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              !selectedCategory
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/courses?category=${encodeURIComponent(cat)}${
                query ? `&q=${encodeURIComponent(query)}` : ""
              }`}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Course Listing */}
      {courses.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center max-w-xl mx-auto border border-slate-800">
          <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
          <p className="text-slate-400 text-sm">
            Try adjusting your search criteria or categories to locate alternative syllabus guides.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs uppercase tracking-wider mt-6 border-b border-indigo-500/20 pb-0.5"
          >
            <span>Reset Search</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between h-96 hover:translate-y-[-4px] hover:border-slate-700/50 transition-all duration-300 border border-slate-800/50"
            >
              <div>
                <div className="inline-flex items-center space-x-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-xl mb-4 border border-indigo-500/10">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{course.category}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                      <User className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        {course.teacher.name}
                      </p>
                      <p className="text-[10px] text-slate-500">Instructor</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-300">
                      {course.classes.length} Section(s)
                    </p>
                    <p className="text-[10px] text-slate-500">Available Cohorts</p>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/50 text-white text-center font-semibold text-xs py-3 rounded-2xl transition-all tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Syllabus & Registration</span>
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
