import prisma from '../model/prismaClient';

export const createCandidate = async (data: {
  no: number;
  ketua: { nama: string; kelas: string; foto?: string };
  wakil: { nama: string; kelas: string; foto?: string };
  visi: string;
  misi: string;
  slogan: string;
  jurusan: string[];
}) => {
  return prisma.candidate.create({
    data,
    select: {
      id: true,
      no: true,
      ketua: true,
      wakil: true,
      visi: true,
      misi: true,
      slogan: true,
      jurusan: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const getCandidate = async () => {
  return prisma.candidate.findMany({
    select: {
      id: true,
      no: true,
      ketua: true,
      wakil: true,
      visi: true,
      misi: true,
      slogan: true,
      jurusan: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: { no: 'asc' },
  });
};

export const getCandidateById = async (id: string) => {
  return prisma.candidate.findUnique({
    where: { id },
    select: {
      id: true,
      no: true,
      ketua: true,
      wakil: true,
      visi: true,
      misi: true,
      slogan: true,
      jurusan: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const updateCandidate = async (
  id: string,
  data: {
    no?: number;
    ketua?: { nama: string; kelas: string; foto?: string | null };
    wakil?: { nama: string; kelas: string; foto?: string | null };
    visi?: string;
    misi?: string;
    slogan?: string;
    jurusan?: string[];
  },
) => {
  const updateData: any = {};

  if (data.no !== undefined) updateData.no = data.no;
  if (data.ketua !== undefined) {
    updateData.ketua = { set: data.ketua };
  }
  if (data.wakil !== undefined) {
    updateData.wakil = { set: data.wakil };
  }
  if (data.visi !== undefined) updateData.visi = data.visi;
  if (data.misi !== undefined) updateData.misi = data.misi;
  if (data.slogan !== undefined) updateData.slogan = data.slogan;
  if (data.jurusan !== undefined) updateData.jurusan = data.jurusan;

  return prisma.candidate.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      no: true,
      ketua: true,
      wakil: true,
      visi: true,
      misi: true,
      slogan: true,
      jurusan: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const deleteCandidate = async (id: string) => {
  return prisma.candidate.delete({ where: { id }, select: { id: true, no: true } });
};
