import { SITE_INFO } from "@/config/site"
import { USER } from "@/features/portfolio/data/user"
import { decodeEmail } from "@/utils/string"

export const dynamic = "force-static"
export const revalidate = false

function buildLlmsTxt(): string {
  const email = decodeEmail(USER.email)
  const baseUrl = SITE_INFO.url

  return `# Muhammad Al Fakhreza Dwi Putra

> Muhammad Al Fakhreza Dwi Putra is a Fullstack Developer and Informatics Engineering student at Universitas Nusa Putra (GPA 3.50/4.00) based in Indonesia. He specializes in modern web applications, machine learning systems, business process automation, ERP integrations, and predictive analytics.

## Core Projects & Systems
- [UANGKU](${baseUrl}/projects/uangku): UI/UX design concept for a digital finance application covering top up, payments, and daily transactions (Figma, design system, prototyping).
- [MaxGym Performance](${baseUrl}/projects/maxgym): Company profile website for a fitness performance brand (PHP, Tailwind CSS, JavaScript).
- [TimeLeak AI](${baseUrl}/projects/timeleak): Time-to-money awareness tool that helps users see the monetary value of their time (Next.js, TypeScript, Tailwind CSS). Google #JuaraVibeCoding.
- [BidikKerja](${baseUrl}/projects/BidikKerja): Job search and career platform connecting candidates with opportunities (Vue.js, Node.js, Python). In progress.
- [PT Silga Perkasa](${baseUrl}/projects/silga): Company profile website for PT Silga Perkasa (Next.js, Laravel, Tailwind CSS). In progress.

## Professional Experience & Career Roles
- [PT Silga Perkasa](${baseUrl}/#experience): IT Support (02.2026 – 07.2026) — hardware, software, and network troubleshooting; technical support for users.
- [Himpunan Mahasiswa Teknik Informatika](${baseUrl}/#experience): Media, Konten, dan Publikasi — organizational information distribution and visual branding.
- [Himpunan Mahasiswa Teknik Informatika](${baseUrl}/#experience): Ketua Pelaksana — COMTECH 2025 — led an innovative system development competition.
- [Himpunan Mahasiswa Teknik Informatika](${baseUrl}/#experience): Sub Divisi Visual dan Desain (2024 – 2025).
- [UKM Nusapala](${baseUrl}/#experience): Anggota Divisi Infokom (2024 – 2025) — social media feed and story design.
- [UKM Khusus Jurnalis Nuansa](${baseUrl}/#experience): Anggota Divisi Mindset — Kameramen (2024 – 2025).
- [MABIM NusaPutra](${baseUrl}/#experience): Divisi Mentor (08.2024 – 09.2024) — guided new students through campus orientation at Universitas Nusa Putra.
- [LDKM 2024](${baseUrl}/#experience): Divisi Mentor (03.2025 – 07.2025) — leadership and teamwork training.

## Core Technical Stack
- **AI / ML**: Python, TensorFlow, PyTorch, Scikit-Learn, OpenCV, Pandas, NumPy, Claude, ChatGPT, Gemini, DeepSeek.
- **Frontend**: JavaScript, TypeScript, Laravel, React, Next.js, Tailwind CSS, Vue.js.
- **Backend**: Node.js, PHP, SQL, PostgreSQL.
- **Tools**: Docker, Git, GitHub, Figma, Visual Studio Code.

## Site Navigation & Resources
- [Home](${baseUrl}/): Main portfolio, profile summary, experiences, and technical overview.
- [All Projects](${baseUrl}/projects): Comprehensive archive of design, AI/ML, and web engineering projects.
- [Technical Blog](${baseUrl}/blog): Technical articles and notes on software development.
- [Visual Gallery](${baseUrl}/gallery): Visual documentation of activities, events, and project milestones.

## Contact & Profiles
- [Portfolio Website](${baseUrl}): ${baseUrl}
- [GitHub](https://github.com/penghancurbumi): @penghancurbumi
- [LinkedIn](https://www.linkedin.com/in/muhammad-al-fakhreza-dwi-putra-b16962301/): Muhammad Al Fakhreza Dwi Putra
- [Email](mailto:${email}): ${email}

## Optional
- [Full Comprehensive Knowledge Base](${baseUrl}/llms-full.txt): Complete, unabridged dossiers including case study architectures, technical workflows, complete certification credentials, and quantified impact.
`
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  })
}
