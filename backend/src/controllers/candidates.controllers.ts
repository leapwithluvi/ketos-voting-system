import { Request, Response } from 'express';
import httpStatus from '../lib/httpStatus';
import * as CandidateServices from '../services/candidates.services';
import { responseError, responseSuccess } from '../utils/responseTemplate';
import { getFileUrl } from '../utils/helpers/fileUrl.helper';
import { UPLOAD_PATHS } from '../consts/const';
import { deleteFile } from '../utils/helpers/fileDelete.helper';

export const createCandidate = async (req: Request, res: Response) => {
  try {
    const fileName = req.file?.filename ?? null;
    const { nama, visi, misi } = req.body;

    if (!nama || !visi || !misi) {
      return responseError(res, 'Field tidak boleh kosong', httpStatus.BAD_REQUEST, undefined);
    }

    const candidate = await CandidateServices.createCandidate(nama, visi, misi, fileName);

    return responseSuccess(res, 'Kandidat berhasil dibuat', httpStatus.CREATED, {
      ...candidate,
      imageUrl: candidate.foto ? getFileUrl(req, candidate.foto, UPLOAD_PATHS.IMAGES) : null,
    });
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const getCandidate = async (req: Request, res: Response) => {
  try {
    const candidates = await CandidateServices.getCandidate();

    const result = candidates.map((candidate) => ({
      ...candidate,
      imageUrl: candidate.foto ? getFileUrl(req, candidate.foto, UPLOAD_PATHS.IMAGES) : null,
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
      imageUrl: candidate.foto ? getFileUrl(req, candidate.foto, UPLOAD_PATHS.IMAGES) : null,
    };

    return responseSuccess(res, 'Kandidat berhasil ditemukan', httpStatus.OK, result);
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const fileName = req.file?.filename ?? null;
    const { nama, visi, misi } = req.body;

    if (fileName) {
      const oldCandidate = await CandidateServices.getCandidateById(id);
      if (oldCandidate?.foto) {
        const filePath = `${UPLOAD_PATHS.IMAGES}/${oldCandidate.foto}`;
        deleteFile(filePath)
      }
    }

    const candidate = await CandidateServices.updateCandidate(id, nama, visi, misi, fileName);

    if (!candidate) {
      return responseError(res, 'Kandidat tidak ditemukan', httpStatus.NOT_FOUND, undefined);
    }

    return responseSuccess(res, 'Kandidat berhasil diperbarui', httpStatus.OK, {
      ...candidate,
      imageUrl: candidate.foto ? getFileUrl(req, candidate.foto, UPLOAD_PATHS.IMAGES) : null,
    });
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

    if (candidateToDelete.foto) {
      const filePath = `${UPLOAD_PATHS.IMAGES}/${candidateToDelete.foto}`
      deleteFile(filePath);
    }

    return responseSuccess(res, 'Kandidat berhasil dihapus', httpStatus.OK, {
      id: candidate.id,
      nama: candidate.nama,
    });
  } catch (error: any) {
    return responseError(res, error.message, httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};
