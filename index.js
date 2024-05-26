import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/userRegisterRoute.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/", router);

MONGODBURL = "mongodb://127.0.0.1:27017/Users";

mongoose
  .connect(MONGODBURL)

  .then(() => {
    console.log("DB connected Successfully");
    app.listen(3000, () => {
      console.log(`Server Running at https://localhost:3000`);
    });
  })
  .catch((error) => console.log(error));
