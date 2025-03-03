import Joi from "joi";
import { Roles_Enum } from "../constants/constants.js";

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const createUserSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  photo: Joi.string().optional(),
  role: Joi.string()
    .valid(Roles_Enum.ADMIN, Roles_Enum.USER)
    .required()
    .messages({
      "any.only": "Role must be either 'admin' or 'user'",
      "string.empty": "Role is required",
      "any.required": "Role is required",
    }),
});

export const updateMeSchema = Joi.object({
  name: Joi.string().trim().optional(),
  email: Joi.string().email().trim().optional(),
  photo: Joi.string().optional(),
});

export const deleteMeSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid(Roles_Enum.ADMIN, Roles_Enum.USER)
    .required()
    .messages({
      "any.only": "Role must be either 'admin' or 'user'",
      "string.empty": "Role is required",
      "any.required": "Role is required",
    }),
});
