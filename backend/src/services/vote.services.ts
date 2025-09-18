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
