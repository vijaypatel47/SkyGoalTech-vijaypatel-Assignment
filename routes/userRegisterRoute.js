import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRegister } from "../models/userRegisterModel.js";

const router = express.Router();

//Signup API
router.post("/signup", async (request, response) => {
  const { username, password } = request.body;
  try {
    if (!username || !password) {
      return response
        .status(400)
        .send({ message: "Send All Required Fields: username and password" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username: username,
      password: hashedPassword,
    };
    const user = await UserRegister.create(newUser);
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

//Login API

router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  try {
    if (!username || !password) {
      return response
        .status(400)
        .send({ message: "username and password are required" });
    }

    const userDetails = await UserRegister.findOne({
      username: username,
    });
    if (userDetails === null) {
      response.status(400);
      response.send("Invalid User");
    } else {
      const isPasswordMatched = await bcrypt.compare(
        password,
        userDetails.password
      );

      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = await jwt.sign(payload, "MY_SECRET_TOKEN");
        response.status(200).send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    }
  } catch (err) {
    console.log(err.message);
    response.status(500).send(err.message);
  }
});

// MiddleWear function for authentication

function authenticateToken(request, response, next) {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        next();
      }
    });
  }
}

// USerDetails API

router.get("/userDetails", authenticateToken, async (request, response) => {
  const { userId } = request.user._id;
  const userDetails = await UserRegister.findOne({ _id: userId });
  if (userDetails === null) {
    response.status(400);
    response.send("Invalid UserId");
  } else {
    response.send(user);
  }
});

export default router;
