import { Request, Response } from "express";
import prisma from "../../config/prisma";

/**
 * GET ALL SETTINGS
 */
export const getAllSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {

    const settings =
      await prisma.setting.findMany({
        orderBy: {
          category: "asc",
        },
      });

    res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error,
    });

  }
};

/**
 * GET SETTINGS BY CATEGORY
 */
export const getSettingsByCategory =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const settings =
        await prisma.setting.findMany({
          where: {
            category:
              req.params.category,
          },
        });

      res.status(200).json({
        success: true,
        data: settings,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Failed",
      });

    }
  };

/**
 * GET SINGLE SETTING
 */
export const getSettingByKey =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const setting =
        await prisma.setting.findUnique({
          where: {
            key: req.params.key,
          },
        });

      if (!setting) {

        res.status(404).json({
          success: false,
          message: "Setting not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        data: setting,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Failed",
      });

    }
  };

/**
 * CREATE SETTING
 */
export const createSetting =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const {
        key,
        value,
        category,
        description,
      } = req.body;

      const exists =
        await prisma.setting.findUnique({
          where: { key },
        });

      if (exists) {

        res.status(400).json({
          success: false,
          message: "Key already exists",
        });

        return;
      }

      const setting =
        await prisma.setting.create({
          data: {
            key,
            value,
            category,
            description,
          },
        });

      res.status(201).json({
        success: true,
        data: setting,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Create failed",
      });

    }
  };

/**
 * UPDATE SETTING
 */
export const updateSetting =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const setting =
        await prisma.setting.update({
          where: {
            id: req.params.id,
          },
          data: req.body,
        });

      res.status(200).json({
        success: true,
        data: setting,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Update failed",
      });

    }
  };

/**
 * TOGGLE STATUS
 */
export const toggleSettingStatus =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const setting =
        await prisma.setting.findUnique({
          where: {
            id: req.params.id,
          },
        });

      if (!setting) {

        res.status(404).json({
          success: false,
          message: "Not found",
        });

        return;
      }

      const updated =
        await prisma.setting.update({
          where: {
            id: req.params.id,
          },
          data: {
            isActive:
              !setting.isActive,
          },
        });

      res.status(200).json({
        success: true,
        data: updated,
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Failed",
      });

    }
  };

/**
 * SETTINGS ANALYTICS
 */
export const settingsAnalytics =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {

    try {

      const [
        totalSettings,
        activeSettings,
        inactiveSettings,
      ] = await Promise.all([
        prisma.setting.count(),

        prisma.setting.count({
          where: {
            isActive: true,
          },
        }),

        prisma.setting.count({
          where: {
            isActive: false,
          },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalSettings,
          activeSettings,
          inactiveSettings,
        },
      });

    } catch {

      res.status(500).json({
        success: false,
        message: "Analytics failed",
      });

    }
  };