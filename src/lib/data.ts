import { ClassItem, Trainer, Schedule, MembershipPlan } from './types';

export const GYM_INFO = {
  name: '11th Universe MMA - 11 Fight Camp',
  tagline: 'Forge Your Strength. Master the Art of Combat.',
  subTagline: 'Sasana bela diri, combat sports & functional fitness nomor satu di Pontianak.',
  phone: '+628818124824',
  phoneFormatted: '+62 881-8124-824',
  instagram: '11fightcamp',
  instagramUrl: 'https://www.instagram.com/11fightcamp/?hl=en',
  address: 'Jl. Dr. Rubini No. 11, Akcaya, Kec. Pontianak Selatan, Kota Pontianak, Kalimantan Barat 78113',
  googleMapsUrl: 'https://maps.google.com/?q=11+Fight+Camp+Pontianak+Jl+Dr+Rubini+No+11',
  openingHours: [
    { days: 'Senin - Jumat', morning: '08:00 - 11:30', evening: '15:30 - 21:30' },
    { days: 'Sabtu', morning: '07:00 - 11:30', evening: '15:00 - 18:30' },
    { days: 'Minggu', morning: '10:00 - 12:00', evening: '15:30 - 18:00' },
  ],
};

export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'class-striking',
    title: 'Striking (Muay Thai & Boxing)',
    category: 'striking',
    description: 'Sesi latihan pukulan, tendangan, elbow, knee, dan kombinasi pad work & heavy bag. Cocok untuk semua tingkatan, dari pemula hingga atlet.',
    durationMinutes: 75,
    intensity: 'All Levels',
    imageUrl: '/classes/striking.jpg',
    equipmentNeeded: ['Handwrap', 'Sarung Tinju (Glove)', 'Pakaian Olahraga'],
    benefits: ['Bakar 600-800 kcal', 'Teknik Striking Lengkap', 'Reflek & Agility', 'Cardio Maksimal'],
  },
  {
    id: 'class-bjj',
    title: 'Brazilian Jiu-Jitsu (BJJ)',
    category: 'bjj',
    description: 'Seni bela diri ground fighting, takedown, kuncian sendi, dan submission. Efektif untuk pertahanan diri praktis.',
    durationMinutes: 90,
    intensity: 'All Levels',
    imageUrl: '/classes/bjj.jpg',
    equipmentNeeded: ['Gi / No-Gi Rashguard', 'Mouthguard'],
    benefits: ['Ground Control', 'Submissions', 'Problem Solving Tubuh', 'Kekuatan Inti (Core)'],
  },
  {
    id: 'class-hyrox',
    title: 'HYROX Functional Fitness',
    category: 'hyrox',
    description: 'Program kebugaran dan ketahanan atletik global: kombinasi lari dan functional workout station khas Hyrox World Championship.',
    durationMinutes: 60,
    intensity: 'High Intensity',
    imageUrl: '/classes/hyrox.jpg',
    equipmentNeeded: ['Sepatu Running', 'Botol Minum', 'Handuk'],
    benefits: ['Endurance Luar Biasa', 'Fat Loss Tercepat', 'Kekuatan Fungsional', 'Persiapan Race'],
  },
  {
    id: 'class-bjj-kids',
    title: 'BJJ Kids',
    category: 'kids',
    description: 'Kelas khusus anak-anak untuk melatih disiplin, koordinasi motorik, anti-bullying, dan teknik Brazilian Jiu-Jitsu dengan metode menyenangkan dan aman.',
    durationMinutes: 60,
    intensity: 'Beginner Friendly',
    imageUrl: '/classes/bjj-kids.jpg',
    equipmentNeeded: ['Pakaian Olahraga / Gi Anak'],
    benefits: ['Anti-Bullying Confidence', 'Fokus & Disiplin', 'Motorik Kasar & Halus', 'Teman Positif'],
  },
  {
    id: 'class-muaykids',
    title: 'Muaykids (Muay Thai Kids)',
    category: 'kids',
    description: 'Pelatihan dasar Muay Thai khusus anak-anak: postur, tendangan bantalan pad, reflek gerak, dan rasa percaya diri sejak usia dini.',
    durationMinutes: 60,
    intensity: 'Beginner Friendly',
    imageUrl: '/classes/muaykids.jpg',
    equipmentNeeded: ['Glove Anak', 'Pakaian Nyaman'],
    benefits: ['Kebugaran Anak', 'Disiplin & Respect', 'Stamina Tinggi', 'Koordinasi Mata & Kaki'],
  },
  {
    id: 'class-yoga-hatha',
    title: 'Yoga Hatha',
    category: 'yoga',
    description: 'Latihan peregangan otot, fleksibilitas sendi, pengaturan pernapasan (pranayama), dan ketenangan pikiran setelah sesi latihan intensif.',
    durationMinutes: 75,
    intensity: 'Beginner Friendly',
    imageUrl: '/classes/yoga.jpg',
    equipmentNeeded: ['Matras Yoga (Disediakan)', 'Pakaian Lentur'],
    benefits: ['Fleksibilitas Sendi', 'Recovery Otot', 'Anti-Stres', 'Keseimbangan Tubuh'],
  },
  {
    id: 'class-yoga-if',
    title: 'Yoga IF (Intermediate Flow)',
    category: 'yoga',
    description: 'Flow yoga dinamis untuk penguatan otot penunjang, perbaikan postur tubuh atletis, serta kelenturan dinamis.',
    durationMinutes: 75,
    intensity: 'Intermediate',
    imageUrl: '/classes/yoga.jpg',
    equipmentNeeded: ['Matras Yoga', 'Handuk'],
    benefits: ['Dynamic Flexibility', 'Keseimbangan Inti', 'Postur Tegak', 'Stamina Pernapasan'],
  },
  {
    id: 'class-zumba',
    title: 'Zumba Dance Fitness',
    category: 'zumba',
    description: 'Kombinasi senam kardio dan tari berirama musik berenergi tinggi. Sangat seru dan efektif membakar kalori dalam suasana ceria.',
    durationMinutes: 60,
    intensity: 'All Levels',
    imageUrl: '/classes/zumba.jpg',
    equipmentNeeded: ['Sepatu Senam', 'Handuk', 'Air Minum'],
    benefits: ['Bakar 500+ kcal', 'Mood Booster', 'Kardiovaskular Sehat', 'Koordinasi Ritme Tubuh'],
  },
  {
    id: 'class-private',
    title: 'Private 1-on-1 Coaching',
    category: 'private',
    description: 'Sesi privat eksklusif bersama Coach berpengalaman. Waktu dan materi disesuaikan dengan kebutuhan Anda.',
    durationMinutes: 75,
    intensity: 'All Levels',
    imageUrl: '/classes/private.jpg',
    equipmentNeeded: ['Perlengkapan Disediakan'],
    benefits: ['Fokus Personal 100%', 'Progres Cepat', 'Jadwal Fleksibel'],
  },
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'trainer-mahaji',
    name: 'Coach Mahaji Arbain Wicaksana',
    role: 'Head Coach',
    specialty: 'Muay Thai, Boxing, Conditioning, & MMA Striking',
    bio: 'Head Coach resmi 11th Universe MMA / 11 Fight Camp Pontianak. Memimpin kurikulum striking, tinju, pengondisian fisik, dan teknik MMA.',
    photoUrl: '/coach-mahaji.webp',
    instagram: '11fightcamp',
    achievements: ['Head Coach 11th Universe MMA', 'Muay Thai & Boxing Lead', 'MMA Striking & Conditioning Lead'],
  },
  {
    id: 'trainer-david',
    name: 'Coach David',
    role: 'BJJ & Grappling Specialist',
    specialty: 'Brazilian Jiu-Jitsu (BJJ)',
    bio: 'Instruktur ground fighting dan kuncian submission untuk kelas dewasa dan anak-anak (BJJ Kids).',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    instagram: '11fightcamp',
    achievements: ['BJJ Belt Specialist', 'Kids Martial Arts Certified'],
  },
  {
    id: 'trainer-aris',
    name: 'Coach Aris',
    role: 'Hyrox & Conditioning Lead',
    specialty: 'Hyrox Functional Racing & HIIT',
    bio: 'Instruktur ketahanan fisik atletik dan fat loss circuit bersertifikasi.',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    instagram: '11fightcamp',
    achievements: ['Hyrox Certified Coach', 'Athletic Conditioning Coach'],
  },
  {
    id: 'trainer-sarah',
    name: 'Coach Sarah',
    role: 'Yoga & Mobility Instructor',
    specialty: 'Yoga Hatha & Intermediate Flow',
    bio: 'Fokus pada pemulihan sendi, fleksibilitas atletis, dan ketenangan pikiran pasca-latihan berat.',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    instagram: '11fightcamp',
    achievements: ['Certified Yoga Alliance Instructor', 'Mobility Specialist'],
  },
  {
    id: 'trainer-cindy',
    name: 'Coach Cindy',
    role: 'Zumba Dance Fitness Lead',
    specialty: 'Zumba & Cardio Dance',
    bio: 'Instruktur Zumba berenergi tinggi yang membawakan sesi kardio seru dan membakar kalori maksimal.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    instagram: '11fightcamp',
    achievements: ['Licensed Zumba Instructor', 'Cardio Fitness Expert'],
  },
];

