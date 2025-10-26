import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { connectDB } from "./config/db"; // 👈 นำเข้า connectDB
import createUsersRouter from "./router/auth/createUsers"; // 👈 นำเข้า createUsersRouter
import getUsersRouter from "./router/data/getUsers"; // 👈 นำเข้า getUsersRouter
import loginRouter from "./router/auth/login"; // 👈 นำเข้า loginRouter


const app = express();
const port = process.env.PORT;

// --- 1. MIDDLEWARE SETUP ---

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- 2. ROUTER SETUP ---
app.use("/create-users",createUsersRouter );
app.use("/login", loginRouter)
app.use("/get-users", getUsersRouter );

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
