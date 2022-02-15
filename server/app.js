import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
// connectDB
import "./connectDB.js";

// routers
import productRouter from "./controllers/product/index.js";
import userRouter from "./controllers/user/index.js";
// middlewares
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);

const server = app.listen(port, (req, res) => {
  console.log("Server started at port ", port);
});
