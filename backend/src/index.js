import express from "express";
import { StatusCodes } from "http-status-codes";
import connectedDb from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "./routes/apiRoutes.js";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(limiter);

app.use("/api", apiRouter);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(StatusCodes.OK).json({ message: "Working successfully" });
});

app.listen(PORT, async () => {
  await connectedDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
