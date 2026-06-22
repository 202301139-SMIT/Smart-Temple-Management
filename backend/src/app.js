import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// Routes
import authRouter from "./routes/auth.routes.js";
import forecastRouter from "./routes/forecast.routes.js";
import staffRouter from "./routes/staff.routes.js";
import actualsRouter from "./routes/actuals.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/forecast", forecastRouter);
app.use("/api/v1/staff", staffRouter);
app.use("/api/v1/actuals", actualsRouter);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TTD Backend Running Successfully",
  });
});

export default app;