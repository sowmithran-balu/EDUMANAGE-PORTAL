"use client";

import { useState } from "react";
import {
  BookOpen,
  Search,
  Grid,
  List,
  ChevronRight,
  User,
  Users,
  Clock,
  Award,
  GraduationCap,
  Calendar,
  Layers,
  CheckCircle,
  FolderOpen,
  ArrowLeft,
  Download,
  Info,
  Clock3,
  CalendarDays,
  FileText,
  MessageSquare
} from "lucide-react";

// --- Types ---
interface FacultyMember {
  name: string;
  designation: string;
  role: string;
  email: string;
  photo?: string;
  officeHours?: string;
}

interface CourseAllocation {
  sno: number;
  code: string;
  title: string;
  abbreviation: string;
  type: "Core" | "Professional Elective" | "Open Elective" | "Lab" | "NC";
  credit: number | "NC";
  faculty: FacultyMember[];
  hours_allotted: number;
  department: string;
  year: number;
  semester: number;
  section: string;
  description: string;
  prerequisites: string;
  outcomes: string[];
  syllabus: { week: string; topic: string }[];
  timetable: { day: string; periods: string }[];
}

interface DepartmentContext {
  name: string;
  fullName: string;
  programme: string;
  academic_year: string;
  sections: string[];
  class_advisor: string;
  mentors: string[];
  icon: any;
  coursesCount: number;
  studentsCount: number;
}

// --- Sample Data ---
const DEPARTMENTS: DepartmentContext[] = [
  {
    name: "AI & DS",
    fullName: "Artificial Intelligence & Data Science",
    programme: "B.TECH – AI & DS",
    academic_year: "2026-2027",
    sections: ["A", "B"],
    class_advisor: "Dr.S.Thenmozhi",
    mentors: ["Ms.R.Kavitha", "Ms.P.Swetha"],
    icon: CpuIcon,
    coursesCount: 12,
    studentsCount: 118
  },
  {
    name: "CSBS",
    fullName: "Computer Science & Business Systems",
    programme: "B.TECH – CSBS",
    academic_year: "2026-2027",
    sections: ["A"],
    class_advisor: "Dr.B.Hemalatha",
    mentors: ["Ms.P.Swetha", "Ms.R.Kavitha"],
    icon: BusinessIcon,
    coursesCount: 10,
    studentsCount: 62
  },
  {
    name: "CSE",
    fullName: "Computer Science & Engineering",
    programme: "B.E. – CSE",
    academic_year: "2026-2027",
    sections: ["A", "B", "C"],
    class_advisor: "Dr.K.Pradeep",
    mentors: ["Mr.S.Senthil", "Ms.G.Sindhu"],
    icon: CodeIcon,
    coursesCount: 14,
    studentsCount: 178
  },
  {
    name: "ECE",
    fullName: "Electronics & Communication Engineering",
    programme: "B.E. – ECE",
    academic_year: "2026-2027",
    sections: ["A", "B"],
    class_advisor: "Dr.M.Anand",
    mentors: ["Mr.P.Kumar", "Ms.V.Chitra"],
    icon: SignalIcon,
    coursesCount: 11,
    studentsCount: 112
  },
  {
    name: "Mechanical",
    fullName: "Mechanical Engineering",
    programme: "B.E. – Mechanical",
    academic_year: "2026-2027",
    sections: ["A"],
    class_advisor: "Dr.T.Subramanian",
    mentors: ["Mr.A.Rajesh", "Mr.M.Bala"],
    icon: SettingsIcon,
    coursesCount: 8,
    studentsCount: 45
  }
];

