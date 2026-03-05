import OpenAI from "openai";
import { AIFeedback, AIFeedbackSchema } from "./ai.type";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateInterviewQuestions = async (
    role: string,
    interviewType: "TECHNICAL" | "BEHAVIORAL" | "MIXED" = "TECHNICAL"
): Promise<string[]> => {
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
            {
                role: "system",
                content:
                    "You are an interviewer. Generate 5 concise interview questions.",
            },
            {
                role: "user",
                content: `Generate 5 ${interviewType.toLowerCase()} interview questions for a ${role} position. Return them as a numbered list.`,
            },
        ],
        temperature: 0.7,
    });

    const text = response.choices[0].message.content || "";

    // Simple parsing into array
    const questions = text
        .split("\n")
        .map((q) => q.replace(/^\d+[\).\s-]*/, "").trim())
        .filter(Boolean);

    return questions;
};

export const generateFeedback = async (
    question: string,
    answer: string
): Promise<AIFeedback> => {
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content:
                    "You are an expert technical interviewer. Provide structured feedback with score (0-10), strengths, and improvements.",
            },
            {
                role: "user",
                content: `
Question: ${question}

Answer: ${answer}

Return JSON in this exact format:

{
  "score": number (0-10),
  "strengths": "string",
  "improvements": "string"
}
`,
            },
        ],
        temperature: 0.4,
    });

    const raw = JSON.parse(response.choices[0].message.content!);

    // Runtime validation
    const parsed = AIFeedbackSchema.parse(raw);

    return parsed;
};
