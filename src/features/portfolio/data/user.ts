import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Muhammad",
  lastName: "Al Fakhreza Dwi Putra",
  displayName: "Muhammad Al Fakhreza Dwi Putra",
  username: "alfakhrza",
  gender: "male",
  pronouns: "he/him",

  bio: "I'm Muhammad Al Fakhreza Dwi Putra, a Fullstack Developer based in Indonesia building practical web applications, data workflows, and machine learning systems that turn ideas into impactful products.",
  bioId:
    "Saya Muhammad Al Fakhreza Dwi Putra, seorang Fullstack Developer yang berbasis di Indonesia, membangun aplikasi web yang praktis, alur kerja data, dan sistem machine learning yang mengubah ide menjadi produk yang berdampak.",

  flipSentences: [
    "Frontend Developer",
    "Full Stack Developer",
    "Web Developer",
    "UI/UX Design",
    "Graphic Design",
  ],
  flipSentencesId: [
    "Fullstack Developer",
    "Pengembang Frontend",
    "Pengembang Full Stack",
    "Pengembang Web",
    "AI / ML Engineer",
  ],

  address: "Indonesia",
  email: "bS5hbGZha2hyZXphQGdtYWlsLmNvbQ==", // base64 of m.alfakhreza@gmail.com
  phone: "+62 878-1600-1844",
  website: "https://www.alfakhrza.dev",

  jobTitle: "Fullstack Developer",
  seoTitle: "Muhammad Al Fakhreza Dwi Putra | Fullstack Developer",
  seoDescription:
    "I'm Muhammad Al Fakhreza Dwi Putra, a Fullstack Developer from Indonesia. I build practical software, data products, and machine learning systems.",

  jobs: [
    {
      title: "IT Support",
      company: "PT Silga Perkasa",
      website: "https://www.instagram.com/silgaperkasa/",
      experienceId: "silga-perkasa",
    },
  ],

  about: `A Computer Science student with an interest in Software Engineering, Data and Artificial Intelligence, particularly in software development. Accustomed to problem-solving, debugging and requirements analysis, and possessing a strong ability to learn and an enthusiasm for continuously developing skills in the field of technology.`,
  aboutId: `Mahasiswa Teknik Informatika dengan minat di bidang Software Engineering, Data, dan Artificial Intelligence, khususnya dalam pengembangan perangkat lunak. Terbiasa melakukan problem solving, debugging, dan analisis kebutuhan, serta memiliki kemampuan belajar yang tinggi dan antusias untuk terus mengembangkan keterampilan di bidang teknologi.`,

  avatar: "/avatar-profile.webp",
  ogImage: "/image/og.png",
  sameAs: [
    "https://www.alfakhrza.dev",
    "https://github.com/penghancurbumi",
    "https://www.linkedin.com/in/muhammad-al-fakhreza-dwi-putra-b16962301/",
  ],
  timeZone: "Asia/Jakarta",

  keywords: [
    "Muhammad Al Fakhreza Dwi Putra",
    "alfakhrza",
    "Muhammad Al Fakhreza Dwi Putra portfolio",
    "alfakhrza portfolio",
    "fullstack developer Indonesia",
    "full stack developer",
    "data products",
    "fullstack portfolio",
    "machine learning portfolio",
  ],

  // Full ISO 8601 datetimes: Schema.org dateCreated/dateModified expect a
  // time component, and date-only values trip up structured-data validators.
  dateCreated: "2023-11-01T00:00:00Z",
  dateModified: "2026-07-20T00:00:00Z",
}
