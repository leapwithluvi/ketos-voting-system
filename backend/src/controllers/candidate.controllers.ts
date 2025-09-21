import { Request, Response } from 'express';
import httpStatus from '../lib/httpStatus';
import * as CandidateServices from '../services/candidate.services';
import { responseError, responseSuccess } from '../utils/responseTemplate';
import { getFileUrl } from '../utils/helpers/fileUrl.helper';
import { UPLOAD_PATHS } from '../consts/const';
import { deleteFile } from '../utils/helpers/fileDelete.helper';
import path from 'path';

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const { no, ketuaNama, ketuaKelas, wakilNama, wakilKelas, visi, misi, slogan } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const ketuaFoto = files?.ketuaImg?.[0]?.filename ?? null;
    const wakilFoto = files?.wakilImg?.[0]?.filename ?? null;
    const jurusanImg = files?.jurusanImg?.map((f) => f.filename) ?? [];

    if (!no || !ketuaNama || !ketuaKelas || !wakilNama || !wakilKelas || !visi || !misi) {
      if (files) {
        Object.values(files).forEach((arr) => {
          arr.forEach((f) => {
            const filePath = path.join(UPLOAD_PATHS.IMAGES, f.filename);
            deleteFile(filePath);
          });
        });
      }
      return responseError(res, 'Required fields are missing', httpStatus.BAD_REQUEST, undefined);
    }

    const candidateData = {
      no: parseInt(no),
      ketua: { nama: ketuaNama, kelas: ketuaKelas, foto: ketuaFoto },
      wakil: { nama: wakilNama, kelas: wakilKelas, foto: wakilFoto },
      visi,
      misi,
      slogan,
      jurusan: jurusanImg,
    };

    const candidate = await CandidateServices.createCandidate(candidateData);

    const result = {
      ...candidate,
      ketua: {
        ...candidate.ketua,
        imageUrl: candidate.ketua.foto
          ? getFileUrl(req, candidate.ketua.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      wakil: {
        ...candidate.wakil,
        imageUrl: candidate.wakil.foto
          ? getFileUrl(req, candidate.wakil.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      jurusan: candidate.jurusan.map((j) => getFileUrl(req, j, UPLOAD_PATHS.IMAGES)),
    };

    return responseSuccess(res, 'Candidate created successfully', httpStatus.CREATED, result);
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const getCandidate = async (req: Request, res: Response) => {
  try {
    const candidates = await CandidateServices.getCandidate();

    const result = candidates.map((candidate) => ({
      ...candidate,
      ketua: {
        ...candidate.ketua,
        imageUrl: candidate.ketua.foto
          ? getFileUrl(req, candidate.ketua.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      wakil: {
        ...candidate.wakil,
        imageUrl: candidate.wakil.foto
          ? getFileUrl(req, candidate.wakil.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      jurusan: candidate.jurusan.map((j) => getFileUrl(req, j, UPLOAD_PATHS.IMAGES)),
    }));

    return responseSuccess(res, 'Semua kandidat ditemukan', httpStatus.OK, result);
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const candidate = await CandidateServices.getCandidateById(id);

    if (!candidate) {
      return responseError(res, 'Kandidat tidak ditemukan', httpStatus.NOT_FOUND, undefined);
    }

    const result = {
      ...candidate,
      ketua: {
        ...candidate.ketua,
        imageUrl: candidate.ketua.foto
          ? getFileUrl(req, candidate.ketua.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      wakil: {
        ...candidate.wakil,
        imageUrl: candidate.wakil.foto
          ? getFileUrl(req, candidate.wakil.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      jurusan: candidate.jurusan.map((j) => getFileUrl(req, j, UPLOAD_PATHS.IMAGES)),
    };

    return responseSuccess(res, 'Kandidat berhasil ditemukan', httpStatus.OK, result);
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { no, ketuaNama, ketuaKelas, wakilNama, wakilKelas, visi, misi, slogan } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const ketuaFoto = files?.ketuaImg?.[0]?.filename;
    const wakilFoto = files?.wakilImg?.[0]?.filename;
    const jurusanImg = files?.jurusanImg?.map((f) => f.filename);

    const oldCandidate = await CandidateServices.getCandidateById(id);
    if (!oldCandidate) {
      return responseError(res, 'Candidate not found', httpStatus.NOT_FOUND, undefined);
    }

    const updateData: any = {};
    if (no) updateData.no = parseInt(no);

    if (ketuaNama || ketuaKelas || ketuaFoto) {
      updateData.ketua = {
        nama: ketuaNama ?? oldCandidate.ketua.nama,
        kelas: ketuaKelas ?? oldCandidate.ketua.kelas,
        foto: ketuaFoto ?? oldCandidate.ketua.foto,
      };

      if (ketuaFoto && oldCandidate.ketua.foto) {
        const filePath = `${UPLOAD_PATHS.IMAGES}/${oldCandidate.ketua.foto}`;
        deleteFile(filePath);
      }
    }

    if (wakilNama || wakilKelas || wakilFoto) {
      updateData.wakil = {
        nama: wakilNama ?? oldCandidate.wakil.nama,
        kelas: wakilKelas ?? oldCandidate.wakil.kelas,
        foto: wakilFoto ?? oldCandidate.wakil.foto,
      };

      if (wakilFoto && oldCandidate.wakil.foto) {
        const filePath = `${UPLOAD_PATHS.IMAGES}/${oldCandidate.wakil.foto}`;
        deleteFile(filePath);
      }
    }

    if (visi) updateData.visi = visi;
    if (misi) updateData.misi = misi;
    if (slogan) updateData.slogan = slogan;
    if (jurusanImg && jurusanImg.length > 0) {
      if (oldCandidate.jurusan && oldCandidate.jurusan.length > 0) {
        oldCandidate.jurusan.forEach((j) => {
          const filePath = `${UPLOAD_PATHS.IMAGES}/${j}`;
          deleteFile(filePath);
        });
      }
      updateData.jurusan = jurusanImg;
    }

    const candidate = await CandidateServices.updateCandidate(id, updateData);

    const result = {
      ...candidate,
      ketua: {
        ...candidate.ketua,
        imageUrl: candidate.ketua.foto
          ? getFileUrl(req, candidate.ketua.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      wakil: {
        ...candidate.wakil,
        imageUrl: candidate.wakil.foto
          ? getFileUrl(req, candidate.wakil.foto, UPLOAD_PATHS.IMAGES)
          : null,
      },
      jurusan: candidate.jurusan.map((j) => getFileUrl(req, j, UPLOAD_PATHS.IMAGES)),
    };

    return responseSuccess(res, 'Candidate updated successfully', httpStatus.OK, result);
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const candidateToDelete = await CandidateServices.getCandidateById(id);
    if (!candidateToDelete) {
      return responseError(res, 'Kandidat tidak ditemukan', httpStatus.NOT_FOUND, undefined);
    }

    const candidate = await CandidateServices.deleteCandidate(id);

    if (candidateToDelete.ketua?.foto) {
      const filePath = `${UPLOAD_PATHS.IMAGES}/${candidateToDelete.ketua.foto}`;
      deleteFile(filePath);
    }

    if (candidateToDelete.wakil?.foto) {
      const filePath = `${UPLOAD_PATHS.IMAGES}/${candidateToDelete.wakil.foto}`;
      deleteFile(filePath);
    }

    if (candidateToDelete.jurusan?.length > 0) {
      candidateToDelete.jurusan.forEach((j) => {
        const filePath = `${UPLOAD_PATHS.IMAGES}/${j}`;
        deleteFile(filePath);
      });
    }

    return responseSuccess(res, 'Kandidat berhasil dihapus', httpStatus.OK, {
      id: candidate.id,
      no: candidate.no,
    });
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};
