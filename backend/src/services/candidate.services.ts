import prisma from '../model/prismaClient';

export const createCandidate = async (
  nama: string,
  visi: string,
  misi: string,
  foto: string | null,
) => {
  return prisma.candidate.create({
    data: { nama, visi, misi, foto },
    select: {
      id: true,
      nama: true,
      visi: true,
      misi: true,
      foto: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const getCandidate = async () => {
  return prisma.candidate.findMany({
    select: {
      id: true,
      nama: true,
      visi: true,
      misi: true,
      foto: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const getCandidateById = async (id: string) => {
  return prisma.candidate.findUnique({
    where: { id },
    select: {
      id: true,
      nama: true,
      visi: true,
      misi: true,
      foto: true,
      created_at: true,
      updated_at: true,
    },
  });
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
    select: {
      id: true,
      nama: true,
      visi: true,
      misi: true,
      foto: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const deleteCandidate = async (id: string) => {
  return prisma.candidate.delete({
    where: { id },
    select: {
      id: true,
      nama: true,
    },
  });
};
