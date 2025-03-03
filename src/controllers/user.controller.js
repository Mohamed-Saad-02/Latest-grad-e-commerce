import User from "../models/User.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as factory from "./handlerFactory.js";

// ------------------------
// --------- User ---------
// ------------------------
// @desc    Get User
// @route   POST /api/v1/users/me
// @access  Private
export const getMe = catchAsync(async (req, res, next) => {
  const { _id, photo, name, email } = req.user;
  res.status(200).json({
    status: "success",
    data: {
      user: {
        _id,
        photo,
        name,
        email,
      },
    },
  });
});

// @desc    Update User
// @route   PUT /api/v1/users/me
// @access  Private
export const updateMe = factory.updateOne(User);

// @desc    Delete User
// @route   DELETE /api/v1/users/me
// @access  Private
export const deleteMe = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  // Get User from db
  const user = await User.findById(_id);
  const { password } = req.body;

  // Compare password
  if (!(await user.correctPassword(password, user.password)))
    return next(new AppError("Invalid password", 401));

  // Delete User
  await User.findByIdAndDelete(_id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// ------------------------
// -------- Admin ---------
// ------------------------
// @desc    Change Password
// @route   POST /api/v1/users/change-password
// @access  Private
export const changePassword = catchAsync(async (req, res, next) => {
  // 1. Get user from collection
  const { _id } = req.user;
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(_id).select("+password");

  // 2. Check if user exists and password is correct
  if (!user || !(await user.correctPassword(oldPassword, user.password)))
    return next(new AppError("Invalid email or password", 401));

  // 3. If so, update password
  user.password = newPassword;
  await user.save();

  // 4. Send response
  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
export const getAllUsers = catchAsync(async (req, res, next) => {
  const documentsCount = await User.countDocuments();

  const features = new APIFeatures(User.find(), req.query)
    .limitFields()
    .paginate(documentsCount);

  const users = await features.query;

  res.status(200).json({
    status: "success",
    results: users.length,
    metadata: features.metadata,
    data: {
      users,
    },
  });
});

// @desc    Get User
// @route   GET /api/v1/users/:id
// @access  Private
export const getUser = factory.getOne(User);

// @desc    Create user
// @route   Post /api/v1/users
// @access  Private
export const createUser = factory.createOne(User);

// @desc    Update Role
// @route   POST /api/v1/users/update-role/:id
// @access  Private
export const updateRole = factory.updateOne(User);

// @desc    Delete User
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = factory.deleteOne(User);
