import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

// middlewares
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  return res.send("hii");
});

export { app }; // ✅ named export
