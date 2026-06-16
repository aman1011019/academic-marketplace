export type Category = {
  slug: string;
  name: string;
  icon: string;
  description: string;
  count: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  includedFiles: string[];
  price: number;
  oldPrice?: number;
  thumbnail: string;
  images: string[];
  downloads: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  popularity: number;
};

export type Review = {
  id: string;
  projectId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
};

export const categories: Category[] = [
  { slug: "cse-it", name: "CSE / IT", icon: "Cpu", description: "Computer Science & IT capstone projects", count: 142 },
  { slug: "ai-ml", name: "AI & Machine Learning", icon: "Brain", description: "Cutting-edge AI and ML projects", count: 98 },
  { slug: "cyber-security", name: "Cyber Security", icon: "ShieldCheck", description: "Pen-testing, crypto and security tools", count: 64 },
  { slug: "cloud-computing", name: "Cloud Computing", icon: "Cloud", description: "AWS, Azure and GCP based solutions", count: 51 },
  { slug: "iot", name: "IoT", icon: "Radio", description: "Hardware + software IoT systems", count: 47 },
  { slug: "mba", name: "MBA", icon: "Briefcase", description: "Business strategy & management research", count: 73 },
  { slug: "bba", name: "BBA", icon: "BarChart3", description: "Bachelor of Business Administration", count: 58 },
  { slug: "bcom", name: "B.Com", icon: "Calculator", description: "Commerce undergraduate projects", count: 44 },
  { slug: "mcom", name: "M.Com", icon: "LineChart", description: "Commerce postgraduate research", count: 36 },
  { slug: "commerce-finance", name: "Commerce & Finance", icon: "Banknote", description: "Finance, audit and accounting", count: 52 },
  { slug: "arts-humanities", name: "Arts & Humanities", icon: "Palette", description: "Liberal arts research projects", count: 39 },
  { slug: "psychology", name: "Psychology", icon: "HeartPulse", description: "Behavioural & clinical psychology", count: 28 },
  { slug: "history", name: "History", icon: "ScrollText", description: "Historical research and analysis", count: 22 },
  { slug: "political-science", name: "Political Science", icon: "Landmark", description: "Polity, governance and IR", count: 26 },
];

const techPool = ["React", "Node.js", "Python", "TensorFlow", "MongoDB", "AWS", "Docker", "FastAPI", "Next.js", "PostgreSQL", "Flask", "Arduino", "Raspberry Pi", "Tableau", "Excel", "SPSS", "Power BI"];
const filesPool = ["Source Code (ZIP)", "Project Report (PDF)", "Presentation (PPT)", "Documentation", "Viva Questions", "Abstract", "Setup Guide"];

const projectTitles: Record<string, string[]> = {
  "cse-it": ["E-Learning Platform with Live Classes", "Hospital Management System", "Smart Attendance System", "Online Code Editor", "Real-time Chat App", "Inventory Management System"],
  "ai-ml": ["Plant Disease Detection using CNN", "Stock Price Predictor with LSTM", "Resume Screening with NLP", "Sign Language Recognition", "Movie Recommendation Engine", "Fake News Classifier"],
  "cyber-security": ["Network Intrusion Detection System", "Phishing URL Detector", "Encrypted File Vault", "Vulnerability Scanner", "Password Strength Analyzer", "Steganography Tool"],
  "cloud-computing": ["Serverless E-commerce on AWS", "Multi-cloud Cost Optimizer", "Kubernetes Auto-scaler", "Cloud Backup Service", "CDN Performance Monitor", "Disaster Recovery System"],
  "iot": ["Smart Home Automation", "Weather Monitoring Station", "Smart Agriculture System", "Health Monitoring Wearable", "Smart Parking System", "Air Quality Tracker"],
  "mba": ["Brand Equity Analysis of FMCG", "Employee Retention Strategies", "Digital Marketing ROI Study", "Supply Chain Optimization", "Mergers & Acquisitions Case", "Consumer Behavior Research"],
  "bba": ["Startup Business Plan", "Retail Customer Loyalty Study", "HR Recruitment Process Analysis", "Working Capital Management", "Social Media Marketing Impact", "Service Quality in Banking"],
  "bcom": ["GST Implementation Study", "Mutual Fund Performance Analysis", "Working Capital of MSMEs", "Online Banking Adoption", "Cashless Economy Impact", "Income Tax Planning"],
  "mcom": ["Behavioural Finance Research", "Corporate Governance Study", "Capital Structure Analysis", "FDI Impact on Economy", "Microfinance Effectiveness", "IFRS Adoption Study"],
  "commerce-finance": ["Personal Finance Management App", "Financial Ratio Analysis Tool", "Stock Market Sentiment Dashboard", "Audit Risk Assessment", "Cryptocurrency Investment Study", "Insurance Sector Analysis"],
  "arts-humanities": ["Cultural Heritage Documentation", "Folk Art Revival Study", "Linguistic Diversity Research", "Theatre & Society Analysis", "Film Studies: New Wave", "Comparative Literature Review"],
  "psychology": ["Stress Among College Students", "Social Media & Self-esteem", "Cognitive Behavioural Therapy Study", "Personality Type & Career Choice", "Mindfulness Effectiveness Study", "Adolescent Mental Health"],
  "history": ["Indian Freedom Movement Analysis", "Mughal Architecture Study", "World War II Economic Impact", "Indus Valley Civilization", "Cold War Diplomacy", "Renaissance & Modern Europe"],
  "political-science": ["Indian Federalism Study", "Election Reforms in India", "UN Peacekeeping Effectiveness", "Local Self-Government Analysis", "Foreign Policy of India", "Human Rights & Democracy"],
};

