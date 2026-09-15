import {
  AstroidIcon,
  BarChart3Icon,
  FlaskConicalIcon,
  GraduationCapIcon,
  NetworkIcon,
  SchoolIcon,
  UsersIcon,
} from "lucide-react"

import type { Experience } from "../types/experiences"

export const EXPERIENCES: Experience[] = [

  {
    id: "silga-perkasa",
    companyName: "PT Silga Perkasa",
    positions: [
      {
        id: "silga-perkasa-it-support",
        title: "IT Support",
        employmentPeriod: {
          start: "02.2026",
          end: "07.2026",
        },
        employmentType: "Part-time",
        icon: <NetworkIcon />,
        description: `- Troubleshot hardware, software, and network-related issues.
- Provided technical support to users.
- Ensured computer devices and network infrastructure operated properly to support company activities.`,
        descriptionId: `- Menangani troubleshooting pada hardware, software, dan jaringan.
- Memberikan dukungan teknis kepada pengguna.
- Memastikan perangkat komputer dan jaringan dapat beroperasi dengan baik untuk mendukung aktivitas perusahaan.`,
        skills: [
          "IT Support",
          "Hardware Troubleshooting",
          "Software Troubleshooting",
          "Network Troubleshooting",
          "Technical Support",
        ],
      },
    ],
    isCurrentEmployer: false,
  },
  {
    id: "hmti-media-publikasi",
    companyName: "Himpunan Mahasiswa Teknik Informatika",
    positions: [
      {
        id: "hmti-media-publikasi-2025",
        title: "Media, Konten, dan Publikasi",
        employmentPeriod: {
          start: "2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Managed and distributed organizational information through cohort and organizational communication groups.
- Ensured information regarding activities, announcements, and programs was delivered accurately and on time.
- Created social media designs and visual content to support organizational branding and visual identity.
- Developed informative and up-to-date content according to organizational needs.
- Created publication materials to support activities and programs across different divisions.`,
        descriptionId: `- Membantu menyebarkan informasi organisasi melalui grup angkatan maupun grup organisasi.
- Mengelola dan mendistribusikan informasi terkait kegiatan, pengumuman, dan program kerja organisasi.
- Memastikan informasi dapat tersampaikan kepada anggota secara tepat waktu dan luas.
- Membuat desain media sosial organisasi untuk mendukung branding dan identitas visual organisasi.
- Membuat konten visual yang informatif dan up to date sesuai dengan kebutuhan organisasi.
- Membuat desain sesuai dengan kebutuhan publikasi dan program kerja dari divisi lain.`,
        skills: [
          "Content Creation",
          "Social Media",
          "Graphic Design",
          "Information Management",
          "Publication",
          "Visual Branding",
        ],
      },
    ],
    isCurrentEmployer: true,
  },

  {
    id: "comtech-2025",
    companyName: "Himpunan Mahasiswa Teknik Informatika",
    positions: [
      {
        id: "comtech-2025-ketua",
        title: "Ketua Pelaksana — COMTECH 2025",
        employmentPeriod: {
          start: "2025",
          end: "2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Led and coordinated the COMTECH 2025 program from planning through execution.
- Organized an innovative system development competition aimed at providing solutions to problems in the surrounding environment.
- Managed task distribution, team coordination, and event execution to ensure alignment with established objectives.`,
        descriptionId: `- Memimpin dan mengoordinasikan pelaksanaan program kerja COMTECH 2025 dari tahap perencanaan hingga pelaksanaan.
- Menyelenggarakan lomba pembuatan sistem inovatif yang bertujuan memberikan solusi terhadap permasalahan di lingkungan sekitar.
- Mengatur pembagian tugas, koordinasi tim, serta memastikan kegiatan berjalan sesuai dengan tujuan yang telah ditetapkan.`,
        skills: [
          "Leadership",
          "Project Management",
          "Team Coordination",
          "Event Management",
          "Problem Solving",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "himatif-visual-design",
    companyName: "Himpunan Mahasiswa Teknik Informatika",
    positions: [
      {
        id: "himatif-visual-design-2024",
        title: "Sub Divisi Visual dan Desain",
        employmentPeriod: {
          start: "2024",
          end: "2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Created and developed visual content to support organizational activities and publications.
- Designed social media content according to branding and publication needs.
- Collaborated with team members to produce informative and engaging visual materials.`,
        descriptionId: `- Membuat dan mengembangkan materi visual untuk mendukung kegiatan dan publikasi organisasi.
- Membuat desain konten media sosial sesuai dengan kebutuhan branding dan publikasi.
- Berkolaborasi dengan anggota tim dalam menghasilkan materi visual yang informatif dan menarik.`,
        skills: [
          "Graphic Design",
          "Visual Design",
          "Social Media",
          "Content Creation",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "nusapala",
    companyName: "Unit Kegiatan Mahasiswa Nusapala",
    positions: [
      {
        id: "nusapala-infokom",
        title: "Anggota Divisi Infokom",
        employmentPeriod: {
          start: "2024",
          end: "2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Created feed and story designs for organizational social media content.
- Adapted visual designs to support organizational activities and program publications.
- Supported organizational branding and visual identity through social media content.`,
        descriptionId: `- Membuat desain feed dan story untuk kebutuhan konten media sosial organisasi.
- Menyesuaikan desain dengan kebutuhan publikasi kegiatan dan program kerja organisasi.
- Mendukung publikasi dan membangun identitas visual organisasi melalui konten media sosial.`,
        skills: [
          "Graphic Design",
          "Social Media Design",
          "Visual Branding",
          "Content Creation",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "jurnalis-nuansa",
    companyName: "Unit Kegiatan Mahasiswa Khusus Jurnalis Nuansa",
    positions: [
      {
        id: "jurnalis-nuansa-kameramen",
        title: "Anggota Divisi Mindset — Kameramen",
        employmentPeriod: {
          start: "2024",
          end: "2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Served as a cameraman for organizational events and content production.
- Captured photos and videos for documentation and publication purposes.
- Supported content production to create engaging and informative visual materials.`,
        descriptionId: `- Berperan sebagai kameramen dalam kegiatan dan produksi konten organisasi.
- Melakukan pengambilan foto dan video di lokasi kegiatan untuk kebutuhan dokumentasi dan publikasi.
- Membantu proses produksi konten agar menghasilkan materi visual yang menarik dan informatif.`,
        skills: [
          "Photography",
          "Videography",
          "Camera Operation",
          "Content Production",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "hari-keakraban-hmti",
    companyName: "Hari Keakraban Himpunan Mahasiswa Teknik Informatika 2024",
    positions: [
      {
        id: "hari-keakraban-hmti-mentor",
        title: "Divisi Mentor",
        employmentPeriod: {
          start: "10.2024",
          end: "01.2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Guided participants in understanding the environment and scope of the Informatics Engineering Student Association.
- Accompanied participants throughout the series of activities and helped build interaction among members.
- Provided guidance and information regarding organizational activities, structure, and member roles.`,
        descriptionId: `- Membimbing peserta dalam mengenal lingkungan dan ruang lingkup organisasi Himpunan Mahasiswa Teknik Informatika.
- Mendampingi peserta selama rangkaian kegiatan dan membantu membangun interaksi antaranggota.
- Memberikan arahan dan informasi mengenai kegiatan, struktur, serta peran organisasi kepada peserta.`,
        skills: [
          "Mentorship",
          "Communication",
          "Teamwork",
          "Organization",
          "Leadership",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "mabim-nusaputra",
    companyName: "MABIM NusaPutra",
    positions: [
      {
        id: "mabim-nusaputra-mentor",
        title: "Divisi Mentor",
        employmentPeriod: {
          start: "08.2024",
          end: "09.2024",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Guided and accompanied new students in getting to know the campus environment, academic system, and campus life.
- Organized and guided new students throughout the MABIM activities.
- Assisted new students in adapting to the academic and non-academic environment at Universitas Nusa Putra.`,
        descriptionId: `- Membimbing dan mendampingi mahasiswa baru dalam mengenal lingkungan, sistem, serta kehidupan kampus.
- Mengatur dan mengarahkan mahasiswa baru selama rangkaian kegiatan MABIM.
- Membantu mahasiswa baru beradaptasi dan mengenal lingkungan akademik maupun non-akademik di Universitas Nusa Putra.`,
        skills: [
          "Mentorship",
          "Communication",
          "Leadership",
          "Student Guidance",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "ldkm-2024",
    companyName: "Latihan Dasar Kepemimpinan Mahasiswa (LDKM) 2024",
    positions: [
      {
        id: "ldkm-2024-mentor",
        title: "Divisi Mentor",
        employmentPeriod: {
          start: "03.2025",
          end: "07.2025",
        },
        employmentType: "Organization",
        icon: <UsersIcon />,
        description: `- Guided and accompanied participants throughout the LDKM activities.
  - Provided guidance and helped participants understand the materials and activities presented during the program.
  - Helped develop participants' leadership, teamwork, communication, and discipline skills.`,
        descriptionId: `- Membimbing dan mendampingi peserta selama rangkaian kegiatan LDKM.
  - Memberikan arahan serta membantu peserta memahami materi dan aktivitas yang diberikan selama kegiatan.
  - Membantu membangun kemampuan kepemimpinan, kerja sama, komunikasi, dan kedisiplinan peserta.`,
        skills: [
          "Mentorship",
          "Leadership",
          "Teamwork",
          "Communication",
          "Discipline",
        ],
      },
    ],
    isCurrentEmployer: false,
  },

  {
    id: "education",
    companyName: "Education",
    positions: [
      {
        id: "edu-nusaputra",
        title: "Universitas Nusa Putra",
        employmentPeriod: {
          start: "2023",
          end: "2027",
        },
        icon: <GraduationCapIcon />,
        description: `- Bachelor's Degree in Informatics Engineering with a current GPA of 3.50/4.00.
- Studied software development, programming, software engineering, and information technology project management.
- Relevant coursework includes Platform-Based Programming, Calculus, Programming Fundamentals, Software Analysis and Design, Software Project, and Information Technology Project Management.`,
        descriptionId: `- Program Sarjana Teknik Informatika dengan IPK 3,50/4,00.
- Mempelajari pengembangan perangkat lunak, pemrograman, rekayasa perangkat lunak, serta manajemen proyek teknologi informasi.
- Mata kuliah relevan meliputi Pemrograman Berbasis Platform, Kalkulus, Dasar Pemrograman, Analisis dan Desain Perangkat Lunak, Proyek Perangkat Lunak, dan Manajemen Proyek Teknologi Informasi.`,
        skills: [
          "Informatics Engineering",
          "Programming",
          "Software Engineering",
          "Software Development",
          "Project Management",
        ],
      },

      {
        id: "edu-sman3-sukabumi",
        title: "SMA Negeri 3 Kota Sukabumi",
        employmentPeriod: {
          start: "2020",
          end: "2023",
        },
        icon: <SchoolIcon />,
        description: `- Completed secondary education at SMA Negeri 3 Kota Sukabumi from 2020 to 2023.
- Built an academic foundation before pursuing higher education in Informatics Engineering.`,
        descriptionId: `- Menyelesaikan pendidikan menengah di SMA Negeri 3 Kota Sukabumi pada tahun 2020 hingga 2023.
- Membangun dasar akademik sebagai bekal untuk melanjutkan pendidikan di bidang Teknik Informatika.`,
        skills: [
          "Academic Foundation",
          "Problem Solving",
          "Learning",
        ],
      },
    ],
    isCurrentEmployer: true,
  },
]
