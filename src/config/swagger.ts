import swaggerJsdoc from "swagger-jsdoc";
import { SessionStatus } from "../generated/prisma/browser";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Career Prep API",
            version: "1.0.0",
            description: "API documentation for Career Prep Backend",
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                CreateInterviewSession: {
                    type: "object",
                    required: ["role"],
                    properties: {
                        role: {
                            type: "string",
                            example: "Backend Developer",
                        },
                        interviewType: {
                            type: "string",
                            enum: ["TECHNICAL", "BEHAVIORAL", "MIXED"],
                            example: "TECHNICAL",
                        },
                    },
                },
                SubmitAnswer: {
                    type: "object",
                    required: ["answer"],
                    properties: {
                        answer: {
                            type: "string",
                            example: "I would optimize the query using indexing...",
                        },
                    },
                },
                Resume: {
                    type: "object",
                    properties: {
                        title: { type: "string", example: "Software Engineer Resume" },
                    },
                },
                ResumeSection: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        content: { type: "object" },
                        order: { type: "integer" },
                    },
                },
                InterviewSession: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        userId: { type: "string" },
                        role: { type: "string" },
                        interviewType: {
                            type: "string",
                            enum: ["TECHNICAL", "BEHAVIORAL", "MIXED"],
                        },
                        status: { type: "string", enum: SessionStatus },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    id: { type: "string" },
                                    sessionId: { type: "string" },
                                    question: { type: "string" },
                                    answers: { type: "string" }
                                },
                            },
                        },
                    },
                },
                ApiResponseOnSuccess: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: true,
                        },
                        message: {
                            type: "string",
                            example: "Operation successful",
                        },
                        data: {
                            type: "object",
                            nullable: true,
                        },
                    },
                },
                ApiResponseOnError: {
                    type: "object",
                    properties: {
                        success: {
                            type: "boolean",
                            example: false,
                        },
                        message: {
                            type: "string",
                            example: "Operation failed",
                        },
                    },
                },
            },

        },
    },
    apis: ["./src/modules/**/*.ts"], // scans route files
};

export const swaggerSpec = swaggerJsdoc(options);
