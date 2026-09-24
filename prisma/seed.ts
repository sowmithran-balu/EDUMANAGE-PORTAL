import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { recomputeStudentInsights } from "../src/lib/ai/aiEngine";

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function main() {
  console.log("Cleaning database...");
  await db.codingSubmission.deleteMany({});
  await db.codingAssignment.deleteMany({});
  await db.grievance.deleteMany({});
  await db.mentorMeeting.deleteMany({});
  await db.libraryLoan.deleteMany({});
  await db.libraryBook.deleteMany({});
  await db.placementApplication.deleteMany({});
  await db.placementJob.deleteMany({});
  await db.fee.deleteMany({});
  await db.report.deleteMany({});
  await db.aIInsight.deleteMany({});
  await db.examResult.deleteMany({});
  await db.exam.deleteMany({});
  await db.submission.deleteMany({});
  await db.assignment.deleteMany({});
  await db.attendance.deleteMany({});
  await db.enrollment.deleteMany({});
  await db.class.deleteMany({});
  await db.course.deleteMany({});
  await db.user.deleteMany({});

  console.log("Seeding core roles...");
  const adminPass = hashPassword("admin123");
  const teacherPass = hashPassword("teacher123");
  const studentPass = hashPassword("student123");

  const admin = await db.user.create({
    data: {
      name: "Dr. Arthur Vance",
      email: "admin@school.com",
      role: "admin",
      passwordHash: adminPass,
      profile: JSON.stringify({ bio: "Principal Administrator & AI ERP Oversight Manager", avatar: "/avatars/admin.png" }),
    },
  });

  const teacher = await db.user.create({
    data: {
      name: "Prof. Elena Rostova",
      email: "teacher@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "Computer Science & Mentor-Advisor Instructor", avatar: "/avatars/teacher.png" }),
    },
  });

  // CSBS Teachers Seeding
  const drChandru = await db.user.create({
    data: {
      name: "Dr. Chandru",
      email: "chandru.maths@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/Maths", avatar: "/avatars/default.png" }),
    },
  });

  const mrTamilarasu = await db.user.create({
    data: {
      name: "Mr.P.Tamilarasu",
      email: "tamilarasu.p@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/CSBS", avatar: "/avatars/default.png" }),
    },
  });

  const mrSurya = await db.user.create({
    data: {
      name: "Mr. V. Surya",
      email: "surya.v@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/CSBS", avatar: "/avatars/default.png" }),
    },
  });

  const drKrishnamoorthy = await db.user.create({
    data: {
      name: "Dr. K. Krishnamoorthy",
      email: "krishnamoorthy.k@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/MBA", avatar: "/avatars/default.png" }),
    },
  });

  const drPriya = await db.user.create({
    data: {
      name: "Dr. A. Priya",
      email: "priya.a@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/CSBS", avatar: "/avatars/default.png" }),
    },
  });

  const mrSandeep = await db.user.create({
    data: {
      name: "M. Sandeep",
      email: "sandeep.mech@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/Mech", avatar: "/avatars/default.png" }),
    },
  });

  const drGeethalakshmi = await db.user.create({
    data: {
      name: "Dr.V.Geethalakshmi",
      email: "geethalakshmi.v@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/Chemistry", avatar: "/avatars/default.png" }),
    },
  });

  const msKavithra = await db.user.create({
    data: {
      name: "Ms. Kavithra I",
      email: "kavithra.i@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/CSBS", avatar: "/avatars/default.png" }),
    },
  });

  const msDhivya = await db.user.create({
    data: {
      name: "Ms. M. Dhivya",
      email: "dhivya.m@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/CSBS", avatar: "/avatars/default.png" }),
    },
  });

  const drGeetha = await db.user.create({
    data: {
      name: "Dr. Geetha",
      email: "geetha.chem@school.com",
      role: "teacher",
      passwordHash: teacherPass,
      profile: JSON.stringify({ bio: "AP/Chemistry", avatar: "/avatars/default.png" }),
    },
  });

  // Students
  const alex = await db.user.create({
    data: {
      name: "Alex Mercer",
      email: "alex@school.com",
      role: "student",
      passwordHash: studentPass,
      profile: JSON.stringify({ bio: "Sophomore. High CGPA (9.5). Loves algorithms.", avatar: "/avatars/alex.png" }),
    },
  });

  const sarah = await db.user.create({
    data: {
      name: "Sarah Connor",
      email: "sarah@school.com",
      role: "student",
      passwordHash: studentPass,
      profile: JSON.stringify({ bio: "Freshman. CGPA (5.8). Missed exams/homeworks.", avatar: "/avatars/sarah.png" }),
    },
  });

  const jack = await db.user.create({
    data: {
      name: "Jack Ryan",
      email: "jack@school.com",
      role: "student",
      passwordHash: studentPass,
      profile: JSON.stringify({ bio: "Junior. CGPA (7.4). Solid coding record.", avatar: "/avatars/jack.png" }),
    },
  });

  console.log("Seeding courses and classes...");
  const csCourse = await db.course.create({
    data: {
      title: "Data Structures & Algorithms",
      description: "Linear/non-linear structures, sorting, and complexity classes.",
      category: "Computer Science",
      teacherId: teacher.id,
      schedule: "Mon/Wed 10:00 AM - 11:30 AM",
      syllabusUrl: "https://example.com/syllabus-cs101.pdf",
    },
  });

  const physCourse = await db.course.create({
    data: {
      title: "Advanced Classical Mechanics",
      description: "Newtonian orbits, Lagrangian formulations, and dynamic oscillation models.",
      category: "Physics",
      teacherId: teacher.id,
      schedule: "Tue/Thu 1:00 PM - 2:30 PM",
      syllabusUrl: "https://example.com/syllabus-phys201.pdf",
    },
  });

  // Seed CSBS Courses
  const bsCourse = await db.course.create({
    data: {
      title: "Business Statistics",
      description: "Hypothesis testing, probability distributions, sampling techniques, regression modeling, and statistics parameters applied in commercial contexts.",
      category: "CSBS",
      teacherId: drChandru.id,
      schedule: "Mon 9:00 AM - 10:00 AM, Wed 11:15 AM - 12:15 PM",
      syllabusUrl: "https://example.com/syllabus-b23mat501.pdf",
    },
  });

  const fdsCourse = await db.course.create({
    data: {
      title: "Foundation of Data Science",
      description: "Introductory details of data structures, descriptive and inferential summary statistics, analytical visualizations, and basic prediction frameworks.",
      category: "CSBS",
      teacherId: mrTamilarasu.id,
      schedule: "Tue 10:00 AM - 11:00 AM, Thu 11:15 AM - 12:15 PM",
      syllabusUrl: "https://example.com/syllabus-b23adt302.pdf",
    },
  });

  const fsdCourse = await db.course.create({
    data: {
      title: "Full Stack Development",
      description: "Modern client and server web design protocols utilizing Node.js, Express APIs, relational and non-relational database stores, and client views.",
      category: "CSBS",
      teacherId: mrSurya.id,
      schedule: "Mon 11:15 AM - 12:15 PM, Wed 12:15 PM - 1:15 PM",
      syllabusUrl: "https://example.com/syllabus-b23cbt501.pdf",
    },
  });

  const fcaCourse = await db.course.create({
    data: {
      title: "Financial and Cost Accounting",
      description: "Accounting equations, general ledger logs, trial balance forms, balance sheet design, cost sheets, and overhead parameters analysis.",
      category: "CSBS",
      teacherId: drKrishnamoorthy.id,
      schedule: "Tue 12:15 PM - 1:15 PM, Fri 10:00 AM - 11:00 AM",
      syllabusUrl: "https://example.com/syllabus-b23cbt502.pdf",
    },
  });

  const genAiCourse = await db.course.create({
    data: {
      title: "Professional Elective I - Generative AI",
      description: "Core algorithms for artificial generation including Autoencoders, GAN layouts, diffusion algorithms, and LLM text generation rules.",
      category: "CSBS",
      teacherId: drPriya.id,
      schedule: "Tue 9:00 AM - 10:00 AM, Thu 12:15 PM - 1:15 PM",
      syllabusUrl: "https://example.com/syllabus-b23cbe902.pdf",
    },
  });

  const roboticsCourse = await db.course.create({
    data: {
      title: "Open Elective I - Robotics",
      description: "Robotic kinematics trajectories, actuator selections, controller configurations, and sensor integrations for automated industrial loops.",
      category: "CSBS",
      teacherId: mrSandeep.id,
      schedule: "Mon 12:15 PM - 1:15 PM, Thu 10:00 AM - 11:00 AM",
      syllabusUrl: "https://example.com/syllabus-b23meo501.pdf",
    },
  });

  const sdgCourse = await db.course.create({
    data: {
      title: "Holistic Insights into UN SDG's",
      description: "United Nations Sustainable Development Goals parameters covering climate measures, resource protections, and green action frameworks.",
      category: "CSBS",
      teacherId: drGeethalakshmi.id,
      schedule: "Wed 1:45 PM - 2:45 PM",
      syllabusUrl: "https://example.com/syllabus-b23mct505.pdf",
    },
  });

  const dsLabCourse = await db.course.create({
    data: {
      title: "Data Science Lab",
      description: "Practical scripting exercises using Pandas, data manipulation libraries, data cleansing operations, and statistics tools.",
      category: "CSBS",
      teacherId: mrTamilarasu.id,
      schedule: "Fri 1:45 PM - 4:30 PM",
      syllabusUrl: "https://example.com/syllabus-b23adp301.pdf",
    },
  });

  const fsdLabCourse = await db.course.create({
    data: {
      title: "Full Stack Development Lab",
      description: "Practical development of frontend components, Express server APIs, MongoDB schemas, and end-to-end routing setups.",
      category: "CSBS",
      teacherId: mrSurya.id,
      schedule: "Wed 1:45 PM - 4:30 PM",
      syllabusUrl: "https://example.com/syllabus-b23cbp501.pdf",
    },
  });

  const evsCourse = await db.course.create({
    data: {
      title: "Environmental Sustainability",
      description: "Environmental parameters, greenhouse footprints, waste recycle schemes, renewable energy setups, and local ecology systems.",
      category: "CSBS",
      teacherId: drGeetha.id,
      schedule: "Thu 1:45 PM - 2:45 PM",
      syllabusUrl: "https://example.com/syllabus-b23mct501.pdf",
    },
  });

  const twmCourse = await db.course.create({
    data: {
      title: "Tutor Ward Meeting",
      description: "Weekly counseling networks, academic progress monitoring, feedback sessions, and student mentoring meetings.",
      category: "CSBS",
      teacherId: msDhivya.id,
      schedule: "Fri 12:15 PM - 1:15 PM",
      syllabusUrl: "https://example.com/syllabus-twm.pdf",
    },
  });

  const csClass = await db.class.create({
    data: {
      courseId: csCourse.id,
      name: "B.Tech CSE - Semester V",
      term: "Fall 2026",
    },
  });

  const physClass = await db.class.create({
    data: {
      courseId: physCourse.id,
      name: "B.Tech Physics - Semester V",
      term: "Fall 2026",
    },
  });

  // Seed CSBS classes
  const bsClass = await db.class.create({
    data: { courseId: bsCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const fdsClass = await db.class.create({
    data: { courseId: fdsCourse.id, name: "B.Tech CSBS - Semester III", term: "Fall 2026" },
  });
  const fsdClass = await db.class.create({
    data: { courseId: fsdCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const fcaClass = await db.class.create({
    data: { courseId: fcaCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const genAiClass = await db.class.create({
    data: { courseId: genAiCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const roboticsClass = await db.class.create({
    data: { courseId: roboticsCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const sdgClass = await db.class.create({
    data: { courseId: sdgCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const dsLabClass = await db.class.create({
    data: { courseId: dsLabCourse.id, name: "B.Tech CSBS - Semester III", term: "Fall 2026" },
  });
  const fsdLabClass = await db.class.create({
    data: { courseId: fsdLabCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const evsClass = await db.class.create({
    data: { courseId: evsCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });
  const twmClass = await db.class.create({
    data: { courseId: twmCourse.id, name: "B.Tech CSBS - Semester V", term: "Fall 2026" },
  });

  console.log("Enrolling students in classes...");
  await db.enrollment.createMany({
    data: [
      { studentId: alex.id, classId: csClass.id, status: "active" },
      { studentId: sarah.id, classId: csClass.id, status: "active" },
      { studentId: jack.id, classId: csClass.id, status: "active" },
      { studentId: alex.id, classId: physClass.id, status: "active" },
      { studentId: jack.id, classId: physClass.id, status: "active" },

      // Enroll in V semester CSBS courses
      { studentId: alex.id, classId: bsClass.id, status: "active" },
      { studentId: sarah.id, classId: bsClass.id, status: "active" },
      { studentId: jack.id, classId: bsClass.id, status: "active" },

      { studentId: alex.id, classId: fsdClass.id, status: "active" },
      { studentId: sarah.id, classId: fsdClass.id, status: "active" },
      { studentId: jack.id, classId: fsdClass.id, status: "active" },

      { studentId: alex.id, classId: fcaClass.id, status: "active" },
      { studentId: sarah.id, classId: fcaClass.id, status: "active" },
      { studentId: jack.id, classId: fcaClass.id, status: "active" },

      { studentId: alex.id, classId: genAiClass.id, status: "active" },
      { studentId: sarah.id, classId: genAiClass.id, status: "active" },
      { studentId: jack.id, classId: genAiClass.id, status: "active" },

      { studentId: alex.id, classId: roboticsClass.id, status: "active" },
      { studentId: sarah.id, classId: roboticsClass.id, status: "active" },
      { studentId: jack.id, classId: roboticsClass.id, status: "active" },

      { studentId: alex.id, classId: sdgClass.id, status: "active" },
      { studentId: sarah.id, classId: sdgClass.id, status: "active" },
      { studentId: jack.id, classId: sdgClass.id, status: "active" },

      { studentId: alex.id, classId: fsdLabClass.id, status: "active" },
      { studentId: sarah.id, classId: fsdLabClass.id, status: "active" },
      { studentId: jack.id, classId: fsdLabClass.id, status: "active" },

      { studentId: alex.id, classId: evsClass.id, status: "active" },
      { studentId: sarah.id, classId: evsClass.id, status: "active" },
      { studentId: jack.id, classId: evsClass.id, status: "active" },

      { studentId: alex.id, classId: twmClass.id, status: "active" },
      { studentId: sarah.id, classId: twmClass.id, status: "active" },
      { studentId: jack.id, classId: twmClass.id, status: "active" },
    ],
  });

  console.log("Seeding attendance records...");
  const dates = ["2026-08-03", "2026-08-05", "2026-08-10", "2026-08-12", "2026-08-17", "2026-08-19", "2026-08-24", "2026-08-26", "2026-08-31", "2026-09-02"];
  
  // Alex: 100% attendance
  for (const date of dates) {
    await db.attendance.create({ data: { classId: csClass.id, studentId: alex.id, date, status: "present" } });
    await db.attendance.create({ data: { classId: physClass.id, studentId: alex.id, date, status: "present" } });
  }

  // Sarah: 60% attendance
  const sarahStatus = ["present", "absent", "present", "late", "absent", "present", "absent", "late", "absent", "present"];
  for (let i = 0; i < dates.length; i++) {
    await db.attendance.create({ data: { classId: csClass.id, studentId: sarah.id, date: dates[i], status: sarahStatus[i] } });
  }

  // Jack: 90% attendance
  const jackStatus = ["present", "present", "present", "present", "late", "present", "present", "present", "present", "present"];
  for (let i = 0; i < dates.length; i++) {
    await db.attendance.create({ data: { classId: csClass.id, studentId: jack.id, date: dates[i], status: jackStatus[i] } });
    await db.attendance.create({ data: { classId: physClass.id, studentId: jack.id, date: dates[i], status: "present" } });
  }

  // Attendance for CSBS classes
  const csbsClasses = [bsClass.id, fsdClass.id, fcaClass.id, genAiClass.id, roboticsClass.id, sdgClass.id, fsdLabClass.id, evsClass.id, twmClass.id];
  for (const classId of csbsClasses) {
    // Alex: 100% present
    for (const date of dates) {
      await db.attendance.create({ data: { classId, studentId: alex.id, date, status: "present" } });
    }
    // Sarah: 60% present
    for (let i = 0; i < dates.length; i++) {
      await db.attendance.create({ data: { classId, studentId: sarah.id, date: dates[i], status: sarahStatus[i] } });
    }
    // Jack: 90% present
    for (let i = 0; i < dates.length; i++) {
      await db.attendance.create({ data: { classId, studentId: jack.id, date: dates[i], status: jackStatus[i] } });
    }
  }

  console.log("Seeding assignments and submissions...");
  const asg1 = await db.assignment.create({
    data: {
      classId: csClass.id,
      title: "Homework 1: Big O Analysis",
      description: "Analyze runtime metrics for binary searches and search trees.",
      dueDate: new Date("2026-08-15T23:59:59Z"),
      maxScore: 100,
    },
  });

  const physAsg1 = await db.assignment.create({
    data: {
      classId: physClass.id,
      title: "Problem Set 1: Lagrangian Formulation",
      description: "Determine generalized mechanical coordinates for classical double pendulums.",
      dueDate: new Date("2026-08-20T23:59:59Z"),
      maxScore: 50,
    },
  });

  await db.submission.create({ data: { assignmentId: asg1.id, studentId: alex.id, score: 98, feedback: "Perfect algorithmic breakdown." } });
  await db.submission.create({ data: { assignmentId: physAsg1.id, studentId: alex.id, score: 48, feedback: "Excellent physics equations." } });
  await db.submission.create({ data: { assignmentId: asg1.id, studentId: sarah.id, score: 62, feedback: "Missing runtime definitions." } });
  await db.submission.create({ data: { assignmentId: asg1.id, studentId: jack.id, score: 84, feedback: "Very solid. Minor proofing errors." } });
  await db.submission.create({ data: { assignmentId: physAsg1.id, studentId: jack.id, score: 40, feedback: "Good effort." } });

  // Assignments & Submissions for CSBS classes
  const fsdAsg = await db.assignment.create({
    data: {
      classId: fsdClass.id,
      title: "Homework 1: Node API routes",
      description: "Write basic routes using Express JS and route controllers.",
      dueDate: new Date("2026-08-25T23:59:59Z"),
      maxScore: 100,
    },
  });

  const bsAsg = await db.assignment.create({
    data: {
      classId: bsClass.id,
      title: "Problem Set 1: Normal Distributions",
      description: "Calculate standard deviations and probabilities using standard tables.",
      dueDate: new Date("2026-08-24T23:59:59Z"),
      maxScore: 100,
    },
  });

  await db.submission.create({ data: { assignmentId: fsdAsg.id, studentId: alex.id, score: 95, feedback: "Clean API structure." } });
  await db.submission.create({ data: { assignmentId: fsdAsg.id, studentId: jack.id, score: 85, feedback: "Good routing logic." } });
  await db.submission.create({ data: { assignmentId: fsdAsg.id, studentId: sarah.id, score: 55, feedback: "Missing route parameters validation." } });

  await db.submission.create({ data: { assignmentId: bsAsg.id, studentId: alex.id, score: 98, feedback: "Perfect computations." } });
  await db.submission.create({ data: { assignmentId: bsAsg.id, studentId: jack.id, score: 78, feedback: "A few calculation errors." } });
  await db.submission.create({ data: { assignmentId: bsAsg.id, studentId: sarah.id, score: 60, feedback: "Show your step-by-step proofs." } });

  console.log("Seeding exams and exam results...");
  const midExam = await db.exam.create({
    data: { classId: csClass.id, title: "Midterm Exam", date: new Date("2026-08-16T10:00:00Z"), maxMarks: 100 },
  });

  await db.examResult.create({ data: { examId: midExam.id, studentId: alex.id, marks: 95, grade: "A" } });
  await db.examResult.create({ data: { examId: midExam.id, studentId: sarah.id, marks: 58, grade: "F" } });
  await db.examResult.create({ data: { examId: midExam.id, studentId: jack.id, marks: 82, grade: "B" } });

  // Exams for CSBS
  const fsdMidExam = await db.exam.create({
    data: { classId: fsdClass.id, title: "Midterm Exam", date: new Date("2026-08-16T10:00:00Z"), maxMarks: 100 },
  });
  await db.examResult.create({ data: { examId: fsdMidExam.id, studentId: alex.id, marks: 96, grade: "A" } });
  await db.examResult.create({ data: { examId: fsdMidExam.id, studentId: sarah.id, marks: 59, grade: "F" } });
  await db.examResult.create({ data: { examId: fsdMidExam.id, studentId: jack.id, marks: 83, grade: "B" } });

  console.log("Seeding ERP Fees...");
  await db.fee.createMany({
    data: [
      { studentId: alex.id, type: "tuition", amount: 65000, paid: 65000, dueDate: new Date("2026-09-30"), status: "paid" },
      { studentId: alex.id, type: "hostel", amount: 20000, paid: 20000, dueDate: new Date("2026-09-30"), status: "paid" },
      
      { studentId: sarah.id, type: "tuition", amount: 65000, paid: 40000, dueDate: new Date("2026-08-30"), status: "pending" },
      { studentId: sarah.id, type: "transport", amount: 15000, paid: 0, dueDate: new Date("2026-08-30"), status: "pending" },
      
      { studentId: jack.id, type: "tuition", amount: 65000, paid: 65000, dueDate: new Date("2026-09-30"), status: "paid" },
      { studentId: jack.id, type: "hostel", amount: 20000, paid: 10000, dueDate: new Date("2026-09-30"), status: "pending" },
    ],
  });

  console.log("Seeding ERP Placements Jobs...");
  const googleJob = await db.placementJob.create({
    data: { company: "Google", role: "SDE Intern", package: "12 LPA", eligibilityCgpa: 8.5, location: "Bangalore", status: "active" },
  });
  const microsoftJob = await db.placementJob.create({
    data: { company: "Microsoft", role: "Support Engineer", package: "10 LPA", eligibilityCgpa: 7.0, location: "Hyderabad", status: "active" },
  });
  const amazonJob = await db.placementJob.create({
    data: { company: "Amazon", role: "SDE-1", package: "22 LPA", eligibilityCgpa: 8.0, location: "Chennai", status: "active" },
  });

  console.log("Seeding Placement Applications...");
  await db.placementApplication.createMany({
    data: [
      { jobId: googleJob.id, studentId: alex.id, round: "interview", feedback: "Strong coding skills in tech round 1." },
      { jobId: microsoftJob.id, studentId: jack.id, round: "applied", feedback: "Application profile submitted." },
    ],
  });

  console.log("Seeding Library catalog...");
  const book1 = await db.libraryBook.create({
    data: { title: "Introduction to Algorithms", author: "Cormen et al.", copies: 5, availableCopies: 4 },
  });
  const book2 = await db.libraryBook.create({
    data: { title: "Clean Code", author: "Robert C. Martin", copies: 3, availableCopies: 2 },
  });
  const book3 = await db.libraryBook.create({
    data: { title: "Design Patterns", author: "Gang of Four", copies: 2, availableCopies: 2 },
  });

  console.log("Seeding Library Loans...");
  await db.libraryLoan.createMany({
    data: [
      { bookId: book1.id, studentId: alex.id, issuedAt: new Date("2026-08-01"), returnBy: new Date("2026-08-20"), status: "issued" },
      { bookId: book2.id, studentId: jack.id, issuedAt: new Date("2026-08-10"), returnBy: new Date("2026-08-30"), status: "issued" },
    ],
  });

  console.log("Seeding Mentor Meetings...");
  await db.mentorMeeting.createMany({
    data: [
      { mentorId: teacher.id, menteeId: alex.id, notes: "Discussed research publications in deep neural structures.", category: "career" },
      { mentorId: teacher.id, menteeId: sarah.id, notes: "Student flags high attendance warnings. Encouraged morning slots support.", category: "attendance" },
      { mentorId: teacher.id, menteeId: jack.id, notes: "Refined coding interview strategies for incoming drives.", category: "academic" },
    ],
  });

  console.log("Seeding Grievance support logs...");
  await db.grievance.createMany({
    data: [
      { studentId: sarah.id, category: "hostel", description: "Water outage in Block C hostel washrooms since morning.", status: "investigating" },
      { studentId: jack.id, category: "infrastructure", description: "Wired ethernet ports in Lab 2 are broken.", status: "resolved", resolution: "Ports rewired and checked by IT Admin." },
    ],
  });

  console.log("Seeding Coding Assignments...");
  await db.codingAssignment.create({
    data: {
      classId: csClass.id,
      title: "Algorithmic Challenge: Solve Factorial",
      description: "Write a JS function solve(n) that computes and returns the factorial of an integer n.",
      starterCode: `function solve(n) {\n  // Write your code here\n  return 0;\n}`,
      testCasesJson: JSON.stringify([
        { input: "5", output: "120" },
        { input: "1", output: "1" }
      ]),
    },
  });

  console.log("Seeding ERP Fee ledger entries...");
  await db.fee.createMany({
    data: [
      // Sarah Connor Fees
      { studentId: sarah.id, type: "tuition", amount: 85000, paid: 85000, status: "paid", dueDate: new Date("2026-07-30") },
      { studentId: sarah.id, type: "hostel", amount: 45000, paid: 0, status: "pending", dueDate: new Date("2026-09-10") },
      { studentId: sarah.id, type: "exam", amount: 5500, paid: 0, status: "pending", dueDate: new Date("2026-10-15") },

      // Alex Mercer Fees
      { studentId: alex.id, type: "tuition", amount: 85000, paid: 85000, status: "paid", dueDate: new Date("2026-07-30") },
      { studentId: alex.id, type: "transport", amount: 15000, paid: 15000, status: "paid", dueDate: new Date("2026-08-05") },
      { studentId: alex.id, type: "exam", amount: 5500, paid: 5500, status: "paid", dueDate: new Date("2026-10-15") },

      // Jack Ryan Fees
      { studentId: jack.id, type: "tuition", amount: 85000, paid: 0, status: "pending", dueDate: new Date("2026-09-05") },
      { studentId: jack.id, type: "hostel", amount: 45000, paid: 45000, status: "paid", dueDate: new Date("2026-07-30") },
      { studentId: jack.id, type: "exam", amount: 5500, paid: 0, status: "pending", dueDate: new Date("2026-10-15") },
    ]
  });

  console.log("Precomputing AI Insights for seeded students...");
  await recomputeStudentInsights(alex.id);
  await recomputeStudentInsights(sarah.id);
  await recomputeStudentInsights(jack.id);

  console.log("Seeding complete! College Portal ERP environment is populated.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
