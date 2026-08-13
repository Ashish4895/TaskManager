import express, { Express } from "express";
import authRoutes from "./routes/auth.route";
import todoRoutes from "./routes/todo.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware";


const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/todo",todoRoutes);
 
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server running on PORT:"+PORT);
    connectDB();
})

