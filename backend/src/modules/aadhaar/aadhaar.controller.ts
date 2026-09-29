import { Request, Response } from "express";
import { AadhaarService } from "./aadhaar.service";

/**
 * EXPRESS PARAM HELPER
 */
const getParam = (
  value: string | string[] | undefined
): string => {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
};

/**
 * VERIFY AADHAAR
 */
export const verifyAadhaar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      userId,
      aadhaarNo,
      fullName,
      dob,
    } = req.body;

    if (
      !userId ||
      !aadhaarNo ||
      !fullName ||
      !dob
    ) {
      res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
      return;
    }

    const aadhaarNumber =
      String(aadhaarNo).replace(/\s+/g, "");

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      res.status(400).json({
        success: false,
        message:
          "Aadhaar number must contain exactly 12 digits",
      });
      return;
    }

    const result =
      await AadhaarService.verifyAadhaar({
        userId: String(userId),
        aadhaarNo: aadhaarNumber,
        fullName: String(fullName),
        dob: String(dob),
      });

    res.status(200).json({
      success: true,
      message:
        "Aadhaar submitted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Aadhaar verification failed",
    });
  }
};

/**
 * GET AADHAAR STATUS
 */
export const getAadhaarStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId =
      getParam(req.params.userId);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const result =
      await AadhaarService.getAadhaarStatus(
        userId
      );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message:
        error?.message ||
        "Aadhaar record not found",
    });
  }
};

/**
 * UPDATE AADHAAR
 */
export const updateAadhaar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId =
      getParam(req.params.userId);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const {
      aadhaarNo,
      fullName,
      dob,
    } = req.body;

    const updateData: {
      maskedAadhaar?: string;
      fullName?: string;
      dob?: string;
    } = {};

    if (aadhaarNo !== undefined) {
      const aadhaarNumber =
        String(aadhaarNo).replace(/\s+/g, "");

      if (!/^\d{12}$/.test(aadhaarNumber)) {
        res.status(400).json({
          success: false,
          message:
            "Aadhaar number must contain exactly 12 digits",
        });
        return;
      }

      updateData.maskedAadhaar =
        "XXXXXXXX" +
        aadhaarNumber.slice(-4);
    }

    if (fullName !== undefined) {
      updateData.fullName =
        String(fullName);
    }

    if (dob !== undefined) {
      updateData.dob =
        String(dob);
    }

    if (
      Object.keys(updateData).length === 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "No Aadhaar fields provided for update",
      });
      return;
    }

    const result =
      await AadhaarService.updateAadhaar(
        userId,
        updateData
      );

    res.status(200).json({
      success: true,
      message:
        "Aadhaar details updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to update Aadhaar details",
    });
  }
};

/**
 * DELETE AADHAAR
 */
export const deleteAadhaar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId =
      getParam(req.params.userId);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    await AadhaarService.deleteAadhaar(
      userId
    );

    res.status(200).json({
      success: true,
      message:
        "Aadhaar record deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to delete Aadhaar record",
    });
  }
};