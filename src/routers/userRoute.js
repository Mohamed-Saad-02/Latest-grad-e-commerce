import express from "express";
import {
  changePassword,
  getUser,
  createUser,
  getAllUsers,
  updateRole,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
} from "../controllers/user.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import protect from "../middlewares/protect.js";
import validateSchema from "../middlewares/validateSchema.js";
import {
  changePasswordSchema,
  createUserSchema,
  deleteMeSchema,
  updateMeSchema,
  updateRoleSchema,
} from "../validators/user.validator.js";
import { ImageExtinction, Roles_Enum } from "../constants/constants.js";
import { multerMiddleware } from "../middlewares/multer.middleware.js";
import addFieldMulterToBody from "../middlewares/addFieldMulterToBody.js";

const userRouter = express.Router();

// current user
userRouter
  .route("/me")
  .get(protect, getMe)
  .put(
    protect,
    multerMiddleware("users", ImageExtinction).single("photo"),
    validateSchema(updateMeSchema),
    addFieldMulterToBody("photo"),
    updateMe
  )
  .delete(protect, validateSchema(deleteMeSchema), deleteMe);

userRouter.post(
  "/change-password",
  validateSchema(changePasswordSchema),
  protect,
  changePassword
);

userRouter
  .route("/")
  .get(protect, authorizeRole(Roles_Enum.ADMIN), getAllUsers)
  .post(
    validateSchema(createUserSchema),
    protect,
    authorizeRole(Roles_Enum.ADMIN),
    createUser
  );

// Update Role of user
userRouter.put(
  "/update-role/:id",
  validateSchema(updateRoleSchema),
  protect,
  authorizeRole(Roles_Enum.ADMIN),
  updateRole
);

userRouter
  .route("/:id")
  .get(protect, authorizeRole(Roles_Enum.ADMIN), getUser)
  .delete(protect, authorizeRole(Roles_Enum.ADMIN), deleteUser);

export default userRouter;