// ==============================================================================
// OFFICIAL SCHEDULES - EXACT MATRIX DARI SASANA 11TH UNIVERSE MMA / 11 FIGHT CAMP
// Days: 0 = Minggu, 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
// ==============================================================================

export const INITIAL_SCHEDULES: Schedule[] = [
  // --- 08.30 (SENIN - SABTU): STRIKING ---
  { id: 'sch-mon-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 1, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-tue-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 2, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-wed-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 3, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-thu-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 4, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-fri-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 5, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-sat-0700-hyrox', classId: 'class-hyrox', trainerId: 'trainer-aris', dayOfWeek: 6, startTime: '07:00', endTime: '08:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-sat-0830-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 6, startTime: '08:30', endTime: '09:45', maxCapacity: 15, price: 75000, isActive: true },

  // --- 10.00 (SENIN - SABTU): STRIKING + YOGA IF (SENIN) + BJJ KIDS (MINGGU) ---
  { id: 'sch-mon-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 1, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-mon-1000-yoga-if', classId: 'class-yoga-if', trainerId: 'trainer-sarah', dayOfWeek: 1, startTime: '10:00', endTime: '11:15', maxCapacity: 12, price: 70000, isActive: true },
  { id: 'sch-tue-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 2, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-wed-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 3, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-thu-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 4, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-fri-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 5, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-sat-1000-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 6, startTime: '10:00', endTime: '11:15', maxCapacity: 15, price: 75000, isActive: true },
  { id: 'sch-sun-1000-bjj-kids', classId: 'class-bjj-kids', trainerId: 'trainer-david', dayOfWeek: 0, startTime: '10:00', endTime: '11:15', maxCapacity: 12, price: 65000, isActive: true },

  // --- SABTU 15.00: MUAYKIDS ---
  { id: 'sch-sat-1500-muaykids', classId: 'class-muaykids', trainerId: 'trainer-mahaji', dayOfWeek: 6, startTime: '15:00', endTime: '16:00', maxCapacity: 12, price: 65000, isActive: true },

  // --- 16.00 (SENIN - MINGGU): STRIKING ---
  { id: 'sch-mon-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 1, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-tue-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 2, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-wed-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 3, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-thu-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 4, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-fri-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 5, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-sat-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 6, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-sun-1600-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 0, startTime: '16:00', endTime: '17:15', maxCapacity: 16, price: 75000, isActive: true },

  // --- 17.00 (SENIN - SABTU): STRIKING ---
  { id: 'sch-mon-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 1, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-tue-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 2, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-wed-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 3, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-thu-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 4, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-fri-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 5, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-sat-1700-striking', classId: 'class-striking', trainerId: 'trainer-mahaji', dayOfWeek: 6, startTime: '17:00', endTime: '18:15', maxCapacity: 16, price: 75000, isActive: true },

  // --- 18.30: YOGA HATHA (SENIN, JUMAT) & ZUMBA (KAMIS) ---
  { id: 'sch-mon-1830-yoga-hatha', classId: 'class-yoga-hatha', trainerId: 'trainer-sarah', dayOfWeek: 1, startTime: '18:30', endTime: '19:45', maxCapacity: 14, price: 70000, isActive: true },
  { id: 'sch-thu-1830-zumba', classId: 'class-zumba', trainerId: 'trainer-cindy', dayOfWeek: 4, startTime: '18:30', endTime: '19:30', maxCapacity: 20, price: 60000, isActive: true },
  { id: 'sch-fri-1830-yoga-hatha', classId: 'class-yoga-hatha', trainerId: 'trainer-sarah', dayOfWeek: 5, startTime: '18:30', endTime: '19:45', maxCapacity: 14, price: 70000, isActive: true },

  // --- RABU 19.00: HYROX ---
  { id: 'sch-wed-1900-hyrox', classId: 'class-hyrox', trainerId: 'trainer-aris', dayOfWeek: 3, startTime: '19:00', endTime: '20:15', maxCapacity: 16, price: 75000, isActive: true },

  // --- 20.00: BJJ (SENIN, RABU, JUMAT) & HYROX (SENIN) ---
  { id: 'sch-mon-2000-bjj', classId: 'class-bjj', trainerId: 'trainer-david', dayOfWeek: 1, startTime: '20:00', endTime: '21:30', maxCapacity: 16, price: 80000, isActive: true },
  { id: 'sch-mon-2000-hyrox', classId: 'class-hyrox', trainerId: 'trainer-aris', dayOfWeek: 1, startTime: '20:00', endTime: '21:15', maxCapacity: 16, price: 75000, isActive: true },
  { id: 'sch-wed-2000-bjj', classId: 'class-bjj', trainerId: 'trainer-david', dayOfWeek: 3, startTime: '20:00', endTime: '21:30', maxCapacity: 16, price: 80000, isActive: true },
  { id: 'sch-fri-2000-bjj', classId: 'class-bjj', trainerId: 'trainer-david', dayOfWeek: 5, startTime: '20:00', endTime: '21:30', maxCapacity: 16, price: 80000, isActive: true },
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'drop-in',
    title: 'Single Session (Drop-in)',
    subtitle: 'Cocok untuk coba pertama kali atau jadwal fleksibel',
    price: 75000,
    period: 'per sesi',
    features: [
      'Akses 1 sesi kelas reguler apa saja',
      'Peminjaman sarung tinju gratis untuk first-timer',
      'Bimbingan langsung dari coach di kelas',
      'Fasilitas shower, loker, dan air minum',
    ],
  },
  {
    id: 'pack-10',
    title: '10 Sessions Pass',
    subtitle: 'Paling populer untuk rutin latihan mingguan',
    price: 650000,
    period: 'berlaku 45 hari',
    isPopular: true,
    badge: 'Best Value',
    features: [
      'Hemat Rp 100.000 dibanding drop-in',
      'Bebas pilih kelas: Striking, BJJ, Hyrox, Yoga, Zumba',
      'Bisa booking jadwal fleksibel kapan saja',
      'Masa aktif 45 hari sejak sesi pertama',
      'Prioritas slot booking kelas favorit',
    ],
  },
  {
    id: 'unlimited-monthly',
    title: 'Monthly Unlimited',
    subtitle: 'Untuk kamu yang berkomitmen serius transformasi',
    price: 900000,
    period: 'per bulan',
    badge: 'Pro Fighter',
    features: [
      'Akses tanpa batas ke SEMUA kelas reguler',
      'Bisa latihan setiap hari (Senin - Minggu)',
      'Free konsultasi program & nutrisi dasar',
      'Diskon 15% untuk official merchandise 11FC',
      'Akses area gym saat jam operasional',
    ],
  },
  {
    id: 'private-pack',
    title: 'Private 1-on-1 (5 Sessions)',
    subtitle: 'Program eksklusif dengan Coach pilihan',
    price: 1100000,
    period: '5 sesi privat',
    features: [
      '5 sesi privat intensif 75 menit',
      'Jadwal fleksibel (pagi, siang, malam)',
      'Analisis teknik detail & pad work eksklusif',
      'Fokus personal: kurangi berat badan / teknik bertarung',
    ],
  },
];

export const TESTIMONIALS = [
  {
    name: 'Dimas Kurniawan',
    role: 'Member sejak 2024',
    text: 'Awalnya gabung cuma buat turunin berat badan, tapi sekarang malah ketagihan Striking di 11th Universe. Coach-coachnya ramah buat pemula dan tekniknya beneran diajarin detail!',
    rating: 5,
    classTag: 'Striking',
  },
  {
    name: 'Sarah Stephanie',
    role: 'Member Yoga & Striking',
    text: 'Vibe camp-nya keren banget! Kombinasi Striking sore dan Yoga malam bikin tubuh bugar banget. Sangat recommended buat warga Pontianak!',
    rating: 5,
    classTag: 'Striking & Yoga',
  },
  {
    name: 'Rian Pratama',
    role: 'BJJ Practitioner',
    text: 'Camp bela diri paling lengkap di Pontianak. Ada BJJ dan Hyrox dengan instruktur yang paham banget teknik ground dan endurance.',
    rating: 5,
    classTag: 'BJJ & Hyrox',
  },
];