const COURSES: CourseAllocation[] = [
  {
    sno: 1,
    code: "B23ADT501",
    title: "Software Engineering and Project Management",
    abbreviation: "SEPM",
    type: "Core",
    credit: 3,
    faculty: [
      { name: "Dr.B.Hemalatha", designation: "AP/CSBS", role: "Primary", email: "hemalatha.b@school.com", officeHours: "Mon 2-4 PM" },
      { name: "Ms.P.Swetha", designation: "AP/CSBS", role: "Support", email: "swetha.p@school.com" }
    ],
    hours_allotted: 4,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Covers agile methodologies, requirement engineering, design models, system architecture, test-driven development, and software estimation.",
    prerequisites: "Object Oriented Programming and Database Systems",
    outcomes: [
      "Define software engineering lifecycle models.",
      "Develop requirement specifications using UML standards.",
      "Configure project estimation and Agile sprint tracks."
    ],
    syllabus: [
      { week: "Week 1-2", topic: "Intro to software development lifecycles and Agile Scrum framework" },
      { week: "Week 3-4", topic: "Requirement gathering, SRS documentation, UML Diagrams" },
      { week: "Week 5-6", topic: "Design engineering, MVC Architecture, software metrics" },
      { week: "Week 7-8", topic: "Testing methodologies, unit tests, integration validation" },
      { week: "Week 9-12", topic: "Project management, COCOMO estimation model, DevOps pipelines" }
    ],
    timetable: [
      { day: "Monday", periods: "Period 2 (10:00 - 11:00 AM)" },
      { day: "Wednesday", periods: "Period 3 (11:15 - 12:15 PM)" }
    ]
  },
  {
    sno: 2,
    code: "B23ADT502",
    title: "Deep Learning Fundamentals",
    abbreviation: "DL",
    type: "Core",
    credit: 3,
    faculty: [
      { name: "Dr.S.Thenmozhi", designation: "ASP/AI&DS", role: "Primary", email: "thenmozhi.s@school.com", officeHours: "Tue & Thu 1-3 PM" }
    ],
    hours_allotted: 4,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Deep dive into artificial neural networks, convolution architectures, sequence learning, loss tuning optimization, and transfer setups.",
    prerequisites: "Machine Learning, Linear Algebra",
    outcomes: [
      "Build Multi-layer Perceptrons with backpropagation.",
      "Implement Convolution Neural Networks for image recognition.",
      "Configure Recurrent Neural Networks for textual sequence models."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Perceptrons, Feedforward neural networks, backpropagation calculus" },
      { week: "Week 4-6", topic: "Optimization algorithms, gradient descent variants, regularization" },
      { week: "Week 7-9", topic: "CNN architectures, AlexNet, ResNet, feature extractions" },
      { week: "Week 10-12", topic: "RNN, LSTM networks, Attention mechanisms, transformers intro" }
    ],
    timetable: [
      { day: "Tuesday", periods: "Period 1 (09:00 - 10:00 AM)" },
      { day: "Thursday", periods: "Period 2 (10:00 - 11:00 AM)" }
    ]
  },
  {
    sno: 3,
    code: "B23ADP501",
    title: "Deep Learning Lab",
    abbreviation: "DL Lab",
    type: "Lab",
    credit: 2,
    faculty: [
      { name: "Dr.S.Thenmozhi", designation: "ASP/AI&DS", role: "Primary", email: "thenmozhi.s@school.com" },
      { name: "Ms.R.Kavitha", designation: "AP/AI&DS", role: "Support", email: "kavitha.r@school.com" }
    ],
    hours_allotted: 4,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Hands-on implementation of neural networks, backpropagation algorithms, CNN classification, and LSTM sequence tasks using PyTorch.",
    prerequisites: "Python Programming, Machine Learning Lab",
    outcomes: [
      "Implement neural networks in PyTorch.",
      "Train classification CNN networks on GPU environments.",
      "Apply optimization settings to avoid overfitting."
    ],
    syllabus: [
      { week: "Lab 1-3", topic: "Tensor manipulations and automatic differentiation in PyTorch" },
      { week: "Lab 4-6", topic: "Building Multi-layer networks, classification experiments" },
      { week: "Lab 7-9", topic: "Convolution network coding, data augmentation practices" },
      { week: "Lab 10-12", topic: "Recurrent networks classification, project evaluations" }
    ],
    timetable: [
      { day: "Friday", periods: "Period 5-8 (01:45 - 04:30 PM)" }
    ]
  },
  {
    sno: 4,
    code: "B23ADE902",
    title: "Generative AI Architectures",
    abbreviation: "GenAI",
    type: "Professional Elective",
    credit: 3,
    faculty: [
      { name: "Dr.S.Thenmozhi", designation: "ASP/AI&DS", role: "Primary", email: "thenmozhi.s@school.com" }
    ],
    hours_allotted: 3,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Examines generative models including VAEs, Generative Adversarial Networks (GANs), Diffusion Models, and Large Language Models tuning.",
    prerequisites: "Deep Learning, Probabilistic Models",
    outcomes: [
      "Develop Variational Autoencoders for image generation.",
      "Code Generative Adversarial networks in stable settings.",
      "Fine-tune pre-trained LLM models with LoRA parameters."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Generative models overview, VAE design and implementation" },
      { week: "Week 4-6", topic: "GANs, DCGAN, loss balancing, stabilization tricks" },
      { week: "Week 7-9", topic: "Diffusion models, denoising architectures, text-to-image basics" },
      { week: "Week 10-12", topic: "LLMs, Attention modules, RLHF tuning overview" }
    ],
    timetable: [
      { day: "Monday", periods: "Period 4 (12:15 - 01:15 PM)" },
      { day: "Wednesday", periods: "Period 1 (09:00 - 10:00 AM)" }
    ]
  },
  {
    sno: 5,
    code: "B23MEO501",
    title: "Introductory Robotics and Automations",
    abbreviation: "ROB",
    type: "Open Elective",
    credit: 3,
    faculty: [
      { name: "Dr.T.Subramanian", designation: "Professor/Mech", role: "Primary", email: "subra.t@school.com" }
    ],
    hours_allotted: 3,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Kinematics, actuator systems, robotic controllers, path planning algorithms, and automation control systems details.",
    prerequisites: "Basic Physics, Matrix Operations",
    outcomes: [
      "Model kinematic trajectories for robotic manipulators.",
      "Select actuators based on payload limits.",
      "Design path controllers under obstacle constraints."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Coordinate frameworks, transformations, link joints configurations" },
      { week: "Week 4-6", topic: "Forward and Inverse Kinematics formulations" },
      { week: "Week 7-9", topic: "Sensors, Actuators, DC motors, controller integrations" },
      { week: "Week 10-12", topic: "Path plan frameworks, automation loops, safety rules" }
    ],
    timetable: [
      { day: "Tuesday", periods: "Period 4 (12:15 - 01:15 PM)" },
      { day: "Thursday", periods: "Period 4 (12:15 - 01:15 PM)" }
    ]
  },
  {
    sno: 6,
    code: "B23MCT501",
    title: "Environmental Sciences",
    abbreviation: "EVS",
    type: "NC",
    credit: "NC",
    faculty: [
      { name: "Ms.P.Swetha", designation: "AP/CSBS", role: "Primary", email: "swetha.p@school.com" }
    ],
    hours_allotted: 2,
    department: "AI & DS",
    year: 3,
    semester: 5,
    section: "B",
    description: "Study of ecosystems, biodiversity profiles, pollution management protocols, environmental regulations, and sustainable development goals.",
    prerequisites: "None",
    outcomes: [
      "Assess human impacts on environmental ecosystems.",
      "Describe green energy conversion techniques.",
      "Identify toxic waste management safety controls."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Ecosystem dynamics, natural resources conservation" },
      { week: "Week 4-6", topic: "Biodiversity preservation, threat factors" },
      { week: "Week 7-9", topic: "Pollution checks, air, water quality controls" },
      { week: "Week 10-12", topic: "Climate shifts, green energies, environmental laws" }
    ],
    timetable: [
      { day: "Thursday", periods: "Period 6 (02:45 - 03:45 PM)" }
    ]
  },
  {
    sno: 1,
    code: "B23MAT501",
    title: "Business Statistics",
    abbreviation: "BS",
    type: "Core",
    credit: 4,
    faculty: [
      { name: "Dr. Chandru", designation: "AP/Maths", role: "Primary", email: "chandru.maths@school.com" }
    ],
    hours_allotted: 4,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Hypothesis testing, probability distributions, sampling techniques, regression modeling, and statistics parameters applied in commercial contexts.",
    prerequisites: "Advanced Algebra",
    outcomes: [
      "Formulate null and alternative statistical hypotheses.",
      "Perform parametric and non-parametric data testing.",
      "Calculate linear correlation trends."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Probability distributions, normal curves, random metrics" },
      { week: "Week 4-6", topic: "Sampling layouts, point and interval estimations" },
      { week: "Week 7-9", topic: "Hypothesis parameters, z-tests, t-tests, chi-square formulas" },
      { week: "Week 10-12", topic: "Regression modeling, correlation ratios" }
    ],
    timetable: [
      { day: "Monday", periods: "Period 1 (09:00 - 10:00 AM)" },
      { day: "Wednesday", periods: "Period 3 (11:15 - 12:15 PM)" }
    ]
  },
  {
    sno: 2,
    code: "B23ADT302",
    title: "Foundation of Data Science",
    abbreviation: "FDS",
    type: "Core",
    credit: 3,
    faculty: [
      { name: "Mr.P.Tamilarasu", designation: "AP/CSBS", role: "Primary", email: "tamilarasu.p@school.com" }
    ],
    hours_allotted: 3,
    department: "CSBS",
    year: 2,
    semester: 3,
    section: "A",
    description: "Introductory details of data structures, descriptive and inferential summary statistics, analytical visualizations, and basic prediction frameworks.",
    prerequisites: "Python Programming",
    outcomes: [
      "Perform exploratory analytics.",
      "Code basic data cleansers.",
      "Draft distribution graphs."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Data types, structures, summary statistics" },
      { week: "Week 4-6", topic: "Exploratory analytics, cleaning methods, outlier maps" },
      { week: "Week 7-9", topic: "Data visualizations, matplotlib graphs" },
      { week: "Week 10-12", topic: "Linear regressions intro, predictive metrics" }
    ],
    timetable: [
      { day: "Tuesday", periods: "Period 2 (10:00 - 11:00 AM)" },
      { day: "Thursday", periods: "Period 3 (11:15 - 12:15 PM)" }
    ]
  },
  {
    sno: 3,
    code: "B23CBT501",
    title: "Full Stack Development",
    abbreviation: "FSD",
    type: "Core",
    credit: 3,
    faculty: [
      { name: "Mr. V. Surya", designation: "AP/CSBS", role: "Primary", email: "surya.v@school.com" }
    ],
    hours_allotted: 3,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Modern client and server web design protocols utilizing Node.js, Express APIs, relational and non-relational database stores, and client views.",
    prerequisites: "Web Programming Basics",
    outcomes: [
      "Build server-side REST APIs.",
      "Design client components.",
      "Establish secure database connections."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Server-side architectures, Express JS loops, routes" },
      { week: "Week 4-6", topic: "Database models, Mongo queries, relational mappings" },
      { week: "Week 7-9", topic: "Client integrations, state hooks, asynchronous fetches" },
      { week: "Week 10-12", topic: "Deployment parameters, session security tokens" }
    ],
    timetable: [
      { day: "Monday", periods: "Period 3 (11:15 - 12:15 PM)" },
      { day: "Wednesday", periods: "Period 4 (12:15 - 01:15 PM)" }
    ]
  },
  {
    sno: 4,
    code: "B23CBT502",
    title: "Financial and Cost Accounting",
    abbreviation: "FCA",
    type: "Core",
    credit: 3,
    faculty: [
      { name: "Dr. K. Krishnamoorthy", designation: "AP/MBA", role: "Primary", email: "krishnamoorthy.k@school.com" }
    ],
    hours_allotted: 3,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Accounting equations, general ledger logs, trial balance forms, balance sheet design, cost sheets, and overhead parameters analysis.",
    prerequisites: "Mathematical Foundations",
    outcomes: [
      "Record accounting ledger journals.",
      "Draft standard financial balance sheets.",
      "Conduct marginal costing checks."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Financial bookkeeping rules, double entry logs, ledger indices" },
      { week: "Week 4-6", topic: "Final accounts drafts, profit and loss balance sheets" },
      { week: "Week 7-9", topic: "Cost sheets parameters, direct and indirect costs" },
      { week: "Week 10-12", topic: "Budgetary allocations, break-even graphs" }
    ],
    timetable: [
      { day: "Tuesday", periods: "Period 4 (12:15 - 01:15 PM)" },
      { day: "Friday", periods: "Period 2 (10:00 - 11:00 AM)" }
    ]
  },
  {
    sno: 5,
    code: "B23CBE902",
    title: "Professional Elective I - Generative AI",
    abbreviation: "Gen AI",
    type: "Professional Elective",
    credit: 3,
    faculty: [
      { name: "Dr. A. Priya", designation: "AP/CSBS", role: "Primary", email: "priya.a@school.com" }
    ],
    hours_allotted: 3,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Core algorithms for artificial generation including Autoencoders, GAN layouts, diffusion algorithms, and LLM text generation rules.",
    prerequisites: "Deep Learning Intro",
    outcomes: [
      "Build generative neural graphs.",
      "Model transformers mechanisms.",
      "Tune text-generation interfaces."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "VAE, Latent space vectors, encoders decoders structure" },
      { week: "Week 4-6", topic: "GAN networks, DCGAN layout, training stabilization models" },
      { week: "Week 7-9", topic: "Diffusion architectures, LLM architectures" },
      { week: "Week 10-12", topic: "Model optimizations, fine-tuning practices" }
    ],
    timetable: [
      { day: "Tuesday", periods: "Period 1 (09:00 - 10:00 AM)" },
      { day: "Thursday", periods: "Period 4 (12:15 - 01:15 PM)" }
    ]
  },
  {
    sno: 6,
    code: "B23MEO501",
    title: "Open Elective I - Robotics",
    abbreviation: "RO",
    type: "Open Elective",
    credit: 3,
    faculty: [
      { name: "M. Sandeep", designation: "AP/Mech", role: "Primary", email: "sandeep.mech@school.com" }
    ],
    hours_allotted: 3,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Robotic kinematics trajectories, actuator selections, controller configurations, and sensor integrations for automated industrial loops.",
    prerequisites: "Matrix Algebra",
    outcomes: [
      "Solve Inverse Kinematic vectors.",
      "Program motion paths.",
      "Select gripper payloads."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Robotics classifications, coordinates, translations" },
      { week: "Week 4-6", topic: "Manipulators kinematics trajectory calculations" },
      { week: "Week 7-9", topic: "Sensors, encoders, motor controllers" },
      { week: "Week 10-12", topic: "Path planners, feedback control loops" }
    ],
    timetable: [
      { day: "Monday", periods: "Period 4 (12:15 - 01:15 PM)" },
      { day: "Thursday", periods: "Period 2 (10:00 - 11:00 AM)" }
    ]
  },
  {
    sno: 7,
    code: "B23MCT505",
    title: "Holistic Insights into UN SDG's",
    abbreviation: "SDG",
    type: "NC",
    credit: "NC",
    faculty: [
      { name: "Dr.V.Geethalakshmi", designation: "AP/Chemistry", role: "Primary", email: "geethalakshmi.v@school.com" }
    ],
    hours_allotted: 2,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "United Nations Sustainable Development Goals parameters covering climate measures, resource protections, and green action frameworks.",
    prerequisites: "None",
    outcomes: [
      "Evaluate environmental footprints.",
      "Describe renewable solutions.",
      "Advise resource recycling schemes."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "UN SDG history, Goal targets 1 to 6 parameters" },
      { week: "Week 4-6", topic: "Climate actions, marine ecosystems, terrestrial protections" },
      { week: "Week 7-9", topic: "Clean energy methods, community sustainability setups" },
      { week: "Week 10-12", topic: "Global alliance frameworks, monitoring tools" }
    ],
    timetable: [
      { day: "Wednesday", periods: "Period 5 (01:45 - 02:45 PM)" }
    ]
  },
  {
    sno: 8,
    code: "B23ADP301",
    title: "Data Science Lab",
    abbreviation: "DS-LAB",
    type: "Lab",
    credit: 2,
    faculty: [
      { name: "Mr. P. Tamilarasu", designation: "AP/CSBS", role: "Primary", email: "tamilarasu.p@school.com" },
      { name: "Ms. Kavithra I", designation: "AP/CSBS", role: "Support", email: "kavithra.i@school.com" }
    ],
    hours_allotted: 4,
    department: "CSBS",
    year: 2,
    semester: 3,
    section: "A",
    description: "Practical scripting exercises using Pandas, data manipulation libraries, data cleansing operations, and statistics tools.",
    prerequisites: "Python Coding Lab",
    outcomes: [
      "Manipulate large datasets.",
      "Clean incomplete records.",
      "Plot statistical regressions."
    ],
    syllabus: [
      { week: "Lab 1-3", topic: "Pandas dataframe manipulations, columns formatting" },
      { week: "Lab 4-6", topic: "Cleansing missing rows, handling invalid inputs" },
      { week: "Lab 7-9", topic: "Distribution plots, descriptive summary metrics coding" },
      { week: "Lab 10-12", topic: "Regression plotting experiments, project checkoffs" }
    ],
    timetable: [
      { day: "Friday", periods: "Period 5-8 (01:45 - 04:30 PM)" }
    ]
  },
  {
    sno: 9,
    code: "B23CBP501",
    title: "Full Stack Development Lab",
    abbreviation: "FSD-LAB",
    type: "Lab",
    credit: 2,
    faculty: [
      { name: "Mr. V. Surya", designation: "AP/CSBS", role: "Primary", email: "surya.v@school.com" },
      { name: "Ms. M.Dhivya", designation: "AP/CSBS", role: "Support", email: "dhivya.m@school.com" }
    ],
    hours_allotted: 4,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Practical development of frontend components, Express server APIs, MongoDB schemas, and end-to-end routing setups.",
    prerequisites: "Web Programming Basics Lab",
    outcomes: [
      "Write Express API routers.",
      "Code Mongo DB models.",
      "Integrate frontend client pages."
    ],
    syllabus: [
      { week: "Lab 1-3", topic: "Express router coding, REST endpoints validation" },
      { week: "Lab 4-6", topic: "MongoDB connectivity, schema mapping, CRUD scripts" },
      { week: "Lab 7-9", topic: "Frontend client hooks integration, fetch requests" },
      { week: "Lab 10-12", topic: "User authentication loops coding, deployment checks" }
    ],
    timetable: [
      { day: "Wednesday", periods: "Period 5-8 (01:45 - 04:30 PM)" }
    ]
  },
  {
    sno: 10,
    code: "B23MCT501",
    title: "Environmental Sustainability",
    abbreviation: "EVS",
    type: "NC",
    credit: "NC",
    faculty: [
      { name: "Dr. Geetha", designation: "AP/Chemistry", role: "Primary", email: "geetha.chem@school.com" }
    ],
    hours_allotted: 2,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Environmental parameters, greenhouse footprints, waste recycle schemes, renewable energy setups, and local ecology systems.",
    prerequisites: "None",
    outcomes: [
      "Measure carbon footprints.",
      "Define green waste cycles.",
      "Describe local eco-threats."
    ],
    syllabus: [
      { week: "Week 1-3", topic: "Ecology fundamentals, biodiversity balances" },
      { week: "Week 4-6", topic: "Greenhouse effect, climate tracking parameters" },
      { week: "Week 7-9", topic: "Water preservation methods, waste recycle setups" },
      { week: "Week 10-12", topic: "Ecology laws, environmental action paths" }
    ],
    timetable: [
      { day: "Thursday", periods: "Period 5 (01:45 - 02:45 PM)" }
    ]
  },
  {
    sno: 11,
    code: "-",
    title: "Tutor Ward Meeting",
    abbreviation: "TWM",
    type: "NC",
    credit: "NC",
    faculty: [
      { name: "Ms. M. Dhivya", designation: "AP/CSBS", role: "Primary", email: "dhivya.m@school.com" },
      { name: "Mr. V. Surya", designation: "AP/CSBS", role: "Support", email: "surya.v@school.com" }
    ],
    hours_allotted: 1,
    department: "CSBS",
    year: 3,
    semester: 5,
    section: "A",
    description: "Weekly counseling networks, academic progress monitoring, feedback sessions, and student mentoring meetings.",
    prerequisites: "None",
    outcomes: [
      "Review weekly logs.",
      "Submit feedback reports.",
      "Discuss progress charts."
    ],
    syllabus: [
      { week: "Week 1-12", topic: "Weekly academic progress evaluation and feedback" }
    ],
    timetable: [
      { day: "Friday", periods: "Period 4 (12:15 - 01:15 PM)" }
    ]
  }
];

