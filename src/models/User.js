import mongoose, { Schema, model } from "mongoose";
import { hash, compare } from "bcryptjs";
import { Roles_Enum } from "../constants/constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(Roles_Enum),
      default: Roles_Enum.USER,
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 8 characters"],
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();

  this.password = await hash(this.password, Number(process.env.SALT_ROUNDS));
  this.passwordChangedAt = Date.now();

  next();
});

// Method to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await compare(candidatePassword, userPassword);
};

// Method to check if user changed password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.models.User || model("User", userSchema);

export default User;
