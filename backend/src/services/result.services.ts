import prisma from '../model/prismaClient';

// Update atau buat VoteResult secara real-time
export const updateCandidateVoteCount = async (candidateId: string) => {
  // Hitung jumlah vote dari tabel Vote
  const votesCount = await prisma.vote.count({
    where: { candidate_id: candidateId },
  });

  // Cek dulu apakah VoteResult sudah ada
  const existingResult = await prisma.voteResult.findUnique({
    where: { candidateId },
  });

  if (existingResult) {
    return await prisma.voteResult.update({
      where: { candidateId },
      data: { votesCount },
    });
  } else {
    return await prisma.voteResult.create({
      data: { candidateId, votesCount },
    });
  }
};

// Ambil semua hasil voting (admin)
export const getVoteResults = async () => {
  return await prisma.voteResult.findMany({
    include: { candidate: true },
    orderBy: { votesCount: 'desc' },
  });
};
