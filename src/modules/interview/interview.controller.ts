import { Response, NextFunction } from "express";
import { AuthRequest } from "../../types/express";
import * as InterviewService from "./interview.service";

export const createSession = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const { role, resumeId, interviewType } = req.body;

        const session = await InterviewService.createSession(
            userId,
            role,
            resumeId,
            interviewType
        );

        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
};

export const addQuestion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const sessionId = req.params.sessionId as string;
        const { question } = req.body;

        const createdQuestion = await InterviewService.addQuestion(
            userId,
            sessionId,
            question
        );

        res.status(201).json(createdQuestion);
    } catch (error) {
        next(error);
    }
};

export const submitAnswer = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const questionId = req.params.questionId as string;
        const { answer } = req.body;

        const createdAnswer = await InterviewService.submitAnswer(
            userId,
            questionId,
            answer
        );

        res.status(201).json(createdAnswer);
    } catch (error) {
        next(error);
    }
};

export const addFeedback = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user!.id;
        const answerId = req.params.answerId as string;
        const { score, strengths, improvements } = req.body;

        const feedback = await InterviewService.addFeedback(
            userId,
            answerId,
            score,
            strengths,
            improvements
        );

        res.status(201).json(feedback);
    } catch (error) {
        next(error);
    }
};
export const getAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const analytics = await InterviewService.getInterviewAnalytics(
      userId
    );

    res.json(analytics);
  } catch (error) {
    next(error);
  }
};
