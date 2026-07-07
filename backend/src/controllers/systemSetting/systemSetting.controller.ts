import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * GET SYSTEM SETTINGS
 */
export const getSystemSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const settings =
      await prisma.systemSetting.findFirst();

    res.status(200).json({
      success: true,
      data: settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch system settings",
      error,
    });

  }
};

/**
 * UPDATE SYSTEM SETTINGS
 */
export const updateSystemSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const settings =
      await prisma.systemSetting.findFirst();

    if (!settings) {

      res.status(404).json({
        success: false,
        message: "Settings not found",
      });

      return;
    }

    const updated =
      await prisma.systemSetting.update({
        where: {
          id: settings.id,
        },
        data: req.body,
      });

    res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Update failed",
      error,
    });

  }
};

/**
 * TOGGLE MAINTENANCE MODE
 */
export const toggleMaintenanceMode =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const settings =
        await prisma.systemSetting.findFirst();

      if (!settings) {
        res.status(404).json({
          success: false,
          message: "Settings not found",
        });
        return;
      }

      const updated =
        await prisma.systemSetting.update({
          where: {
            id: settings.id,
          },
          data: {
            maintenanceMode:
              !settings.maintenanceMode,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Operation failed",
      });

    }
  };

/**
 * TOGGLE REGISTRATION
 */
export const toggleRegistration =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const settings =
        await prisma.systemSetting.findFirst();

      const updated =
        await prisma.systemSetting.update({
          where: {
            id: settings!.id,
          },
          data: {
            registrationEnabled:
              !settings!.registrationEnabled,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };

/**
 * TOGGLE LOGIN
 */
export const toggleLogin =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const settings =
        await prisma.systemSetting.findFirst();

      const updated =
        await prisma.systemSetting.update({
          where: {
            id: settings!.id,
          },
          data: {
            loginEnabled:
              !settings!.loginEnabled,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };

/**
 * SYSTEM ANALYTICS
 */
export const getSystemAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const [
        totalUsers,
        totalLoans,
        totalSessions,
      ] = await Promise.all([

        prisma.user.count(),

        prisma.loanApplication.count(),

        prisma.session.count({
          where: {
            isActive: true,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalUsers,
          totalLoans,
          activeSessions:
            totalSessions,
        },
      });

    } catch {

      res.status(500).json({
        success: false,
      });

    }
  };