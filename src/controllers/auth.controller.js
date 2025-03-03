import User from "../models/User.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { generateToken } from "../utils/helper.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// @desc    Signup User
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = catchAsync(async (req, res, next) => {
  // 1. Check if user already exists
  const existingUser = await User.exists({ email: req.body.email });
  if (existingUser) return next(new AppError("Email already exists", 400));

  // 2. Create new user
  await User.create(req.body);

  // 3. Send response
  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });
});

// @desc    Signin User
// @route   POST /api/v1/auth/signin
// @access  Public
export const signin = catchAsync(async (req, res, next) => {
  // 1. Check if user exists and password is correct
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user || !(await user.correctPassword(req.body.password, user.password)))
    return next(new AppError("Invalid email or password", 401));

  const { _id, photo, name, email } = user;

  // 2. Generate token
  const access_token = generateToken(
    { _id, photo, name, email },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
    { jwtid: uuidv4() }
  );
  const refresh_token = generateToken(
    { _id },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN,
    { jwtid: uuidv4() }
  );

  // 3. Send response
  res.status(200).json({
    status: "success",
    access_token,
    refresh_token,
  });
});

// @desc    Refresh Token
// @route   POST /api/v1/auth/refresh-token
// @access  Private
export const refreshToken = catchAsync(async (req, res, next) => {
  // 1. Check if refresh token is valid
  let token;

  // Check if token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) return next(new AppError("invalid token", 401));

  // Verify Refresh token
  const { _id, iat, photo, name, email } = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET
  );

  // Check if user still exists
  const currentUser = await User.findById(_id);
  if (!currentUser) return next(new AppError("User probably not exist", 401));

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(iat)) {
    return next(
      new AppError("User recently changed password! Please login again", 401)
    );
  }

  // Generate new tokens
  const access_token = generateToken(
    { _id, photo, name, email },
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN,
    { jwtid: uuidv4() }
  );
  const refresh_token = generateToken(
    { _id },
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN,
    { jwtid: uuidv4() }
  );

  res.status(200).json({
    status: "success",
    access_token,
    refresh_token,
  });
});

// @desc    Reset Password
// @route   POST /api/v1/auth/reset-password
// @access  Private
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Check if user exists and password is correct
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) return next(new AppError("User not found", 404));

  // 2. If so, update password
  user.password = req.body.password;
  await user.save();

  // 3. Send response
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
});
