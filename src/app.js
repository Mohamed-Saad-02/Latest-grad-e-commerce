import express from "express";
import morgan from "morgan";
import mountRoutes from "./routers/index.js";
import AppError from "./utils/appError.js";
import globalError from "./middlewares/globalError.js";

const app = express();

// 1) MIDDLEWARE
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

// 2) ROUTES
mountRoutes(app);

app.all("*", (req, res, next) =>
  next(new AppError(`Can't Find this route: ${req.originalUrl}`, 400))
);

// Handle Global Error
app.use(globalError);

export default app;
