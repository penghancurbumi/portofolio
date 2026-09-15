import type { Project, ProjectCollaboration } from "../types/projects"

const COLLABORATION: Record<string, ProjectCollaboration> = {
  uangku: {
    ownership: "Individual project",
    ownershipId: "Proyek Individu",
    label: "Individual",
    team: "Solo project",
    role: "UI/UX Designer",
    roleId: "UI/UX Designer",
    contributions: [
      "Designed the end-to-end user flows for top up, bill payment, transfers, and other digital transaction activities.",
      "Built wireframes and high-fidelity prototypes in Figma for every core screen of the application.",
      "Kept the interface simple and consistent so first-time users can complete a transaction without guidance.",
      "Documented the design system: color, typography, spacing, and reusable components.",
    ],
    contributionsId: [
      "Merancang alur pengguna end-to-end untuk top up, pembayaran tagihan, transfer, dan aktivitas transaksi digital lainnya.",
      "Membangun wireframe dan prototipe high-fidelity di Figma untuk setiap layar inti aplikasi.",
      "Menjaga antarmuka tetap sederhana dan konsisten agar pengguna baru dapat menyelesaikan transaksi tanpa panduan.",
      "Mendokumentasikan design system: warna, tipografi, spacing, dan komponen yang dapat digunakan ulang.",
    ],
  },
  maxgym: {
    ownership: "Individual project",
    ownershipId: "Proyek Individu",
    label: "Individual",
    team: "Solo project",
    role: "Fullstack Web Developer",
    roleId: "Fullstack Web Developer",
    contributions: [
      "Built the company profile website end to end, including layout, styling, and interactive elements.",
      "Structured the content so visitors immediately understand the company profile, services, and activities.",
      "Made the site responsive across mobile, tablet, and desktop breakpoints.",
      "Optimised the pages for fast loading and clean information hierarchy.",
    ],
    contributionsId: [
      "Membangun website company profile secara end-to-end, termasuk layout, styling, dan elemen interaktif.",
      "Menata konten agar pengunjung langsung memahami profil, layanan, dan aktivitas perusahaan.",
      "Membuat situs responsif untuk breakpoint mobile, tablet, dan desktop.",
      "Mengoptimalkan halaman agar cepat dimuat dengan hierarki informasi yang rapi.",
    ],
  },
  timeleak: {
    ownership: "Individual project",
    ownershipId: "Proyek Individu",
    label: "Individual",
    team: "Solo #JuaraVibeCoding submission",
    role: "Fullstack Developer",
    roleId: "Fullstack Developer",
    contributions: [
      "Built the AI tool that estimates how much time a user spends on daily activities.",
      "Designed the conversion logic that turns tracked time into an estimated monetary value.",
      "Developed the product concept as a solution to raise awareness about time management and productivity.",
      "Implemented the interface and the AI-assisted analysis flow end to end.",
    ],
    contributionsId: [
      "Membangun AI tools yang memperkirakan berapa banyak waktu yang dihabiskan pengguna dalam aktivitas harian.",
      "Merancang logika konversi yang mengubah waktu yang tercatat menjadi estimasi nilai uang.",
      "Mengembangkan konsep produk sebagai solusi untuk meningkatkan kesadaran pengguna dalam mengelola waktu dan produktivitas.",
      "Mengimplementasikan antarmuka dan alur analisis berbantuan AI secara end-to-end.",
    ],
  },
  jobfinder: {
    ownership: "Individual project",
    ownershipId: "Proyek Individu",
    label: "Individual",
    team: "Solo project",
    role: "Fullstack Developer",
    roleId: "Fullstack Developer",
    contributions: [
      "Built the job search platform that aggregates the latest job postings in a single place.",
      "Developed the CV Analysis and CV Builder features so users can evaluate and improve their CV.",
      "Built the AI chatbot that helps users prepare applications and answer job-search questions.",
      "Integrated job discovery and career preparation into one end-to-end platform.",
    ],
    contributionsId: [
      "Membangun platform pencarian pekerjaan yang mengumpulkan informasi lowongan terbaru dalam satu tempat.",
      "Mengembangkan fitur CV Analysis dan CV Builder agar pengguna dapat mengevaluasi dan memperbaiki CV.",
      "Membangun AI chatbot yang membantu pengguna menyiapkan lamaran dan menjawab pertanyaan seputar pencarian kerja.",
      "Mengintegrasikan pencarian lowongan dan persiapan karier dalam satu platform end-to-end.",
    ],
  },
  silga: {
    ownership: "Individual project",
    ownershipId: "Proyek Individu",
    label: "Individual",
    team: "PT Silga Perkasa (internship project)",
    role: "Fullstack Web Developer",
    roleId: "Fullstack Web Developer",
    contributions: [
      "Built the company profile website that introduces PT Silga Perkasa to the public and prospective clients.",
      "Presented the company profile, services, and activities through a clear digital presence.",
      "Developed the pages with a modern stack and clean content structure.",
      "Helped strengthen the company's branding and digital presence so it is easier to discover.",
    ],
    contributionsId: [
      "Membangun website company profile yang memperkenalkan PT Silga Perkasa kepada masyarakat dan calon pengguna.",
      "Menyajikan informasi profil, layanan, serta aktivitas perusahaan melalui kehadiran digital yang jelas.",
      "Mengembangkan halaman dengan stack modern dan struktur konten yang rapi.",
      "Membantu meningkatkan branding dan digital presence perusahaan sehingga lebih mudah dikenal.",
    ],
  },
}

