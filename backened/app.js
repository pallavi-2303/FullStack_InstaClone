import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/user.route.js"
import messageRouter from "./routes/message.route.js"
import postRouter from "./routes/post.route.js"
import { app,server } from "./socket/socket.js";
import path from "path";
dotenv.config();
const __dirname=path.resolve();
console.log(__dirname)
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}))
//rM81Tx6lV9jfBB74
const corsOptions={
    origin:process.env.URL || 'http://localhost:5175',
    credentials:true
}
app.use(cors(corsOptions));
app.use("/api/v1/user",UserRouter);
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/post",postRouter);
app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"));
})
const PORT=process.env.PORT || 8080;
server.listen(PORT,()=>{
    console.log(`Server listen on http://localhost:${PORT}`);
})