import { Request, Response } from 'express';
import * as voteService from '../services/vote.services';
import httpStatus from '../lib/httpStatus';
import { responseSuccess, responseError } from '../utils/responseTemplate';

export const voteCandidate = async (req: Request, res: Response) => {
  try {
    const { userId, candidateId } = req.body as { userId: string; candidateId: string };

    const hasVoted = await voteService.checkUserVoted(userId);
    if (hasVoted) {
      return responseError(res, 'User sudah vote', httpStatus.BAD_REQUEST, undefined);
    }

    const vote = await voteService.createVote(userId, candidateId);
    return responseSuccess(res, 'Vote berhasil', httpStatus.OK, vote);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};
