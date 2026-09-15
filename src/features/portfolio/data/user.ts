import type { User } from "@/features/portfolio/types/user"

export const USER: User = {
  firstName: "Muhammad",
  lastName: "Al Fakhreza Dwi Putra",
  displayName: "Muhammad Al Fakhreza Dwi Putra",
  username: "alfakhrza",
  gender: "male",
  pronouns: "he/him",

  bio: "I'm Firdaus Khotibul Zickrian, an AI Engineer based in Indonesia building practical machine learning systems, data workflows, and modern full-stack web applications that turn ideas into impactful products.",
  bioId:
    "Saya Firdaus Khotibul Zickrian, seorang AI Engineer yang berbasis di Indonesia, membangun sistem machine learning yang praktis, alur kerja data, dan aplikasi web full-stack modern yang mengubah ide menjadi produk yang berdampak.",

  flipSentences: [
    "Frontend Developer",
    "Full Stack Developer",
    "Web Developer",
    "UI/UX Design",
    "Graphic Design",
  ],
  flipSentencesId: [
    "Software Engineer",
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
  seoTitle: "Muhammad Al Fakhreza Dwi Putra | fullstack Developer",
  seoDescription:
    "I'm Firdaus Khotibul Zickrian, an AI and machine learning engineer from Indonesia. I build practical software, data products, and machine learning systems.",

  jobs: [
    {
      title: "AI Engineer Intern",
      company: "PT Custompedia Creative Group",
      website: "https://www.instagram.com/custompedia/",
      experienceId: "custompedia",
    },
  ],

  about: `A Computer Science student with an interest in Software Engineering, Data and Artificial Intelligence, particularly in software development. Accustomed to problem-solving, debugging and requirements analysis, and possessing a strong ability to learn and an enthusiasm for continuously developing skills in the field of technology.`,
  aboutId: `Mahasiswa Teknik Informatika dengan minat di bidang Software Engineering, Data, dan Artificial Intelligence, khususnya dalam pengembangan perangkat lunak. Terbiasa melakukan problem solving, debugging, dan analisis kebutuhan, serta memiliki kemampuan belajar yang tinggi dan antusias untuk terus mengembangkan keterampilan di bidang teknologi.`,

  avatar: "/avatar-profile.webp",
  ogImage: "/image/og.png",
  sameAs: [
    "https://www.alfakhrza.dev",
    "https://github.com/zickrian",
    "https://linkedin.com/in/firdauskhotibulzickrian/",
    "https://medium.com/@zickriann",
    "https://huggingface.co/zickrian",
    "https://www.pinterest.com/espejodaniel50/",
  ],
  timeZone: "Asia/Jakarta",

  keywords: [
    "Firdaus Khotibul Zickrian",
    "zickrian",
    "Firdaus Khotibul Zickrian portfolio",
    "zickrian portfolio",
    "AI engineer Indonesia",
    "machine learning engineer Indonesia",
    "AI and machine learning",
    "full stack developer",
    "data products",
    "MLOps",
    "computer vision",
    "AI portfolio",
    "machine learning portfolio",
  ],

  // Full ISO 8601 datetimes: Schema.org dateCreated/dateModified expect a
  // time component, and date-only values trip up structured-data validators.
  dateCreated: "2023-11-01T00:00:00Z",
  dateModified: "2026-07-20T00:00:00Z",
}
