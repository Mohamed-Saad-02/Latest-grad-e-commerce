import { static as static_ } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRouter from "./authRoute.js";
import brandRouter from "./brandRoute.js";
import categoryRouter from "./categoryRoute.js";
import productRouter from "./productRoute.js";
import subCategoryRoute from "./subCategoryRoute.js";
import userRouter from "./userRoute.js";
import wishlistRouter from "./wishlistRoute.js";
import orderRouter from "./orderRoute.js";
import promoCodeRouter from "./promoCodeRoute.js";
import saleRouter from "./saleRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mountRoutes = (app) => {
  app.use("/assets", static_(path.resolve(__dirname, "../../assets")));

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/sale", saleRouter);
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/orders", orderRouter);
  app.use("/api/v1/promoCodes", promoCodeRouter);
};

export default mountRoutes;
