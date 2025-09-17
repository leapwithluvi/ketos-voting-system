import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCandidate = async (
  nama: string,
  visi: string,
  misi: string,
  foto: string | null,
) => {
  return prisma.candidate.create({
    data: { nama, visi, misi, foto },
  });
};

export const getCandidate = async () => {
  return prisma.candidate.findMany();
};

export const getCandidateById = async (id: string) => {
  return prisma.candidate.findUnique({ where: { id } });
};

export const updateCandidate = async (
  id: string,
  nama?: string,
  visi?: string,
  misi?: string,
  foto?: string | null,
) => {
  const data: any = {};

  if (nama !== undefined) data.nama = nama;
  if (visi !== undefined) data.visi = visi;
  if (misi !== undefined) data.misi = misi;
  if (foto !== undefined) data.foto = foto;

  return prisma.candidate.update({
    where: { id },
    data,
  });
};

export const deleteCandidate = async (id: string) => {
  return prisma.candidate.delete({ where: { id } });
};
