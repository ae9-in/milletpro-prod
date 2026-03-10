import express from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getReadModel } from "../config/db.js";

const router = express.Router();

router.get(
  "/contact",
  asyncHandler(async (_req, res) => {
    const SiteContentRead = getReadModel("SiteContent");
    const siteContent = await SiteContentRead.findOne({ key: "default" }).lean();

    if (!siteContent) {
      return res.status(404).json({ message: "Site content not found." });
    }

    res.json({
      contactCards: siteContent.contactCards,
      supportWindow: {
        title: siteContent.supportWindowTitle,
        heading: siteContent.supportWindowHeading,
        description: siteContent.supportWindowDescription,
      },
    });
  }),
);

export default router;
