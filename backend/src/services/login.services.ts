import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Login user by NISN and password
 * @param nisn - username / NISN
 * @param password - password (tanggal lahir)
 */

// LOGIN USER
export const login = async (nisn: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { nisn },
    });

    if (!user) {
      throw new Error('NISN anda salah.');
    }

    if (user.password !== password) {
      throw new Error('Password anda salah.');
    }

    return user;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message || 'Terjadi kesalahan saat login.');
  }
};

// LOGIN ADMIN
export const loginAdmin = async (username: string, password: string) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new Error('Username atau password anda salah');
    }

    if (!password) {
      throw new Error('Username atau password anda salah');
    }

    return admin;
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message || 'Terjadi kesalahan saat login.');
  }
};
