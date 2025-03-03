import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category Required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    image: String,
    content: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

// Get SubCategory that belong to category
categorySchema.virtual("subCategory", {
  ref: "SubCategory",
  foreignField: "category",
  localField: "_id",
});

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
