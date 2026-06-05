// Mock AI service layer. Swap fetch URL/axios in each fn for real backend.
// All functions return Promises and simulate latency, so UI loading states work.

const delay = (ms = 900) => new Promise((r) => setTimeout(r, ms + Math.random() * 600));

export type ChatRole = "user" | "assistant" | "system";
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
  attachments?: { name: string; type: string; size: number }[];
}

const canned = [
  "Great question! Based on your academic context, here's what I'd suggest:\n\n1. **Define the scope clearly** — narrow problem statements lead to stronger projects.\n2. **Pick a stack you can defend** in your viva — familiarity beats novelty.\n3. **Document as you build** — your report will thank you.",
  "Here's a quick breakdown:\n\n- **Frontend**: React + Tailwind\n- **Backend**: Node.js + Express\n- **Database**: MongoDB\n- **Deployment**: Vercel / Render\n\nWant me to expand any section?",
  "That topic has solid scope for a final-year project. Consider combining it with **machine learning** for stronger outcomes, and use a public dataset from Kaggle to validate results.",
  "```js\n// Example snippet\nfunction summarize(text) {\n  return text.split('.').slice(0, 3).join('.') + '.';\n}\n```\n\nThis is a minimal extractive summarizer — replace with a transformer for production.",
];

export async function chatComplete(messages: ChatMessage[]): Promise<string> {
  await delay(800);
  const last = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
  if (last.includes("hi") || last.includes("hello")) return "Hey there! 👋 I'm your AI Assistant. Ask me anything about your projects, research, or career.";
  if (last.includes("price") || last.includes("cost")) return "Most projects on ProjectHub range from ₹499 to ₹2,999. You can filter by price on the Categories page.";
  return canned[Math.floor(Math.random() * canned.length)];
}

export async function recommendProjects(input: { branch: string; semester: string; interests: string; level: string }) {
  await delay();
  return [
    { title: "AI-powered Resume Screener", tech: ["Python", "FastAPI", "spaCy", "React"], difficulty: "Intermediate", time: "4–6 weeks", outcomes: ["NLP fundamentals", "REST APIs", "Deployment"] },
    { title: "Smart Attendance via Face Recognition", tech: ["OpenCV", "Python", "Flask", "SQLite"], difficulty: "Beginner", time: "3–4 weeks", outcomes: ["Computer vision basics", "Edge deployment"] },
    { title: "Real-time Collaborative Whiteboard", tech: ["React", "Socket.IO", "Node.js", "MongoDB"], difficulty: "Advanced", time: "6–8 weeks", outcomes: ["WebSockets", "CRDTs", "Scalability"] },
    { title: `IoT Sensor Dashboard for ${input.branch || "ECE"}`, tech: ["Arduino", "MQTT", "React", "InfluxDB"], difficulty: input.level || "Intermediate", time: "5 weeks", outcomes: ["MQTT protocol", "Time-series DBs"] },
  ];
}

export async function explainProject(_payload: { title?: string; file?: string }) {
  await delay();
  return {
    overview: "This project is a full-stack web application that streamlines academic project sharing through a curated marketplace, with built-in payments and instant digital delivery.",
    architecture: "Three-tier architecture: React SPA on the client, a Node.js/Express API server, and PostgreSQL for persistence. Object storage on S3 holds the deliverables.",
    workflow: "Users browse → add to wishlist → checkout via Razorpay → backend issues a signed S3 download link → user downloads project bundle and accesses dashboard.",
    stack: ["React", "Tailwind", "Node.js", "Express", "PostgreSQL", "Razorpay", "AWS S3"],
    database: "Normalized schema with `users`, `projects`, `categories`, `orders`, `downloads`, `reviews`. Foreign keys ensure referential integrity.",
    api: "RESTful API: `/api/projects`, `/api/orders`, `/api/auth`, `/api/admin/*`. JWT-based auth with role claims.",
  };
}

export async function researchAssistant(topic: string) {
  await delay();
  return {
    ideas: [`Comparative analysis of ${topic} approaches`, `Survey of ${topic} in industry`, `Hybrid ${topic} model with deep learning`],
    literature: `Recent work in ${topic} has focused on three themes: scalability, interpretability, and ethical deployment. Key papers from 2022–2024 highlight transformer-based methods outperforming traditional baselines by 15–22%.`,
    gap: `Limited research exists on ${topic} in low-resource settings. Most studies assume high-quality labeled data, leaving practical deployment underexplored.`,
    methodology: "Mixed-methods: (1) literature review, (2) quantitative experiments on benchmark datasets, (3) qualitative case study with end-users.",
    references: [
      "Smith et al. (2023). A Survey of Modern Approaches. JAIR.",
      "Patel & Kumar (2024). Practical Deployment Considerations. ICML Workshop.",
      "Garcia (2022). Foundations Revisited. NeurIPS.",
    ],
  };
}

export async function analyzeDocument(_file: { name: string }) {
  await delay(1400);
  return {
    summary: "The document outlines a comprehensive study on academic project management, covering ideation, execution, and evaluation phases across 38 pages.",
    explanation: "The author argues that structured mentorship and milestone-based reviews significantly improve project outcomes, supported by data from 240 student projects.",
    mcqs: [
      { q: "Which phase has the highest dropout rate?", a: "Ideation" },
      { q: "What is the primary success metric used?", a: "Milestone completion rate" },
      { q: "How many projects were studied?", a: "240" },
    ],
    viva: ["What problem does this study address?", "Describe the methodology used.", "What are the main limitations?", "How could the findings be generalized?"],
    keywords: ["academic projects", "mentorship", "milestones", "evaluation", "outcome metrics"],
  };
}

