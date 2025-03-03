import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      minlength: [2, "To short SubCategory name"],
      maxlength: [32, "To long SubCategory name"],
      required: [true, "SubCategory required"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "category required"],
    },
  },
  { timestamps: true }
);

// Make a name at subCategory unique for each category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

subCategorySchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name" });
  next();
});

export default mongoose.model("SubCategory", subCategorySchema);
