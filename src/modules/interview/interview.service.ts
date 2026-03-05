import prisma from "../../config/prisma";
import { generateFeedback, generateInterviewQuestions } from "../ai/ai.service";
import { AIFeedback } from "../ai/ai.type";

const ALLOWED_INTERVIEW_TYPES = ["TECHNICAL", "BEHAVIORAL", "MIXED"] as const;
type InterviewType = (typeof ALLOWED_INTERVIEW_TYPES)[number];

const normalizeInterviewType = (
    interviewType?: string
): InterviewType | undefined => {
    if (!interviewType) return undefined;
    const normalizedType = interviewType.trim().toUpperCase();
    return ALLOWED_INTERVIEW_TYPES.includes(normalizedType as InterviewType)
        ? (normalizedType as InterviewType)
        : undefined;
};

export const createSession = async (
    userId: string,
    role: string,
    resumeId?: string,
    interviewType?: string
) => {
    const normalizedInterviewType = normalizeInterviewType(interviewType);
    const session = await prisma.interviewSession.create({
        data: {
            userId,
            role,
            resumeId: resumeId || null,
            interviewType: normalizedInterviewType,
        },
        include: {
            questions: true,
        },
    });

    // Generate AI questions
    const questions = await generateInterviewQuestions(
        role,
        normalizedInterviewType || "TECHNICAL"
    );

    for (const question of questions) {
        await prisma.interviewQuestion.create({
            data: {
                sessionId: session.id,
                question,
            },
        });
    }
    session.questions = questions.map((q) => ({ id: "", sessionId: session.id, question: q, answers: [] }));
    return { session };
};

export const addQuestion = async (
    userId: string,
    sessionId: string,
    question: string
) => {
    const session = await prisma.interviewSession.findFirst({
        where: {
            id: sessionId,
            userId,
        },
    });

    if (!session) {
        throw new Error("Session not found or unauthorized");
    }

    return prisma.interviewQuestion.create({
        data: {
            sessionId,
            question,
        },
    });
};

export const submitAnswer = async (
    userId: string,
    questionId: string,
    answer: string
) => {

    const createdAnswer = await prisma.interviewAnswer.create({
        data: {
            questionId,
            answer,
        },
    });
    const fullQuestion = await prisma.interviewQuestion.findUnique({
        where: { id: questionId },
    });

    const aiFeedback: AIFeedback = await generateFeedback(
        fullQuestion!.question,
        answer
    );
    await prisma.answerFeedback.create({
        data: {
            answerId: createdAnswer.id,
            score: aiFeedback.score,
            strengths: aiFeedback.strengths || "",
            improvements: aiFeedback.improvements || "",
        },
    });
    await finalizeSessionIfComplete(fullQuestion!.sessionId);

};

export const addFeedback = async (
    userId: string,
    answerId: string,
    score: number,
    strengths: string,
    improvements: string
) => {
    const answer = await prisma.interviewAnswer.findFirst({
        where: {
            id: answerId,
            question: {
                session: {
                    userId,
                },
            },
        },
    });

    if (!answer) {
        throw new Error("Answer not found or unauthorized");
    }

    return prisma.answerFeedback.create({
        data: {
            answerId,
            score,
            strengths,
            improvements,
        },
    });
};

const finalizeSessionIfComplete = async (sessionId: string) => {
    const questions = await prisma.interviewQuestion.findMany({
        where: { sessionId },
        include: {
            answers: {
                include: {
                    feedback: true,
                },
            },
        },
    });

    // Check if every question has at least one answer with feedback
    const allAnswered = questions.every((q) =>
        q.answers.some((a) => a.feedback)
    );

    if (!allAnswered) return;

    // Collect all feedback scores
    const scores = questions.flatMap((q) =>
        q.answers
            .filter((a) => a.feedback)
            .map((a) => a.feedback!.score)
    );

    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
            status: "COMPLETED",
            overallScore: avgScore,
            completedAt: new Date(),
        },
    });
};

export const getInterviewAnalytics = async (userId: string) => {
    const sessions = await prisma.interviewSession.findMany({
        where: {
            userId,
            status: "COMPLETED",
        },
        orderBy: {
            completedAt: "asc",
        },
    });

    if (sessions.length === 0) {
        return {
            totalSessions: 0,
            completedSessions: 0,
            averageScore: 0,
            bestScore: 0,
            worstScore: 0,
            recentTrend: [],
        };
    }

    const scores = sessions
        .map((s) => s.overallScore)
        .filter((score): score is number => score !== null);

    const totalSessions = sessions.length;

    const averageScore =
        scores.reduce((sum, score) => sum + score, 0) / scores.length;

    const bestScore = Math.max(...scores);
    const worstScore = Math.min(...scores);

    const recentTrend = sessions.map((s) => ({
        date: s.completedAt,
        score: s.overallScore,
    }));

    return {
        totalSessions,
        completedSessions: totalSessions,
        averageScore,
        bestScore,
        worstScore,
        recentTrend,
    };
};
