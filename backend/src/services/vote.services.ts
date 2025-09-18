import prisma from '../model/prismaClient';

// Cek apakah user sudah vote
export const checkUserVoted = async (userId: string) => {
  return await prisma.vote.findUnique({
    where: { user_id: userId },
  });
};

// Buat vote baru
export const createVote = async (userId: string, candidateId: string) => {
  return await prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      candidate: { connect: { id: candidateId } },
    },
  });
};

// Ambil semua vote (admin)
export const getAllVotes = async () => {
  return await prisma.vote.findMany({
    include: {
      user: { select: { id: true, nisn: true } },
      candidate: { select: { id: true, nama: true } },
    },
    orderBy: { created_at: 'desc' },
  });
};

// Ambil vote by ID (admin)
export const getVoteById = async (voteId: string) => {
  return await prisma.vote.findUnique({
    where: { id: voteId },
    include: {
      user: { select: { id: true, nisn: true } },
      candidate: { select: { id: true, nama: true } },
    },
  });
};

// Delete vote (admin)
export const deleteVote = async (voteId: string) => {
  const vote = await prisma.vote.findUnique({ where: { id: voteId } });
  if (!vote) return null;

  await prisma.vote.delete({ where: { id: voteId } });
  return vote;
};
