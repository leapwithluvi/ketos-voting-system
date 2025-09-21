// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// const candidates = [
//   {
//     no: 4,
//     ketua: {
//       ketuaNama: 'Rasty',
//       ketuaKelas: 'XI AKL 2',
//     },
//     wakil: {
//       wakilNama: 'Ummu',
//       wakilKelas: 'X PM 1',
//     },
//     visi: 'Membangun lingkungan SMKN 1 Tenggarong menjadi sekolah yang seru, inspiratif, dan bersemangat melalui program-program inovatif dan kolaboratif, sehingga setiap siswa merasa nyaman, termotivasi, dan bersemangat untuk belajar dan berkembang',
//     misi: '1. Meningkatkan Rasa Kebersamaan dan Kepedulian seperti mengadakan program-program sosial dan kegiatan yang mendukung kegiatan amal dan kepedulian sosial, guna membangun rasa tanggung jawab sosial di kalangan siswa.↵↵2. Meningkatkan kerja sama antara osis, guru, dan pihak sekolah dalam mendukung kegiatan sekolah, seperti kegiatan akademik maupun non akademik, ekstrakurikuler, dan sosial↵↵3. Mendorong partisipasi aktif siswa dalam berbagai kegiatan sekolah melalui sistem saran dan ide, sehingga setiap suara didengar dan dihargai.↵↵4. Menjadi teladan positif, serta sumber motivasi bagi seluruh siswa/i SMKN 1 Tenggarong dalam bersikap, berprestasi, dan berkarya.',
//     slogan: 'Aksi nyata, Bukan kata',
//   },
//   // {
//   //   no: 2,
//   //   ketua: { nama: 'Syarifah', kelas: 'XI KUL 2' },
//   //   wakil: { nama: 'Ihsan', kelas: 'X AKL 1' },
//   //   visi: 'Menciptakan generasi siswa yang berkarakter kuat, berprestasi, dan peduli terhadap lingkungan serta masyarakat melalui kegiatan yang inovatif dan inklusif.',
//   //   misi: '1. Mengembangkan karakter dan kepemimpinan siswa: Membentuk siswa dengan karakter yang kuat, berintegritas, dan mampu menjadi pemimpin yang baik. 2. Meningkatkan kesadaran lingkungan dan sosial: Menggalakkan kegiatan yang meningkatkan kesadaran siswa akan pentingnya menjaga lingkungan dan peduli terhadap masyarakat. 3. Mengembangkan potensi siswa: Memberikan kesempatan kepada siswa untuk mengembangkan bakat, minat, dan kemampuan mereka melalui berbagai kegiatan. 4. Membangun integritas dan tanggung jawab: Menanamkan nilai-nilai integritas, tanggung jawab, dan etika kepada siswa untuk menjadi pemimpin yang baik. 5. Menciptakan lingkungan sekolah yang harmonis: Membangun hubungan yang baik antara siswa, guru, dan staf sekolah untuk menciptakan lingkungan sekolah yang kondusif dan harmonis. 6. Membangun sikap Anti-perundungan : Membuat sistem pelaporan dan penanganan kasus perundungan yang efektif. 7. Menciptakan lingkungan sekolah yang bersih dari sampah :Mengembangkan program pengelolaan sampah yang efektif di sekolah.',
//   //   slogan: 'Aksi nyata, Bukan kata',
//   //   jurusan: [],
//   // },
//   // {
//   //   no: 3,
//   //   ketua: { nama: 'Nanda', kelas: 'XI MPLB 1' },
//   //   wakil: { nama: 'Dhea', kelas: 'X AKL 2' },
//   //   visi: 'Menjadikan OSIS sebagai wadah untuk menjalankan ide-ide, aspirasi, kreativitas dan inspirasi dari para siswa dan siswi, serta menciptakan lingkungan berkarakter yang positif',
//   //   misi: '1.	Menyediakan platform (fisik maupun digital) untuk menampung ide-ide kreatif dan aspirasi dari para siswa/i. 2.	menyediakan Program penghargaan/Apresiasi bagi para siswa/i yang berprestasi. 3.	Mengadakan lomba yang melibatkan kreativitas dan keterampilan  untuk para siswa/I sebagai sarana pengembangan kreativitas. 4.	Berkolaborasi dengan organisasi lain yang ada di sekolah.',
//   //   slogan: 'Aksi nyata, Bukan kata',
//   //   jurusan: [],
//   // },
// ];

// export async function seedCandidates(prisma: PrismaClient) {
//   await prisma.$runCommandRaw({
//     delete: 'Candidate',
//     deletes: [{ q: {}, limit: 0 }],
//   });

//   await prisma.$runCommandRaw({
//     insert: 'Candidate',
//     documents: candidates,
//   });

//   console.log('✅ Seed candidates berhasil!');
// }
