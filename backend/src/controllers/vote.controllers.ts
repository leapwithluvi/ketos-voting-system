import { Request, Response } from 'express';
import httpStatus from '../lib/httpStatus';
import * as VoteService from '../services/vote.services';
import * as voteResultService from '../services/result.services';
import { responseSuccess, responseError } from '../utils/responseTemplate';

export const voteCandidate = async (req: Request, res: Response) => {
  try {
    const { userId, candidateId } = req.body as { userId: string; candidateId: string };

    const hasVoted = await VoteService.checkUserVoted(userId);
    if (hasVoted) {
      return responseError(res, 'User sudah vote', httpStatus.BAD_REQUEST, undefined);
    }

    const vote = await VoteService.createVote(userId, candidateId);

    // Update VoteResult real-time
    await voteResultService.updateCandidateVoteCount(candidateId);

    return responseSuccess(res, 'Vote berhasil', httpStatus.OK, vote);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const getAllVotesAdmin = async (_req: Request, res: Response) => {
  try {
    const votes = await VoteService.getAllVotes();
    return responseSuccess(res, 'Semua vote berhasil diambil', httpStatus.OK, votes);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const getVoteByIdAdmin = async (req: Request, res: Response) => {
  try {
    const voteId = req.params.id;
    const vote = await VoteService.getVoteById(voteId);

    if (!vote) {
      return responseError(res, 'Vote tidak ditemukan', httpStatus.NOT_FOUND, undefined);
    }

    return responseSuccess(res, 'Vote berhasil diambil', httpStatus.OK, vote);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};

export const deleteVoteAdmin = async (req: Request, res: Response) => {
  try {
    const voteId = req.params.id;
    const deletedVote = await VoteService.deleteVote(voteId);

    if (!deletedVote) {
      return responseError(res, 'Vote tidak ditemukan', httpStatus.NOT_FOUND, undefined);
    }

    // Update VoteResult real-time
    await voteResultService.updateCandidateVoteCount(deletedVote.candidate_id);

    return responseSuccess(res, 'Vote berhasil dihapus', httpStatus.OK, deletedVote);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};
