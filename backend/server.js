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

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev
      "https://tuteskillz-git-main-sheda3838s-projects.vercel.app",
      "https://tuteskillz-n7yuc3rxw-sheda3838s-projects.vercel.app"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);



app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MySQLSessionStore = MySQLStore(session);
const sessionStore = new MySQLSessionStore({}, db.promise());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use("/api" ,userRouter);
app.use("/api/student", studentRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/tutor", tutorRouter);
app.use("/api/admin", adminRouter);
app.use("/api/profile", profileRouter);
app.use("/api/session", sessionRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});
