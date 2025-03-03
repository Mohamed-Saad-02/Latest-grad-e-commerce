import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const checkDocIsExistById = (model) =>
  catchAsync(async (req, res, next) => {
    const modelName = model.modelName;

    const { [modelName?.toLowerCase()]: id } = req.body;

    if (!id) return next();

    const exist = await model.exists({ _id: id });

    if (!exist) return next(new AppError(`${modelName} not found`, 404));

    next();
  });

export default checkDocIsExistById;
