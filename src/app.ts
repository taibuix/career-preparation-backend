import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import resumeRoutes from "./modules/resume/resume.routes";
import interviewRoutes from "./modules/interview/interview.routes";
import { errorHandler } from "./middleware/error.middleware";
import { globalRateLimiter } from "./middleware/rateLimit.middleware";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { debug } from "util";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(globalRateLimiter);
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
} ));

// Import routes
app.get('/', (req, res) => {
    debug('GET / called');
    res.send('API running');
});
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);
export default app;
