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

export const getVoteResults = async () => {
  const results = await prisma.voteResult.findMany({
    include: { candidate: true },
    orderBy: { votesCount: 'desc' },
  });

  return results.map((r) => ({
    ...r,
    candidate: {
      ...r.candidate,
      displayName: `${r.candidate.ketua.nama} & ${r.candidate.wakil.nama}`,
      description: r.candidate.slogan || r.candidate.visi,
    },
  }));
};
