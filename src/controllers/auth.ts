import { Request, Response } from "express";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";
import config from "../config";
import {
  SignupRequestBody,
  BaseResponse,
  SigninResponse,
  SigninRequestBody,
  refreshTokenRequestBody,
} from "../interfaces/auth";

export async function signup(
  req: Request<{}, BaseResponse, SignupRequestBody>,
  res: Response<BaseResponse>,
) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res
      .status(400)
      .json({ message: "All fields (name, email, password) are required." });
    return;
  }

  if (!EmailValidator.validate(email)) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email is already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.salt_rounds_for_hashing,
    );
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error registering user" });
  }
}

export async function signin(
  req: Request<{}, SigninResponse, SigninRequestBody>,
  res: Response<BaseResponse | SigninResponse>,
) {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: "All fields (email, password) are required." });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });

    const refreshToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: config.refreshTokenExpiration,
    });

    res.status(200).json({
      message: "Signin successful",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error signing in" });
  }
}

export async function refreshToken(
  req: Request<{}, SigninResponse, refreshTokenRequestBody>,
  res: Response<BaseResponse | SigninResponse>,
) {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    res.status(401).json({ message: "Refresh token required" });
    return;
  }

  try {
    const payload: any = jwt.verify(refresh_token, config.jwtSecret);
    const accessToken = jwt.sign({ id: payload.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiration,
    });
    const newRefreshToken = jwt.sign({ id: payload.id }, config.jwtSecret, {
      expiresIn: config.refreshTokenExpiration,
    });

    res.status(200).json({
      message: "Tokens refreshed successfully",
      access_token: accessToken,
      refresh_token: newRefreshToken,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
}
