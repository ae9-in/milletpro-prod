import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getReadModel } from "../config/db.js";

const router = express.Router();

const categoryLabels = {
  all: "All Products",
  malt: "Malts",
  flour: "Flour",
  snack: "Snacks",
  drink: "Drinks",
};

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const ProductRead = getReadModel("Product");
    const products = await ProductRead.find({ isActive: true }).sort({ sortOrder: 1, createdAt: 1 }).lean();
    const categoryValues = Array.from(new Set(products.map((product) => product.category)));

    res.json({
      products: products.map((product) => ({
        id: product.slug,
        name: product.name,
        description: product.description,
        prices: product.prices,
        image: product.imagePath,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
        isBestSeller: product.isBestSeller,
      })),
      categories: [
        { value: "all", label: categoryLabels.all },
        ...categoryValues.map((value) => ({
          value,
          label: categoryLabels[value] ?? value,
        })),
      ],
    });
  }),
);

export default router;
