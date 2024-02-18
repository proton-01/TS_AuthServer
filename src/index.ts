import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { authRouter } from "./routes/authRoutes";
import { privateRouter } from "./routes/privateRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;
const mongoDBUri = process.env.MONGO_URI ?? '';

mongoose.connect(mongoDBUri);
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error...."));
db.once("open", () => { console.log("MongoDB connection successful !!") })


app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use(express.json());
app.use(authRouter);
app.use(privateRouter);


app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});