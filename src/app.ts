import express, { Request, Response } from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import config from "./config";

const app = express();
const PORT = config.port;

app.use(express.json());

app.use("/", authRouter);

mongoose
  .connect(process.env.MONGO_URI as string, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});
