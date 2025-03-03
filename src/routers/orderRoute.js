import { Router } from "express";
import {
  addOrder,
  deleteOrder,
  getAllOrders,
  getOrdersUsers,
} from "../controllers/order.controller.js";
import protect from "../middlewares/protect.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { Roles_Enum } from "../constants/constants.js";
import validateSchema from "../middlewares/validateSchema.js";
import { addOrderSchema } from "../validators/order.validator.js";

const orderRouter = Router();

orderRouter
  .route("/me")
  .get(protect, authorizeRole(Roles_Enum.USER), getOrdersUsers)
  .post(
    validateSchema(addOrderSchema),
    protect,
    authorizeRole(Roles_Enum.USER),
    addOrder
  );

orderRouter
  .route("/me/:id")
  .delete(protect, authorizeRole(Roles_Enum.USER), deleteOrder);

// ------ Admin -------
orderRouter
  .route("/")
  .get(protect, authorizeRole(Roles_Enum.ADMIN), getAllOrders);

export default orderRouter;
