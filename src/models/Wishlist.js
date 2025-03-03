import mongoose, { Schema } from "mongoose";

const wishlistSchema = new Schema(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        unique: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      select: false,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.pre("findOne", function (next) {
  this.populate({
    path: "items",
    select: "name price images quantity",
  });
  next();
});

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
