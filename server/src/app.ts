import express from "express";
import cors from "cors";
import { json, urlencoded } from "express";
import { authRouter } from "./routes/authRoutes";
import { memberRouter } from "./routes/memberRoutes";
import { attendanceRouter } from "./routes/attendanceRoutes";
import { reportRouter } from "./routes/reportRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
  })
);

app.options("*", cors());

app.use(json());
app.use(urlencoded({ extended: true }));

// Register routes for both `/api/*` and `/*` so they resolve
// whether invoked locally, through proxy, or via Vercel serverless rewrites
const registerRoutes = (prefix: string) => {
  app.get(`${prefix}/health`, (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use(`${prefix}/auth`, authRouter);
  app.use(`${prefix}/members`, memberRouter);
  app.use(`${prefix}/attendance`, attendanceRouter);
  app.use(`${prefix}/reports`, reportRouter);
};

registerRoutes("/api");
registerRoutes("");

app.use(errorHandler);

export default app;
