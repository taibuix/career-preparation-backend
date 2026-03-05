import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { addFeedback, addQuestion, createSession, getAnalytics, submitAnswer } from "./interview.controller";
import { aiRateLimiter } from "../../middleware/rateLimit.middleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/interviews:
 *   post:
 *     summary: Create a new session
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInterviewSession'
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
*               allOf:
 *               - $ref: '#/components/schemas/ApiResponseOnSuccess'
 *               - type: object
 *                 properties:
 *                  data:
 *                    $ref: '#/components/schemas/InterviewSession'
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *              allOf:   
 *               - $ref: '#/components/schemas/ApiResponseOnError'
 * 
 *       403:
 *         description: Forbidden
 */
router.post("/", createSession);

/**
 * @swagger
 * /api/interviews:
 *   get:
 *     summary: Get all interview analytics for a user
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get("/analytics", getAnalytics);
/**
 * @swagger
 * /api/interviews/{sessionId}/questions:
 *   post:
 *     summary: Add new interview questions to a session
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Session ID
 *     responses:
 *       200:
 *         description: Questions added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/:sessionId/questions", aiRateLimiter, addQuestion);
/**
 * @swagger
 * /api/interviews/questions/{questionId}/answer:
 *   post:
 *     summary: Submit an answer to an interview question
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content: 
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      answer: 
 *                        type: string
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview question ID
 *     
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.post("/questions/:questionId/answer", submitAnswer);
/**
 * @swagger
 * /api/interviews/answers/{answerId}/feedback:
 *   post:
 *     summary: Submit feedback for an answer to an interview question
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content: 
 *          application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                      score: 
 *                        type: number
 *                        format: float
 *                      strengths: 
 *                        type: string
 *                      improvements: 
 *                       type: string
 *     parameters:
 *       - in: path
 *         name: answerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     responses:
 *       200:
 *         description: Feedback submitted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post("/answers/:answerId/feedback", addFeedback);
export default router;
