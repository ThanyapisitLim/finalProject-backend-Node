import express, { Request, Response, NextFunction } from "express";
import http, { get } from "http";
import path from 'path';
import { connectDB } from "./config/db";
import createUsersRouter from "./router/user/createUsers";
import getUsersRouter from "./router/user/getUsers";
import loginRouter from "./router/user/login";
import createPollRouter from "./router/poll/createPoll";
import voteRouter from "./router/vote/vote";
import getPollsRouter from "./router/poll/getPolls";
import getVotesByPollRouter from "./router/vote/getVoteByPoll";
import getVotesByUserRouter from "./router/vote/getVoteByUser";
import getPollsByUserRouter from "./router/poll/getPollByUser";
import getExpPollRouter from "./router/poll/getExpPoll";
import getAllVoteRouter from "./router/vote/getAllVote";
import visualizationRouter from "./router/visualizationRoute";

const app = express();
const port = process.env.PORT;

// --- 1. MIDDLEWARE SETUP ---

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. ROUTER SETUP ---
//User Routers
app.use("/create-user",createUsersRouter );
app.use("/login", loginRouter)
//Poll Routers
app.use("/create-poll", createPollRouter);
app.use("/vote", voteRouter); // 👈 เพิ่ม Vote Router
//Get Routers
app.use("/get-user", getUsersRouter );
app.use("/get-polls", getPollsRouter);
app.use("/get-votes-by-poll", getVotesByPollRouter);
app.use("/get-votes-by-user", getVotesByUserRouter);
app.use("/get-polls-by-user", getPollsByUserRouter);
app.use("/get-exp-polls", getExpPollRouter);
app.use("/get-all-votes", getAllVoteRouter);
app.use("/delete-poll", require("./router/poll/deletePoll").default); // 👈 เพิ่ม Delete Poll Router
app.use("/visualization/all", visualizationRouter); // 👈 URL สำหรับแสดงผลโหวต
// --- 3. ERROR HANDLERS ---

app.use((req: Request, res: Response, next: NextFunction) => {
  const error: any = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
});

// --- 4. SERVER STARTUP ---

async function startServer() {
  try {
    // ✅ เชื่อมต่อ MongoDB ก่อน
    await connectDB();

    // ✅ แล้วค่อย start server
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`🚀 Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;