export const PROJECTS: Project[] = [
  {
    id: "uangku",
    title: "UANGKU - Digital Finance App UI/UX Concept",
    category: "UI/UX Design",
    categoryId: "Desain UI/UX",
    tagline:
      "A UI/UX design concept for a digital finance application in the style of DANA, OVO, and ShopeePay — covering top up, payments, and daily digital transactions.",
    taglineId:
      "Konsep desain UI/UX aplikasi pengelolaan keuangan digital dengan gaya layanan seperti DANA, OVO, dan ShopeePay — mencakup top up, pembayaran, dan transaksi digital harian.",
    seoDescription:
      "UI/UX case study for UANGKU, a digital finance app concept covering wallet flows, top up, payments, and a simple transaction experience.",
    year: "2025",
    image: "/projects/uangku/1.webp",
    period: { start: "December 2025", end: "December 2025" },
    link: "",
    links: {},
    skills: ["Figma", "UI/UX Design", "Wireframing", "Prototyping", "Design System"],
    coverSkills: ["Figma", "UI/UX", "Prototyping"],
    features: [
      "Designed the user flow for digital wallet activities such as top up, bill payment, and transfers.",
      "Created wireframes and high-fidelity screens for every core page in Figma.",
      "Built a simple, beginner-friendly interface focused on the transaction experience.",
      "Defined reusable components and layout rules so new screens stay consistent.",
    ],
    featuresId: [
      "Merancang alur pengguna untuk aktivitas dompet digital seperti top up, pembayaran tagihan, dan transfer.",
      "Membuat wireframe dan desain high-fidelity untuk setiap layar inti di Figma.",
      "Membangun antarmuka sederhana yang ramah pengguna baru dengan fokus pada pengalaman transaksi.",
      "Menentukan komponen yang dapat digunakan ulang dan aturan layout agar layar baru tetap konsisten.",
    ],
    impact: [
      "Turns a complex set of financial transactions into a flow that first-time users can follow without instruction.",
      "Provides a reusable design system so the product can grow without redesigning the interface from scratch.",
      "Demonstrates how a finance app can feel trustworthy and simple through clear information hierarchy and visual consistency.",
    ],
    impactId: [
      "Mengubah rangkaian transaksi keuangan yang kompleks menjadi alur yang bisa diikuti pengguna baru tanpa panduan.",
      "Menyediakan design system yang dapat digunakan ulang sehingga produk bisa berkembang tanpa mendesain ulang antarmuka dari awal.",
      "Menunjukkan bagaimana aplikasi keuangan bisa terasa terpercaya dan sederhana melalui hierarki informasi dan konsistensi visual yang jelas.",
    ],
    future: [
      "Turn the Figma prototype into a clickable high-fidelity prototype for user testing.",
      "Expand the design system with dark mode, empty states, and error states.",
      "Add usability testing results and iterate on the top-up and payment flows.",
    ],
    futureId: [
      "Mengubah prototipe Figma menjadi prototipe high-fidelity yang dapat diklik untuk user testing.",
      "Memperluas design system dengan dark mode, empty state, dan error state.",
      "Menambahkan hasil usability testing lalu menyempurnakan alur top up dan pembayaran.",
    ],
    collaboration: COLLABORATION.uangku,
    badge: "UI/UX Case Study",
    badgeId: "Studi Kasus UI/UX",
    gallery: ["/projects/uangku/1.webp"],
  },
  {
    id: "maxgym",
    title: "MaxGym Performance - Company Profile Website",
    category: "Web Development",
    categoryId: "Pengembangan Web",
    tagline:
      "A company profile website that introduces MaxGym Performance to prospective customers and the wider public.",
    taglineId:
      "Website company profile yang memperkenalkan MaxGym Performance kepada calon pelanggan dan masyarakat luas.",
    seoDescription:
      "Built the MaxGym Performance company profile website with PHP, Tailwind CSS, and JavaScript to present the brand, services, and company identity.",
    year: "2026",
    image: "/projects/maxgym/1.webp",
    period: { start: "February 2026", end: "March 2026" },
    link: "",
    links: {},
    skills: ["PHP", "HTML", "Tailwind CSS", "JavaScript"],
    coverSkills: ["PHP", "Tailwind CSS", "JavaScript"],
    features: [
      "Informative company profile pages that represent the company identity and services.",
      "Responsive layout built with Tailwind CSS for mobile, tablet, and desktop.",
      "Clear content structure that guides visitors from introduction to contact.",
      "Lightweight implementation using PHP and vanilla JavaScript.",
    ],
    featuresId: [
      "Halaman company profile yang informatif dan merepresentasikan identitas serta layanan perusahaan.",
      "Layout responsif dengan Tailwind CSS untuk mobile, tablet, dan desktop.",
      "Struktur konten yang jelas, mengarahkan pengunjung dari perkenalan hingga kontak.",
      "Implementasi ringan menggunakan PHP dan JavaScript vanilla.",
    ],
    impact: [
      "Gives MaxGym Performance a professional digital presence that is easier to share with prospective customers.",
      "Replaces scattered information with a single, structured website that explains the brand and its services.",
      "Strengthens branding so the business is easier to find and remember online.",
    ],
    impactId: [
      "Memberikan MaxGym Performance kehadiran digital yang profesional sehingga lebih mudah dibagikan ke calon pelanggan.",
      "Menggantikan informasi yang tersebar dengan satu website terstruktur yang menjelaskan brand dan layanannya.",
      "Memperkuat branding sehingga bisnis lebih mudah ditemukan dan diingat secara online.",
    ],
    future: [
      "Add a CMS-managed content layer so the gym can update schedules and pricing without code changes.",
      "Add a membership class schedule and trainer profile section.",
      "Improve SEO with structured data, sitemap, and richer Open Graph previews.",
    ],
    futureId: [
      "Menambahkan lapisan konten berbasis CMS agar gym dapat memperbarui jadwal dan harga tanpa mengubah kode.",
      "Menambahkan bagian jadwal kelas membership dan profil trainer.",
      "Meningkatkan SEO dengan structured data, sitemap, dan preview Open Graph yang lebih kaya.",
    ],
    collaboration: COLLABORATION.maxgym,
    gallery: ["/projects/maxgym/1.webp"],
  },
  {
    id: "timeleak",
    title: "TimeLeak AI - Time to Money Awareness Tool",
    category: "AI / Web Development",
    categoryId: "AI / Pengembangan Web",
    tagline:
      "An AI tool that shows how much time is spent on daily activities and converts it into an estimated monetary value.",
    taglineId:
      "AI tools yang menunjukkan berapa banyak waktu yang dihabiskan dalam aktivitas harian dan mengonversinya menjadi estimasi nilai uang.",
    seoDescription:
      "TimeLeak AI (Google #JuaraVibeCoding) turns tracked daily activities into an estimated monetary value to raise time-awareness and productivity.",
    year: "2026",
    image: "/projects/timeleak/1.webp",
    period: { start: "June 2026", end: "July 2026" },
    link: "",
    links: {},
    skills: ["TypeScript", "Tailwind CSS", "Next.js"],
    coverSkills: ["Next.js", "TypeScript", "AI"],
    features: [
      "Tracks daily activities and estimates how much time each one consumes.",
      "Converts tracked time into an estimated monetary value so wasted time becomes visible.",
      "AI-assisted insight that explains where the user's time actually goes.",
      "Dashboard presentation designed to make the time-value tradeoff immediately obvious.",
    ],
    featuresId: [
      "Mencatat aktivitas harian dan memperkirakan berapa banyak waktu yang digunakan untuk masing-masing aktivitas.",
      "Mengonversi waktu yang tercatat menjadi estimasi nilai uang sehingga waktu yang terbuang menjadi terlihat.",
      "Insight berbantuan AI yang menjelaskan ke mana waktu pengguna sebenarnya pergi.",
      "Penyajian dashboard yang dibuat agar tradeoff antara waktu dan nilai langsung terlihat.",
    ],
    impact: [
      "Makes the cost of wasted time visible by translating it into money, which is easier to act on than abstract hours.",
      "Helps users build awareness of their daily habits and improve productivity through concrete numbers.",
      "Demonstrates an AI product concept built end to end for the Google #JuaraVibeCoding challenge.",
    ],
    impactId: [
      "Membuat biaya waktu yang terbuang menjadi terlihat dengan mengonversinya ke nilai uang, yang lebih mudah ditindaklanjuti daripada angka jam yang abstrak.",
      "Membantu pengguna menyadari kebiasaan harian dan meningkatkan produktivitas melalui angka yang konkret.",
      "Menunjukkan konsep produk AI yang dibangun end-to-end untuk tantangan #JuaraVibeCoding Google.",
    ],
    future: [
      "Automate activity tracking so entries are captured without manual input.",
      "Add weekly and monthly time-value reports with trend comparisons.",
      "Turn the concept into a full product with accounts, history, and exportable insights.",
    ],
    futureId: [
      "Mengotomatiskan pencatatan aktivitas agar data terekam tanpa input manual.",
      "Menambahkan laporan nilai waktu mingguan dan bulanan dengan perbandingan tren.",
      "Mengembangkan konsep menjadi produk penuh dengan akun, riwayat, dan insight yang bisa diekspor.",
    ],
    collaboration: COLLABORATION.timeleak,
    badge: "Google #JuaraVibeCoding",
    badgeId: "Google #JuaraVibeCoding",
    gallery: ["/projects/timeleak/1.webp"],
  },
  {
    id: "jobfinder",
    title: "JobFinder - Job Search & Career Platform",
    category: "Web Development",
    categoryId: "Pengembangan Web",
    tagline:
      "A job search platform that aggregates the latest job postings and bundles CV Analysis, CV Builder, and an AI chatbot into one career workspace.",
    taglineId:
      "Platform pencarian kerja yang mengumpulkan lowongan terbaru dan menggabungkan CV Analysis, CV Builder, serta AI chatbot dalam satu ruang kerja karier.",
    seoDescription:
      "JobFinder combines aggregated job listings with CV Analysis, CV Builder, and an AI chatbot so users can search and prepare for a role in one platform.",
    year: "2026",
    image: "/projects/jobfinder/1.webp",
    period: { start: "July 2026" },
    link: "",
    links: {},
    skills: ["Vue.js", "Tailwind CSS", "Node.js", "Python"],
    coverSkills: ["Vue.js", "Node.js", "Python"],
    features: [
      "Aggregates the latest job postings from multiple sources into one searchable platform.",
      "CV Analysis that reviews a user's CV and highlights what to improve.",
      "CV Builder that helps users produce a cleaner, role-targeted CV.",
      "AI chatbot that assists with job-search questions and application preparation.",
    ],
    featuresId: [
      "Mengumpulkan lowongan kerja terbaru dari berbagai sumber ke dalam satu platform yang dapat dicari.",
      "CV Analysis yang meninjau CV pengguna dan menunjukkan bagian yang perlu diperbaiki.",
      "CV Builder yang membantu pengguna membuat CV yang lebih rapi dan sesuai posisi yang dituju.",
      "AI chatbot yang membantu pertanyaan seputar pencarian kerja dan persiapan lamaran.",
    ],
    impact: [
      "Shortens the job-search loop by putting discovery and application preparation in a single platform.",
      "Gives users practical feedback on their CV before they apply, instead of after being rejected.",
      "Combines job data with AI assistance so candidates can move from finding a role to preparing for it without switching tools.",
    ],
    impactId: [
      "Mempersingkat proses pencarian kerja dengan menempatkan pencarian lowongan dan persiapan lamaran dalam satu platform.",
      "Memberi pengguna masukan praktis atas CV mereka sebelum melamar, bukan setelah ditolak.",
      "Menggabungkan data lowongan dengan bantuan AI sehingga pelamar dapat berpindah dari menemukan posisi ke mempersiapkannya tanpa berganti tools.",
    ],
    future: [
      "Add job alerts and saved searches so users are notified when matching roles appear.",
      "Improve the CV Analysis scoring with role-specific keywords and ATS checks.",
      "Add application tracking so users can follow every application in one dashboard.",
    ],
    futureId: [
      "Menambahkan notifikasi lowongan dan pencarian tersimpan agar pengguna diberi tahu saat ada posisi yang cocok.",
      "Meningkatkan penilaian CV Analysis dengan kata kunci spesifik posisi dan pemeriksaan ATS.",
      "Menambahkan pelacakan lamaran agar pengguna dapat memantau setiap lamaran dalam satu dashboard.",
    ],
    collaboration: COLLABORATION.jobfinder,
    badge: "Ongoing",
    badgeId: "Sedang Berjalan",
    gallery: ["/projects/jobfinder/1.webp"],
  },
  {
    id: "silga",
    title: "PT Silga Perkasa - Company Profile Website",
    category: "Web Development",
    categoryId: "Pengembangan Web",
    tagline:
      "A company profile website for PT Silga Perkasa that presents the company profile, services, and activities to the public and prospective clients.",
    taglineId:
      "Website company profile PT Silga Perkasa yang menyajikan profil, layanan, dan aktivitas perusahaan kepada masyarakat dan calon pengguna.",
    seoDescription:
      "Developed the PT Silga Perkasa company profile website with Next.js, Tailwind CSS, PHP, and Laravel to strengthen the company's digital presence.",
    year: "2026",
    image: "/projects/silga/1.webp",
    period: { start: "February 2026" },
    link: "",
    links: {},
    skills: ["Next.js", "Tailwind CSS", "PHP", "Laravel"],
    coverSkills: ["Next.js", "Laravel", "Tailwind CSS"],
    features: [
      "Company profile pages presenting the profile, services, and company activities.",
      "Structured content so visitors can quickly understand what the company offers.",
      "Responsive interface built with Next.js and Tailwind CSS.",
      "Backend integration to keep company content maintainable.",
    ],
    featuresId: [
      "Halaman company profile yang menyajikan profil, layanan, dan aktivitas perusahaan.",
      "Konten terstruktur agar pengunjung dapat cepat memahami apa yang ditawarkan perusahaan.",
      "Antarmuka responsif yang dibangun dengan Next.js dan Tailwind CSS.",
      "Integrasi backend agar konten perusahaan tetap mudah dipelihara.",
    ],
    impact: [
      "Strengthens PT Silga Perkasa's digital presence so the company is easier to find and recognise.",
      "Centralises company information that was previously only shared directly or offline.",
      "Gives prospective clients a reliable first impression of the company's services.",
    ],
    impactId: [
      "Memperkuat digital presence PT Silga Perkasa sehingga perusahaan lebih mudah ditemukan dan dikenali.",
      "Memusatkan informasi perusahaan yang sebelumnya hanya dibagikan secara langsung atau offline.",
      "Memberi calon klien kesan pertama yang meyakinkan mengenai layanan perusahaan.",
    ],
    future: [
      "Add a Laravel-managed admin panel so company content can be updated in-house.",
      "Add a project portfolio and client testimonial section.",
      "Improve performance with image optimisation, caching, and Core Web Vitals tuning.",
    ],
    futureId: [
      "Menambahkan admin panel berbasis Laravel agar konten perusahaan dapat diperbarui secara internal.",
      "Menambahkan bagian portofolio proyek dan testimoni klien.",
      "Meningkatkan performa dengan optimasi gambar, caching, dan penyetelan Core Web Vitals.",
    ],
    collaboration: COLLABORATION.silga,
    badge: "Ongoing",
    badgeId: "Sedang Berjalan",
    gallery: ["/projects/silga/1.webp"],
  },
]

export const PROJECTS_BY_ID = PROJECTS.reduce<Record<string, Project>>(
  (accumulator, project) => {
    accumulator[project.id] = project
    return accumulator
  },
  {}
)