const seedImg = (id: string, w = 800, h = 500) => `https://picsum.photos/seed/${id}/${w}/${h}`;

export const projects: Project[] = categories.flatMap((cat) =>
  (projectTitles[cat.slug] || []).map((title, i) => {
    const id = `${cat.slug}-${i + 1}`;
    const price = [299, 499, 699, 899, 1199, 1499][i % 6];
    return {
      id,
      title,
      slug: id,
      category: cat.slug,
      description: `Complete ${cat.name} project: ${title}. Includes source code, full report, presentation and documentation.`,
      longDescription: `A production-ready academic project on "${title}". Built with industry standards, fully documented, and ready to submit. Includes complete source code, detailed report (60+ pages), professional PPT, abstract, viva questions, and setup guide. Perfect for final-year submissions.`,
      features: [
        "100% original and plagiarism-free",
        "Detailed project report (60+ pages)",
        "Professional presentation slides",
        "Full source code with comments",
        "Viva questions & expected answers",
        "Step-by-step setup guide",
        "Free email support for 30 days",
      ],
      technologies: techPool.slice(i % 8, (i % 8) + 4 + (i % 3)),
      includedFiles: filesPool,
      price,
      oldPrice: price + 400,
      thumbnail: seedImg(id),
      images: [seedImg(id + "-1"), seedImg(id + "-2"), seedImg(id + "-3"), seedImg(id + "-4")],
      downloads: 50 + ((i * 37 + cat.count) % 800),
      rating: 4.2 + ((i % 8) / 10),
      reviewsCount: 8 + ((i * 11) % 60),
      createdAt: new Date(Date.now() - (i + 1) * 86400000 * 7).toISOString(),
      popularity: 100 - i * 3,
    };
  }),
);

export const reviews: Review[] = projects.flatMap((p) =>
  Array.from({ length: 3 }).map((_, i) => ({
    id: `${p.id}-r${i}`,
    projectId: p.id,
    user: ["Ananya S.", "Rahul K.", "Priya M.", "Arjun V.", "Sneha R."][i % 5],
    rating: 4 + (i % 2),
    comment: [
      "Excellent project, well-documented and easy to understand. Helped me get an A grade!",
      "Very thorough work. The PPT and report saved me weeks of effort.",
      "Code runs out of the box. Support team was responsive too.",
    ][i % 3],
    date: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  })),
);

export const testimonials = [
  { name: "Aditi Sharma", role: "B.Tech CSE, Final Year", quote: "Got my project, report, and PPT in one click. Saved me a whole month before submission!", avatar: seedImg("u1", 100, 100) },
  { name: "Rohan Mehta", role: "MBA, Marketing", quote: "The depth of the case study was impressive. My professor was genuinely impressed.", avatar: seedImg("u2", 100, 100) },
  { name: "Sneha Iyer", role: "M.Com Student", quote: "Affordable and high quality. Will recommend to all my juniors.", avatar: seedImg("u3", 100, 100) },
  { name: "Karan Patel", role: "BBA, 3rd Year", quote: "Loved the variety of categories. Found exactly what I needed.", avatar: seedImg("u4", 100, 100) },
];

