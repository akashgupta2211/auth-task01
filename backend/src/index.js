import express from "express";
import { StatusCodes } from "http-status-codes";
import connectedDb from "./config/dbConfig.js";
import { PORT } from "./config/serverConfig.js";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  return res.status(StatusCodes.OK).json({ message: " working successfully" });
});
app.listen(PORT, async () => {
  await connectedDb();
  console.log(`Server is running on http://localhost:${PORT}`);
});
