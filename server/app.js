import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
// connectDB
import "./connectDB.js";

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.SECRET,
});

// middlewares
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// routers
import productRouter from "./controllers/product/index.js";
import userRouter from "./controllers/user/index.js";
import orderRouter from "./controllers/order/index.js";
import paymentRouter from "./controllers/payment/index.js";

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentRouter);

const server = app.listen(port, (req, res) => {
  console.log("Server started at port ", port);
});
