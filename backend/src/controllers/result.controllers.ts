import { Request, Response } from 'express';
import * as voteResultService from '../services/result.services';
import httpStatus from '../lib/httpStatus';
import { responseSuccess, responseError } from '../utils/responseTemplate';

export const getResults = async (_req: Request, res: Response) => {
  try {
    const results = await voteResultService.getVoteResults();
    return responseSuccess(res, 'Vote results fetched', httpStatus.OK, results);
  } catch (err) {
    console.error(err);
    return responseError(res, 'Server error', httpStatus.INTERNAL_SERVER_ERROR, undefined);
  }
};