export const faqs = [
  { q: "How do I receive my project after purchase?", a: "Instantly. After successful payment, all files are available in your Download Center under your dashboard." },
  { q: "Are these projects plagiarism-free?", a: "Yes. Every project is original, custom-built, and comes with a plagiarism report on request." },
  { q: "What's included in a typical project?", a: "Source code (ZIP), detailed report (PDF), presentation (PPT), abstract, viva questions, and a setup guide." },
  { q: "Do you offer customisation?", a: "Yes. Reach out via the Contact page with your requirements and we'll send a custom quote." },
  { q: "What's your refund policy?", a: "Because downloads are instant, we offer refunds only if the files are corrupted or fundamentally broken." },
  { q: "Do you provide support after purchase?", a: "Yes. 30 days of free email support is included with every project." },
];

export const getProject = (id: string) => projects.find((p) => p.id === id || p.slug === id);
export const getProjectsByCategory = (slug: string) => projects.filter((p) => p.category === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getReviews = (projectId: string) => reviews.filter((r) => r.projectId === projectId);

// Mock admin data
export const COLLEGES = [
  "ABC Engineering College",
  "XYZ Institute of Technology",
  "PQR University",
  "St. Xavier's College",
  "Delhi Tech University",
  "Bangalore Institute of Management",
  "Pune Institute of Computer Tech",
  "VIT Vellore",
];

const studentNames = [
  "Ananya Sharma", "Rahul Kapoor", "Priya Mehta", "Arjun Verma", "Sneha Reddy",
  "Vikram Singh", "Ishita Joshi", "Karan Patel", "Meera Nair", "Rohan Das",
];

const mob = (i: number) => String(9000000000 + ((i * 7919 + 421) % 999999999)).slice(0, 10);

export const mockOrders = projects.slice(0, 36).map((p, i) => ({
  id: `ORD${10000 + i}`,
  projectId: p.id,
  projectTitle: p.title,
  user: studentNames[i % studentNames.length],
  email: `student${i + 1}@university.edu`,
  mobile: mob(i),
  college: COLLEGES[i % COLLEGES.length],
  amount: p.price,
  status: ["completed", "completed", "completed", "pending", "completed", "failed"][i % 6] as "completed" | "pending" | "failed",
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const mockUsers = Array.from({ length: 24 }).map((_, i) => ({
  id: `USR${1000 + i}`,
  name: studentNames[i % studentNames.length] + ` ${i + 1}`,
  email: `user${i + 1}@example.com`,
  mobile: mob(i + 11),
  college: COLLEGES[i % COLLEGES.length],
  role: i === 0 ? "admin" : "user",
  joined: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  purchases: (i * 3) % 8,
  status: i % 9 === 0 ? "blocked" : "active",
}));

export const revenueByMonth = [
  { month: "Jan", revenue: 42000, orders: 58 },
  { month: "Feb", revenue: 51000, orders: 71 },
  { month: "Mar", revenue: 48000, orders: 64 },
  { month: "Apr", revenue: 67000, orders: 88 },
  { month: "May", revenue: 72000, orders: 95 },
  { month: "Jun", revenue: 81000, orders: 108 },
  { month: "Jul", revenue: 76000, orders: 99 },
  { month: "Aug", revenue: 88000, orders: 117 },
  { month: "Sep", revenue: 94000, orders: 124 },
  { month: "Oct", revenue: 102000, orders: 138 },
  { month: "Nov", revenue: 115000, orders: 152 },
  { month: "Dec", revenue: 128000, orders: 169 },
];

export const downloadsByCategory = categories.slice(0, 8).map((c) => ({
  name: c.name,
  downloads: 200 + Math.floor(Math.random() * 800),
}));

export function getProjectBuyers(projectId: string) {
  return mockOrders.filter((o) => o.projectId === projectId);
}

export function getTopColleges(limit = 6) {
  const counts = new Map<string, number>();
  for (const o of mockOrders) {
    if (o.status !== "completed") continue;
    counts.set(o.college, (counts.get(o.college) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([college, purchases]) => ({ college, purchases }))
    .sort((a, b) => b.purchases - a.purchases)
    .slice(0, limit);
}