// --- Custom Inline Icon Placeholders ---
function CpuIcon(props: any) {
  return <Layers className={props.className} />;
}
function BusinessIcon(props: any) {
  return <GraduationCap className={props.className} />;
}
function CodeIcon(props: any) {
  return <BookOpen className={props.className} />;
}
function SignalIcon(props: any) {
  return <Clock className={props.className} />;
}
function SettingsIcon(props: any) {
  return <Clock className={props.className} />;
}

export default function StudentCoursesWorkspace() {
  const [selectedDept, setSelectedDept] = useState<DepartmentContext | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number>(5);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedCourse, setSelectedCourse] = useState<CourseAllocation | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(["B23ADT501"]); // Simulated default enrolled course

  // Handle Enrollment simulation
  const handleEnroll = (code: string) => {
    if (enrolledCourses.includes(code)) return;
    setEnrolledCourses((prev) => [...prev, code]);
  };

  const handleDrop = (code: string) => {
    setEnrolledCourses((prev) => prev.filter((c) => c !== code));
  };

  // Filter Courses based on department, semester, query, and type tag
  const getFilteredCourses = () => {
    let list = COURSES;
    
    // Filter by selected department context
    if (selectedDept) {
      list = list.filter((c) => c.department === selectedDept.name);
    }
    
    // Filter by selected semester tab
    list = list.filter((c) => c.semester === selectedSemester);

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.abbreviation.toLowerCase().includes(q)
      );
    }

    // Filter by Course Type Chip
    if (filterType !== "All") {
      list = list.filter((c) => c.type === filterType);
    }

    return list;
  };

  const filteredCourses = getFilteredCourses();

  // Reset to Department view
  const handleBackToDepts = () => {
    setSelectedDept(null);
    setSelectedCourse(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* breadcrumb */}
      <nav className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5 print:hidden">
        <span className="hover:text-[#2563EB] cursor-pointer" onClick={handleBackToDepts}>Home</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        {selectedDept ? (
          <>
            <span className="hover:text-[#2563EB] cursor-pointer" onClick={() => setSelectedCourse(null)}>
              {selectedDept.name} Department
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>Year {selectedSemester <= 2 ? "I" : selectedSemester <= 4 ? "II" : selectedSemester <= 6 ? "III" : "IV"}</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span>Semester {selectedSemester}</span>
            {selectedCourse && (
              <>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <span className="text-slate-800 font-extrabold">{selectedCourse.code}</span>
              </>
            )}
          </>
        ) : (
          <span>Departments</span>
        )}
      </nav>

      {/* --- FLOW STEP 1: DEPARTMENT SELECTION --- */}
      {!selectedDept && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explore Departments & Course Catalogs</h1>
            <p className="text-slate-500 text-xs mt-1 font-semibold">Select your allocated department to view dynamic course allocations, curriculums, and class timelines.</p>
          </div>

          {/* Department Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              return (
                <div
                  key={dept.name}
                  onClick={() => setSelectedDept(dept)}
                  className="bg-white border border-slate-200 hover:border-[#2563EB] rounded-2xl p-6 shadow-xs hover:shadow-md hover:bg-slate-50/30 transition-all cursor-pointer group flex flex-col justify-between h-48"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center border border-blue-100/50 shrink-0">
                      <Icon className="h-5 w-5 text-[#2563EB]" />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                      {dept.name}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#2563EB] transition-colors leading-tight">
                      {dept.fullName}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">Programme: {dept.programme}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-3 w-3 text-slate-400" />
                      <span>{dept.coursesCount} Allocated Courses</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-slate-400" />
                      <span>{dept.studentsCount} Students</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- FLOW STEP 2: DEPARTMENT WORKSPACE VIEW --- */}
      {selectedDept && !selectedCourse && (
        <div className="space-y-6">
          
          {/* STEP 2: PROGRAMME/CLASS CONTEXT HEADER */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB]" />
            
            <div className="space-y-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Class Allocation Context</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <h2 className="text-lg font-black text-slate-950">{selectedDept.programme}</h2>
                <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-[#2563EB] text-[8px] font-black uppercase tracking-wider rounded">
                  AY: {selectedDept.academic_year}
                </span>
                <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 text-[8px] font-black uppercase tracking-wider rounded">
                  Advisor: {selectedDept.class_advisor}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                Class/Section: <strong className="text-slate-700">{selectedDept.name} / B</strong> • Mentors: {selectedDept.mentors.join(", ")}
              </p>
            </div>

            <button
              onClick={handleBackToDepts}
              className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:text-[#2563EB] bg-slate-100 hover:bg-blue-50 px-4 py-2.5 rounded-xl border border-slate-200/50 transition-all shrink-0 self-start md:self-center cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Change Department</span>
            </button>
          </div>

          {/* STEP 3: SEMESTER TAB SELECTOR */}
          <div className="border-b border-slate-200 print:hidden">
            <div className="flex overflow-x-auto space-x-8 text-xs font-black uppercase tracking-wider">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`pb-4 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    selectedSemester === sem
                      ? "border-[#2563EB] text-[#2563EB]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  Semester {sem === 1 ? "I" : sem === 2 ? "II" : sem === 3 ? "III" : sem === 4 ? "IV" : sem === 5 ? "V" : sem === 6 ? "VI" : sem === 7 ? "VII" : "VIII"}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH, FILTER CHIPS, VIEW SWAP CONTROLS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search allocated courses by code or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2563EB] transition-all shadow-xs"
              />
            </div>

            {/* Filter chips & View togglers */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex space-x-1.5">
                {["All", "Core", "Professional Elective", "Open Elective", "Lab", "NC"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      filterType === type
                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                        : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* View Switcher toggle */}
              <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-xs shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 transition-all cursor-pointer ${
                    viewMode === "grid" ? "bg-[#2563EB] text-white" : "bg-white text-slate-400 hover:text-slate-600"
                  }`}
                  title="Card Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2.5 transition-all cursor-pointer ${
                    viewMode === "table" ? "bg-[#2563EB] text-white" : "bg-white text-slate-400 hover:text-slate-600"
                  }`}
                  title="Table view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* COURSE VIEWS */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
              <FolderOpen className="h-10 w-10 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-800 font-extrabold text-sm">No Courses Allocated</p>
              <p className="text-slate-400 text-xs mt-1">There are no courses matching your query allocated to Semester {selectedSemester}.</p>
            </div>
          ) : viewMode === "grid" ? (
            
            // --- STEP 4: COURSE CARD GRID VIEW ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledCourses.includes(course.code);
                const isElective = course.type.includes("Elective");
                
                // Color mapping for course type badge
                const typeColors =
                  course.type === "Core"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : course.type.includes("Elective")
                    ? "bg-purple-50 text-purple-700 border-purple-100"
                    : course.type === "Lab"
                    ? "bg-teal-50 text-teal-700 border-teal-100"
                    : "bg-slate-100 text-slate-700 border-slate-200";

                return (
                  <div
                    key={course.code}
                    className="bg-white border border-slate-200 hover:border-[#2563EB] rounded-2xl p-6 shadow-xs hover:shadow-md hover:bg-slate-50/10 transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    {/* Elective Ribbon overlay */}
                    {isElective && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded-bl-lg">
                        Elective Choice
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[8px] font-black uppercase tracking-wider">
                          {course.code}
                        </span>
                        <span className={`px-2 py-0.5 border rounded text-[8px] font-black uppercase tracking-wider ${typeColors}`}>
                          {course.type}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className={`text-sm text-slate-900 leading-snug ${isElective ? "font-black" : "font-extrabold"}`}>
                          {course.title} ({course.abbreviation})
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold line-clamp-2 mt-1.5">
                          {course.description}
                        </p>
                      </div>

                      {/* Metadata Details */}
                      <div className="space-y-2 pt-2 border-t border-slate-100 text-[10px] text-slate-700 font-semibold">
                        <div className="flex items-center space-x-2">
                          <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>Fac: {course.faculty.map((f) => f.name).join(" & ")}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Award className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>Credits: {course.credit === "NC" ? "NC" : `${course.credit} Credits`}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock3 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{course.hours_allotted} Hours Allotted per week</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 gap-3">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="flex-grow bg-white hover:bg-slate-50 text-[#2563EB] hover:text-[#1D4ED8] font-black text-[9px] uppercase tracking-wider py-2.5 px-3 border border-[#2563EB]/25 hover:border-[#2563EB] rounded-xl transition-all cursor-pointer text-center"
                      >
                        View Details
                      </button>

                      {isEnrolled ? (
                        <button
                          disabled
                          className="flex-grow bg-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-wider py-2.5 px-3 border border-slate-200 rounded-xl text-center cursor-not-allowed"
                        >
                          Enrolled ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course.code)}
                          className="flex-grow bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-[9px] uppercase tracking-wider py-2.5 px-3 rounded-xl transition-all cursor-pointer text-center shadow-md shadow-blue-500/10"
                        >
                          Enroll
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            
            // --- STEP 5: TABLE VIEW ---
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-[9px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4 text-center w-12">S.No</th>
                      <th className="py-3.5 px-4 w-28">Course Code</th>
                      <th className="py-3.5 px-4">Course Title</th>
                      <th className="py-3.5 px-4 w-24">Type</th>
                      <th className="py-3.5 px-4 w-20">Credits</th>
                      <th className="py-3.5 px-4">Faculty In-Charge</th>
                      <th className="py-3.5 px-4 w-28 text-center">Hours Allotted</th>
                      <th className="py-3.5 px-4 w-24 text-center print:hidden">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-800">
                    {filteredCourses.map((course) => {
                      const isEnrolled = enrolledCourses.includes(course.code);
                      const isElective = course.type.includes("Elective");
                      
                      const typeColors =
                        course.type === "Core"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : course.type.includes("Elective")
                          ? "bg-purple-50 text-purple-700 border border-purple-100"
                          : course.type === "Lab"
                          ? "bg-teal-50 text-teal-700 border border-teal-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200";

                      return (
                        <tr
                          key={course.code}
                          className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                        >
                          <td className="py-3.5 px-4 text-center text-slate-400">{course.sno}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] text-[8px] font-black uppercase tracking-wider rounded border border-blue-100/50">
                              {course.code}
                            </span>
                          </td>
                          <td 
                            onClick={() => setSelectedCourse(course)}
                            className="py-3.5 px-4 group-hover:text-[#2563EB] transition-colors"
                          >
                            <span className={isElective ? "font-black" : "font-extrabold"}>
                              {course.title} ({course.abbreviation})
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${typeColors}`}>
                              {course.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {course.credit === "NC" ? (
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-black uppercase border border-slate-200">NC</span>
                            ) : (
                              `${course.credit}`
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              {course.faculty.map((f, i) => (
                                <p key={i} className="text-slate-800 font-semibold">
                                  {f.name} {f.role === "Support" && <span className="text-[9px] text-slate-400">(S)</span>}
                                </p>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center text-slate-700">{course.hours_allotted} Hrs</td>
                          <td className="py-3.5 px-4 text-center print:hidden" onClick={(e) => e.stopPropagation()}>
                            {isEnrolled ? (
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Enrolled ✓</span>
                            ) : (
                              <button
                                onClick={() => handleEnroll(course.code)}
                                className="text-[9px] font-black uppercase tracking-wider text-[#2563EB] hover:underline cursor-pointer"
                              >
                                Enroll
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- FLOW STEP 5 & 6: COURSE DETAIL PAGE --- */}
      {selectedCourse && (
        <div className="space-y-6">
          
          {/* Header Panel */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2563EB]" />

            <div className="space-y-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center space-x-1.5 text-[9px] font-black text-slate-500 hover:text-[#2563EB] uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Semester list</span>
              </button>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2 py-0.5 bg-blue-50 text-[#2563EB] text-[9px] font-black uppercase tracking-wider border border-blue-150 rounded">
                  {selectedCourse.code}
                </span>
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-black uppercase tracking-wider border border-purple-150 rounded">
                  {selectedCourse.type}
                </span>
                <span className="text-slate-500 text-xs font-bold">
                  Credits: {selectedCourse.credit}
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-900 leading-tight">
                {selectedCourse.title} ({selectedCourse.abbreviation})
              </h2>
            </div>

            {/* Enroll / Drop CTA */}
            <div className="shrink-0 pt-4 md:pt-0">
              {enrolledCourses.includes(selectedCourse.code) ? (
                <button
                  onClick={() => handleDrop(selectedCourse.code)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-black text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl border border-red-200 transition-all cursor-pointer shadow-xs"
                >
                  Drop Course
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(selectedCourse.code)}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black text-[10px] uppercase tracking-wider py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  Enroll Course
                </button>
              )}
            </div>
          </div>

          {/* Details Content Tabs */}
          <CourseDetailsTabPanel course={selectedCourse} />
        </div>
      )}
    </div>
  );
}

// --- Detail Tabs Panel Sub-component ---
function CourseDetailsTabPanel({ course }: { course: CourseAllocation }) {
  const [activeTab, setActiveTab] = useState<"Overview" | "Syllabus" | "Faculty" | "Timetable" | "Materials">("Overview");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      
      {/* Tabs list sidebar */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
        {(["Overview", "Syllabus", "Faculty", "Timetable", "Materials"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab
                ? "bg-blue-50 text-[#2563EB] border border-blue-100/50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content card */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs min-h-96">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                Course Outline
              </h3>
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">{course.description}</p>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                Academic Prerequisites
              </h3>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-2 text-xs font-semibold text-slate-700">
                <Info className="h-4 w-4 text-[#2563EB] shrink-0" />
                <span>{course.prerequisites}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3">
                Learning Outcomes
              </h3>
              <ul className="space-y-2 text-xs font-semibold text-slate-650 list-disc pl-5">
                {course.outcomes.map((outcome, idx) => (
                  <li key={idx} className="leading-relaxed">{outcome}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: SYLLABUS */}
        {activeTab === "Syllabus" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              Week-by-Week Syllabus Outline
            </h3>
            
            <div className="space-y-3 relative pl-3 border-l border-slate-200 ml-1">
              {course.syllabus.map((syl, idx) => (
                <div key={idx} className="relative text-xs leading-relaxed pl-2.5 pb-2">
                  <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-[#2563EB] border-2 border-white" />
                  <span className="font-extrabold text-[#2563EB] block">{syl.week}</span>
                  <span className="text-slate-800 font-semibold block mt-0.5">{syl.topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY */}
        {activeTab === "Faculty" && (
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              Allocated Faculty Instructors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.faculty.map((fac, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-4">
                  <div className="h-10 w-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-slate-400 font-black text-sm shrink-0">
                    {fac.name.charAt(0)}
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="font-black text-slate-900">{fac.name}</p>
                    <p className="text-[10px] text-[#2563EB] font-black uppercase tracking-wider">{fac.designation} • {fac.role} Faculty</p>
                    <p className="text-slate-500 font-semibold">Email: {fac.email}</p>
                    {fac.officeHours && <p className="text-slate-500 font-semibold">Hours: {fac.officeHours}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TIMETABLE */}
        {activeTab === "Timetable" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              Allotted Timetable Slots
            </h3>

            <div className="space-y-3">
              {course.timetable.map((slot, idx) => (
                <div key={idx} className="p-3 bg-[#FCEEF0]/40 border border-[#6E1E27]/10 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-4 w-4 text-[#6E1E27] shrink-0" />
                    <div>
                      <span className="font-extrabold text-[#6E1E27] block">{slot.day}</span>
                      <span className="text-slate-500 text-[10px] font-semibold block mt-0.5">Assigned Class Lecture Slot</span>
                    </div>
                  </div>
                  
                  <span className="px-3 py-1 bg-white border border-[#6E1E27]/10 text-slate-700 font-black uppercase tracking-wider rounded-lg text-[9px]">
                    {slot.periods}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MATERIALS */}
        {activeTab === "Materials" && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
              Downloadable Course Resources
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4.5 w-4.5 text-blue-500" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Course Syllabus & Reference.pdf</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">PDF DOCUMENT • 1.4 MB</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => alert("Simulation download: Syllabus files downloaded.")}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[#2563EB] cursor-pointer transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4.5 w-4.5 text-purple-500" />
                  <div>
                    <span className="font-extrabold text-slate-800 block">Lecture Slides: Module 1.zip</span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">COMPRESSED ZIP • 14.8 MB</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => alert("Simulation download: Lecture slides downloaded.")}
                  className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[#2563EB] cursor-pointer transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
