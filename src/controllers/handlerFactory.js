import catchAsync from "./../utils/catchAsync.js";
import AppError from "./../utils/appError.js";
import APIFeatures from "./../utils/apiFeatures.js";
import Product from "../models/Product.js";

export function deleteOne(Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID", 404));

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

export function dropCollection(Model) {
  return catchAsync(async (req, res, next) => {
    await Model.collection.drop();

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

export function updateOne(Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const modelName = Model.modelName;

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });
}

export function createOne(Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    const modelName = Model.modelName;

    if (!doc) return next(new AppError(`Failed to create ${modelName}`, 400));

    res.status(201).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });
}

export function getOne(Model, popOptions) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    const modelName = Model.modelName;

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        [modelName]: doc,
      },
    });
  });
}

export function getAll(Model, excludedFields = [], searchField = "") {
  return catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) filter = req.filterObj;

    const documentsCount = await Model.countDocuments(filter);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter(excludedFields)
      .search(searchField)
      .sort()
      .limitFields()
      .paginate(documentsCount);
    const doc = await features.query;

    const modelName = Model.modelName + "s";

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      metadata: {
        limit: features.metadata.limit,
        results: doc.length,
        total: documentsCount,
        page: features.metadata.page,
        totalPages: features.metadata.totalPages,
      },
      data: {
        [modelName]: doc,
      },
    });
  });
}
