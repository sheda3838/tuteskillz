import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import MySQLStore from "express-mysql-session";
import session from "express-session";
import userRouter from "./routes/user.route.js";
import studentRouter from "./routes/student.route.js";
import subjectRouter from "./routes/subject.route.js";
import tutorRouter from "./routes/tutor.route.js";
import adminRouter from "./routes/admin.route.js";
import profileRouter from "./routes/profile.route.js";
import sessionRouter from "./routes/session.route.js";
import paymentRouter from "./routes/payment.route.js";
import notesRouter from "./routes/notes.route.js";
import feedbackRouter from "./routes/feedback.route.js";
import setupSessionCron from "./jobs/session.cron.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // your local frontend
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// app.set("trust proxy", true);

const MySQLSessionStore = MySQLStore(session);
const sessionStore = new MySQLSessionStore({}, db.promise());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: false, // MUST be false on localhost
      httpOnly: true,
      sameSite: "lax", // local dev should NOT be "none"
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api", userRouter);
app.use("/api/student", studentRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);
app.use("/api/session", sessionRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/notes", notesRouter);
app.use("/api/feedback", feedbackRouter);

// Start Cron Jobs
setupSessionCron();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// Trigger restart

app.get("/", (req, res) => {
  res.send("Backend is running!");
});
