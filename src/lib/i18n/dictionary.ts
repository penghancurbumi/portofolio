import type { Language } from "@/hooks/use-language-preference"

/**
 * Static UI copy for every locale the site supports. Content that lives in
 * data files (bio, project descriptions, etc.) is localized separately via
 * the `xxxId` sibling fields and `localize()` in `./localize.ts` — this file
 * only covers chrome: nav, labels, empty states, and the like.
 */
const dictionary = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      blog: "Blog",
      gallery: "Gallery",
      chat: "Terminal",
      settings: "Settings",
    },
    settings: {
      language: "Language",
      english: "English",
      indonesian: "Indonesia",
      theme: "Theme",
      light: "Light",
      system: "System",
      dark: "Dark",
    },
    skipToContent: "Skip to content",
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    about: {
      kicker: "About",
      callout: "Start here - a quick read on the person behind the projects.",
    },
    overview: {
      sr: "Overview",
      location: "Location",
      phone: "Phone",
      personalWebsite: "Personal website",
      pronouns: "Pronouns",
      localTime: "Local time",
    },
    social: {
      sr: "Social Links",
    },
    github: {
      sr: "GitHub Contributions",
    },
    experiences: {
      title: "Experience",
      employmentType: "Employment Type",
      employmentPeriod: "Employment Period",
      duration: "Duration",
      present: "Present",
    },
    projects: {
      title: "Projects",
      viewAll: "View all",
      year: "Year",
      workInProgress: "Work in progress",
    },
    gallery: {
      workInProgress: "Still cooking",
    },
    techStack: {
      title: "Stack",
    },
    awards: {
      title: "Awards",
      callout:
        "Proof that thoughtful teamwork, strong execution, and a little persistence get noticed.",
      prize: "Prize",
      awardedIn: "Awarded in",
      receivedInGrade: "Received in Grade",
      openReferenceAttachment: "Open Reference Attachment",
    },
    publications: {
      title: "Publications",
      journal: "Journal",
      published: "Published",
    },
    certifications: {
      title: "Certifications",
      issuedBy: "Issued by",
      issuedOn: "Issued on",
    },
    collapsibleList: {
      showMore: "Show more",
      showLess: "Show less",
    },
    projectDetail: {
      backToProjects: "Projects",
      liveDemo: "Live Demo",
      sourceCode: "Source Code",
      ownership: "Ownership",
      role: "Role",
      team: "Team",
      myRole: "My Role",
      features: "Features",
      impact: "Impact",
      future: "Future",
      stack: "Stack",
      notes: "Notes",
    },
    footer: {
      contact: "Contact",
      index: "Index",
      home: "Home",
    },
    notFound: {
      message:
        "Looks like this page doesn’t exist (yet). Just like a blank space in a conversation, there’s nothing to respond to. Go back to",
      home: "home",
      suffix: "and rejoin the conversation.",
    },
    blog: {
      emptyTitle: "No articles published yet",
      emptyDescription:
        "New posts and writings will appear here once published.",
    },
    chat: {
      inputPlaceholder: "How can I help you?",
      sendMessage: "Send message",
      closeChat: "Close chat",
      chatMode: "Chat",
      emailMode: "Email",
      confirmEmail: "Confirm Email",
      from: "From:",
      subject: "Subject:",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      editEmail: "Edit Email",
      sendEmail: "Send Email",
      sending: "Sending...",
      sendEmailToZickrian: "Send Email",
      yourName: "Your name",
      yourEmail: "Your email",
      writeMessageHere: "Write your message here...",
      continue: "Continue",
      budgetTitle: "BUDGET",
      budgetLimitReached: "BUDGET LIMIT REACHED.\nPLEASE STOP SPENDING.",
      budgetClose:
        "YOU'RE GETTING CLOSE TO YOUR LIMIT\nCONSIDER SLOWING DOWN SPENDING",
      budgetHealthy: "YOUR BUDGET IS LOOKING HEALTHY.\nKEEP IT UP.",
      invalidEmail: "Invalid email format.",
      composeStart: "Email composer started. Fill in each input one by one.",
      composeSenderPrompt:
        "Step 1/3 — Sender: enter your name & email (e.g. John <john@example.com>) or just your email address. Type cancel to abort.",
      composeSenderInvalid:
        "[ERROR] That sender email doesn't look valid. Try again, or type cancel to abort.",
      composeSubjectPrompt: "Step 2/3 — Subject: enter the email subject.",
      composeBodyPrompt: "Step 3/3 — Body: enter the message body.",
      composePreviewTitle: "email preview",
      composePreviewSender: "Sender",
      composePreviewSubject: "Subject",
      composePreviewBody: "Body",
      composePreviewStatus: "Status",
      composePreviewReady: "Ready to send",
      composeSendHint:
        "> send to deliver this message\n> cancel to discard",
      composeSendInvalid:
        "[ERROR] Type send to deliver this message or cancel to discard it.",
      composeCancelled: "Email composer cancelled. Nothing was sent.",
      composeInputHint: "type your answer... (cancel to abort)",
      todayLoadingMessages: [
        "Syncing local clock...",
        "Fetching live weather for Indonesia...",
        "Calculating WIB time...",
      ],
      loadingMessages: [
        "Fetching portfolio data...",
        "Selecting the most relevant context...",
        "Analyzing your question...",
        "Composing a clear answer...",
      ],
      formattingMessages: [
        "Analyzing the submitted form data...",
        "Extracting core intent and key information...",
        "Restructuring into a professional email...",
        "Polishing the final message...",
      ],
      sendingMessages: [
        "Validating final email payload...",
        "Dispatching secure request to the email service...",
        "Awaiting delivery confirmation...",
        "Finalizing transmission...",
      ],
      emailPreviewReady:
        "Here is a preview of your formatted email. Please review and confirm before sending",
      sendingLimitReached: (limit: number, wait: string) =>
        `[RATE LIMIT] Sending limit reached.\n\nYou've already sent ${limit} emails in the last hour. Try again in **${wait}**.`,
      emailSentSuccess: (name: string, email: string, remaining: number) =>
        `[SENT] Email delivered successfully.\n\n  from     ${name} <${email}>\n  to       Muhammad Al Fakhreza Dwi Putra\n  status   250 OK\n  quota    ${remaining > 0 ? `${remaining}x remaining this hour` : "exhausted for this hour"}\n\nA confirmation copy has been sent to ${email}.`,
    },
  },
  id: {
    nav: {
      home: "Beranda",
      projects: "Proyek",
      blog: "Blog",
      gallery: "Galeri",
      chat: "Chat",
      settings: "Pengaturan",
    },
    settings: {
      language: "Bahasa",
      english: "English",
      indonesian: "Indonesia",
      theme: "Tema",
      light: "Terang",
      system: "Sistem",
      dark: "Gelap",
    },
    skipToContent: "Langsung ke konten",
    greeting: {
      morning: "Selamat pagi",
      afternoon: "Selamat siang",
      evening: "Selamat malam",
    },
    about: {
      kicker: "Tentang",
      callout:
        "Mulai di sini - sekilas cerita tentang orang di balik proyek-proyek ini.",
    },
    overview: {
      sr: "Ringkasan",
      location: "Lokasi",
      phone: "Telepon",
      personalWebsite: "Situs pribadi",
      pronouns: "Kata ganti",
      localTime: "Waktu setempat",
    },
    social: {
      sr: "Tautan Sosial",
    },
    github: {
      sr: "Kontribusi GitHub",
    },
    experiences: {
      title: "Pengalaman",
      callout:
        "Beberapa babak membangun, belajar, dan mengubah rasa ingin tahu teknis menjadi sistem yang berguna.",
      employmentType: "Jenis Pekerjaan",
      employmentPeriod: "Periode Kerja",
      duration: "Durasi",
      present: "Sekarang",
    },
    projects: {
      title: "Proyek",
      viewAll: "Lihat semua",
      year: "Tahun",
      workInProgress: "Sedang dikerjakan",
      callout:
        "Ide menjadi nyata ketika keputusan model, antarmuka, dan produk bergerak bersama.",
    },
    gallery: {
      workInProgress: "Masih disiapkan",
    },
    techStack: {
      title: "Teknologi",
    },
    awards: {
      title: "Penghargaan",
      callout:
        "Bukti bahwa kerja sama tim yang matang, eksekusi yang kuat, dan sedikit ketekunan akan diperhatikan.",
      prize: "Penghargaan",
      awardedIn: "Diraih pada",
      receivedInGrade: "Tingkat Penghargaan",
      openReferenceAttachment: "Buka Lampiran Referensi",
    },
    publications: {
      title: "Publikasi",
      journal: "Jurnal",
      published: "Diterbitkan",
    },
    certifications: {
      title: "Sertifikasi",
      issuedBy: "Diterbitkan oleh",
      issuedOn: "Diterbitkan pada",
    },
    collapsibleList: {
      showMore: "Tampilkan lebih banyak",
      showLess: "Tampilkan lebih sedikit",
    },
    projectDetail: {
      backToProjects: "Proyek",
      liveDemo: "Demo Langsung",
      sourceCode: "Kode Sumber",
      ownership: "Kepemilikan",
      role: "Peran",
      team: "Tim",
      myRole: "Peran Saya",
      features: "Fitur",
      impact: "Dampak",
      future: "Rencana ke Depan",
      stack: "Teknologi",
      notes: "Catatan",
    },
    footer: {
      contact: "Kontak",
      index: "Indeks",
      home: "Beranda",
    },
    notFound: {
      message:
        "Sepertinya halaman ini belum ada (belum dibuat). Layaknya jeda hening dalam percakapan, tidak ada yang dapat direspons. Kembali ke",
      home: "beranda",
      suffix: "dan bergabung kembali ke percakapan.",
    },
    blog: {
      emptyTitle: "Belum ada artikel yang dipublikasikan",
      emptyDescription:
        "Tulisan dan artikel baru akan muncul di sini setelah dipublikasikan.",
    },
    chat: {
      inputPlaceholder: "Ada yang bisa dibantu?",
      sendMessage: "Kirim pesan",
      closeChat: "Tutup chat",
      chatMode: "Chat",
      emailMode: "Email",
      confirmEmail: "Konfirmasi Email",
      from: "Dari:",
      subject: "Subjek:",
      cancel: "Batal",
      saveChanges: "Simpan Perubahan",
      editEmail: "Ubah Email",
      sendEmail: "Kirim Email",
      sending: "Mengirim...",
      sendEmailToZickrian: "Kirim Email",
      yourName: "Nama kamu",
      yourEmail: "Email kamu",
      writeMessageHere: "Tulis pesanmu di sini...",
      continue: "Lanjutkan",
      budgetTitle: "BUDGET",
      budgetLimitReached: "BATAS BUDGET TERCAPAI.\nMOHON HENTIKAN PENGGUNAAN.",
      budgetClose:
        "BUDGET KAMU HAMPIR HABIS\nPERTIMBANGKAN UNTUK MENGURANGI PENGGUNAAN",
      budgetHealthy: "BUDGET KAMU MASIH SEHAT.\nLANJUTKAN.",
      invalidEmail: "Format email tidak valid.",
      composeStart: "Komposer email dimulai. Isi setiap input satu per satu.",
      composeSenderPrompt:
        "Langkah 1/3 — Pengirim: masukkan nama & email (contoh: John <john@example.com>) atau cukup alamat email kamu. Ketik cancel untuk membatalkan.",
      composeSenderInvalid:
        "[ERROR] Email pengirim tidak valid. Coba lagi, atau ketik cancel untuk membatalkan.",
      composeSubjectPrompt: "Langkah 2/3 — Subjek: masukkan subjek email.",
      composeBodyPrompt: "Langkah 3/3 — Body: masukkan isi pesan.",
      composePreviewTitle: "pratinjau email",
      composePreviewSender: "Pengirim",
      composePreviewSubject: "Subjek",
      composePreviewBody: "Isi",
      composePreviewStatus: "Status",
      composePreviewReady: "Siap dikirim",
      composeSendHint:
        "> send untuk mengirim pesan ini\n> cancel untuk membatalkan",
      composeSendInvalid:
        "[ERROR] Ketik send untuk mengirim pesan ini atau cancel untuk membatalkannya.",
      composeCancelled:
        "Komposer email dibatalkan. Tidak ada email yang dikirim.",
      composeInputHint: "ketik jawabanmu... (cancel untuk membatalkan)",
      todayLoadingMessages: [
        "Menyelaraskan jam lokal...",
        "Mengambil cuaca langsung Indonesia...",
        "Menghitung waktu WIB...",
      ],
      loadingMessages: [
        "Mengambil data portofolio...",
        "Memilih konteks yang paling relevan...",
        "Menganalisis pertanyaanmu...",
        "Menyusun jawaban yang jelas...",
      ],
      formattingMessages: [
        "Menganalisis data formulir yang dikirim...",
        "Mengekstrak inti maksud dan informasi penting...",
        "Menyusun ulang menjadi email profesional...",
        "Menyempurnakan pesan akhir...",
      ],
      sendingMessages: [
        "Memvalidasi payload email akhir...",
        "Mengirim permintaan aman ke layanan email...",
        "Menunggu konfirmasi pengiriman...",
        "Menyelesaikan transmisi...",
      ],
      emailPreviewReady:
        "Ini pratinjau email yang sudah diformat. Silakan tinjau dan konfirmasi sebelum dikirim",
      sendingLimitReached: (limit: number, wait: string) =>
        `[RATE LIMIT] Batas pengiriman tercapai.\n\nKamu sudah mengirim ${limit} email dalam satu jam terakhir. Coba lagi dalam **${wait}**.`,
      emailSentSuccess: (name: string, email: string, remaining: number) =>
        `[SENT] Email berhasil terkirim.\n\n  dari     ${name} <${email}>\n  kepada   Muhammad Al Fakhreza Dwi Putra\n  status   250 OK\n  kuota    ${remaining > 0 ? `sisa ${remaining}x dalam satu jam ini` : "habis untuk satu jam ini"}\n\nSalinan konfirmasi telah dikirim ke ${email}.`,
    },
  },
} as const satisfies Record<Language, unknown>

export function getDictionary(language: Language) {
  return dictionary[language]
}

export type Dictionary = (typeof dictionary)[Language]
