import { Request, Response } from "express";
import pincodeService from "../../services/pincode/pincode.service";

export const searchPincodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = String(req.query.q ?? "").trim();
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    if (q.length < 2) {
      res.status(400).json({ success: false, message: "Search query must contain at least 2 characters." });
      return;
    }
    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100) {
      res.status(400).json({ success: false, message: "Invalid page or limit. Limit must be between 1 and 100." });
      return;
    }

    const result = await pincodeService.search(q, page, limit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("[PINCODE_SEARCH_ERROR]", error);
    res.status(500).json({ success: false, message: "Failed to search pincodes." });
  }
};

export const getPincodeDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const pincode = String(req.params.pincode ?? "").trim();
    if (!/^\d{6}$/.test(pincode)) {
      res.status(400).json({ success: false, message: "Enter a valid 6-digit Indian PIN code." });
      return;
    }

    const data = await pincodeService.getByPincode(pincode);
    if (data.length === 0) {
      res.status(404).json({ success: false, message: "No PIN code records found." });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("[PINCODE_DETAILS_ERROR]", error);
    res.status(500).json({ success: false, message: "Failed to fetch pincode details." });
  }
};
