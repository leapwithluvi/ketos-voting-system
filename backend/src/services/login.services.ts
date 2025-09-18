import prisma from '../model/prismaClient';

/**
 * Login user by NISN and password
 * @param nisn - username / NISN
 * @param password - password (tanggal lahir)
 */

// LOGIN USER
export const login = async (nisn: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { nisn } });
  if (!user) throw new Error('NISN anda salah.');
  if (user.password !== password) throw new Error('Password anda salah.');
  return user; // user.role sudah ada
};
