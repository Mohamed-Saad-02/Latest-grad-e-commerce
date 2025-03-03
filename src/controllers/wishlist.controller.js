import WishlistModal from "../models/Wishlist.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private/User
export const addWishlist = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { product: productId } = req.body;

  // Find wishlist and create if not exist
  let wishlist = await WishlistModal.findOne({ userId: _id });
  if (!wishlist) wishlist = new WishlistModal({ userId: _id, items: [] });

  // Check if the product is already in the wishlist
  if (wishlist.items.includes(productId))
    return next(new AppError("Product already in wishlist", 404));

  // Add product to wishlist
  wishlist.items.push(productId);

  await wishlist.save();

  res
    .status(200)
    .json({ status: "success", message: "Product added to wishlist" });
});

// @desc    Get list of wishlist
// @route   GET /api/v1/wishlist
// @access  Private/User
export const getWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const wishlist = await WishlistModal.findOne({ userId: id });

  res.status(200).json({
    status: "success",
    items: wishlist?.items || [],
  });
});

// @desc    Update list of wishlist
// @route   PUT /api/v1/wishlist/:id
// @access  Private/User
export const updateWishlist = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const { product } = req.body;

  // Find wishlist and return if not exist
  const wishlist = await WishlistModal.findOne({ userId: _id });
  if (!wishlist) return next(new AppError("Wishlist not found", 404));

  if (wishlist) {
    wishlist.items = wishlist.items.filter((id) => id.toString() !== product);
    await wishlist.save();
  }

  res.status(200).json({
    status: "Success",
  });
});

// @desc    delete list of wishlist
// @route   DELETE /api/v1/wishlist
// @access  Private/User
export const deleteWishlist = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const wishlist = await WishlistModal.findOne({ userId: id });

  wishlist.items = [];

  await wishlist.save();

  res.status(200).json({ status: "Success" });
});
