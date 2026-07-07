import { Request, Response } from "express";
import deviceService from "../../services/device/device.service";

export const getDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");

    const devices = await deviceService.getDevices({
      page,
      limit,
      search,
    });

    res.status(200).json({
      success: true,
      ...devices,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch devices",
    });
  }
};

export const getDeviceById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device = await deviceService.getDeviceById(
      req.params.id
    );

    if (!device) {
      res.status(404).json({
        success: false,
        message: "Device not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: device,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch device",
    });
  }
};

export const getUserDevices = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const devices =
      await deviceService.getUserDevices(
        req.params.userId
      );

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user devices",
    });
  }
};

export const blockDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device =
      await deviceService.blockDevice(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Device blocked successfully",
      data: device,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to block device",
    });
  }
};

export const unblockDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const device =
      await deviceService.unblockDevice(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Device unblocked successfully",
      data: device,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to unblock device",
    });
  }
};

export const deleteDevice = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await deviceService.deleteDevice(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Device removed successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to remove device",
    });
  }
};

export const getDeviceAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await deviceService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};