export async function generatePPT(input: { title: string; abstract: string }) {
  await delay(1100);
  const t = input.title || "Project";
  return {
    outline: ["Introduction", "Problem Statement", "Objectives", "Literature Review", "Methodology", "Architecture", "Implementation", "Results", "Conclusion", "References"],
    slides: [
      { title: t, body: "Final Year Project Presentation\nPresented by: [Your Name]\nGuide: [Guide Name]", notes: "Open with a confident greeting; introduce yourself and the project title." },
      { title: "Problem Statement", body: input.abstract || "Describe the real-world problem clearly in 2–3 bullet points.", notes: "Emphasize WHY this problem matters; cite a quick statistic." },
      { title: "Objectives", body: "• Build a working prototype\n• Achieve measurable accuracy\n• Validate with users", notes: "Keep objectives SMART." },
      { title: "Methodology", body: "1. Data collection\n2. Model design\n3. Training & evaluation\n4. Deployment", notes: "Walk through each step in 30 seconds." },
      { title: "Results", body: "Accuracy: 92%\nLatency: <120ms\nUser satisfaction: 4.6/5", notes: "Highlight the strongest result first." },
      { title: "Conclusion", body: "Successfully demonstrated feasibility.\nFuture work: scale, mobile app, multi-language.", notes: "End with a confident call-to-action." },
    ],
  };
}

export async function generateViva(_topic: string) {
  await delay();
  return {
    technical: [
      { q: "Explain the architecture of your project.", a: "A 3-tier architecture: presentation (React), application (Express APIs), and data (PostgreSQL)." },
      { q: "Why did you choose this tech stack?", a: "It balances developer productivity, community support, and performance for our scale." },
    ],
    theory: [
      { q: "What is the time complexity of your core algorithm?", a: "O(n log n) for the sorting phase and O(n) for the linear scan that follows." },
      { q: "Explain ACID properties.", a: "Atomicity, Consistency, Isolation, Durability — the four guarantees a relational DB provides for transactions." },
    ],
    practical: [
      { q: "How did you handle authentication?", a: "JWT tokens with refresh-token rotation stored in httpOnly cookies." },
      { q: "How would you scale this to 1M users?", a: "Horizontal scaling behind a load balancer, Redis cache, read replicas, and a CDN for static assets." },
    ],
    hr: [
      { q: "Why did you choose this project?", a: "It combines my interest in [domain] with a real problem I observed during my internship." },
      { q: "What was the hardest challenge?", a: "Debugging a race condition in the websocket layer that only appeared under load." },
    ],
  };
}

export async function buildResume(input: { name: string; tech: string; description: string }) {
  await delay();
  const tech = input.tech || "React, Node.js, MongoDB";
  return {
    bullets: [
      `Built ${input.name || "a full-stack web application"} using ${tech}, serving 500+ users with <200ms median response time.`,
      `Designed REST APIs, JWT-based auth, and role-based access control; covered with 85%+ unit-test coverage.`,
      `Deployed on AWS with CI/CD via GitHub Actions; cut deploy time from 20 minutes to under 4.`,
    ],
    linkedin: `Excited to share ${input.name || "my latest project"}! 🚀\n\nI built a production-ready app using ${tech}. Key wins:\n• Real users, real feedback\n• End-to-end ownership\n• Shipped in 6 weeks\n\nWould love your thoughts — DMs open!`,
    portfolio: `${input.name || "Project"} — ${input.description || "A modern web application showcasing full-stack engineering across the entire delivery lifecycle: design, build, test, deploy, iterate."} Built with ${tech}.`,
  };
}

export async function careerAdvisor(input: { degree: string; branch: string; skills: string; interests: string }) {
  await delay();
  return {
    careers: ["Software Engineer", "ML Engineer", "Data Analyst", "Product Engineer", "DevRel Engineer"],
    certifications: ["AWS Certified Developer", "Google Cloud Associate", "Meta Frontend Developer", "TensorFlow Developer"],
    courses: ["CS50 (Harvard)", "Full Stack Open (Helsinki)", "Andrew Ng — ML Specialization", "System Design Primer"],
    roadmap: [
      { stage: "Now", items: [`Strengthen ${input.skills || "fundamentals"}`, "Ship 2 portfolio projects", "Open-source a small library"] },
      { stage: "3 months", items: ["Earn one certification", "Contribute to OSS", "Start technical blog"] },
      { stage: "6 months", items: ["Internship or freelance", "System design practice", "Mock interviews"] },
      { stage: "12 months", items: ["Apply to target companies", "Build a niche reputation", `Specialize in ${input.interests || "your strongest domain"}`] },
    ],
  };
}

import { projects } from "./mock-data";
export async function smartSearch(q: string) {
  await delay(500);
  const term = q.toLowerCase();
  return projects
    .map((p) => ({ p, score: (p.title + " " + p.description + " " + p.technologies.join(" ") + " " + p.category).toLowerCase().split(term).length - 1 }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .slice(0, 12);
}
