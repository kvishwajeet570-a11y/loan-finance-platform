import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

import {
  createSystemSettingSchema,
} from "../../dto/systemSetting/systemSetting.dto";

/* ======================================================
   CREATE SYSTEM SETTING
====================================================== */

export const createSystemSetting = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validated =
      createSystemSettingSchema.parse(req.body);

    const existing =
      await prisma.systemSetting.findUnique({
        where: {
          key: validated.key,
        },
      });

    if (existing) {
      res.status(409).json({
        success: false,
        message: "Setting key already exists.",
      });
      return;
    }

    const setting =
      await prisma.systemSetting.create({
        data: {
          category: validated.category,
          key: validated.key,
          value: validated.value,
          dataType: validated.dataType,
          description: validated.description,
          isEditable: validated.isEditable,
          isEncrypted: validated.isEncrypted,
        },
      });

    res.status(201).json({
      success: true,
      message: "System setting created successfully.",
      data: setting,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create system setting.",
      error: error.message,
    });
  }
};

/* ======================================================
   GET ALL SYSTEM SETTINGS
====================================================== */

export const getAllSystemSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page =
      Number(req.query.page) || 1;

    const limit =
      Number(req.query.limit) || 20;

    const skip =
      (page - 1) * limit;

    const category =
      req.query.category as string | undefined;

    const key =
      req.query.key as string | undefined;

    const where: any = {};

    if (category)
      where.category = category;

    if (key)
      where.key = {
        contains: key,
        mode: "insensitive",
      };

    const [settings, total] =
      await Promise.all([
        prisma.systemSetting.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            updatedAt: "desc",
          },
        }),

        prisma.systemSetting.count({
          where,
        }),
      ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings.",
      error: error.message,
    });
  }
};

/* ======================================================
   GET SYSTEM SETTING BY ID
====================================================== */

export const getSystemSettingById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const setting =
      await prisma.systemSetting.findUnique({
        where: {
          id,
        },
      });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch system setting.",
      error: error.message,
    });
  }
};

/* ======================================================
   GET SYSTEM SETTING BY KEY
====================================================== */

export const getSystemSettingByKey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const key = String(req.params.key);

    const setting =
      await prisma.systemSetting.findUnique({
        where: {
          key,
        },
      });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: setting,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch system setting.",
      error: error.message,
    });
  }
};

/* ======================================================
   UPDATE SYSTEM SETTING
====================================================== */

export const updateSystemSetting = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const setting = await prisma.systemSetting.findUnique({
      where: {
        id,
      },
    });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    if (!setting.isEditable) {
      res.status(403).json({
        success: false,
        message: "This setting cannot be modified.",
      });
      return;
    }

    const updated = await prisma.systemSetting.update({
      where: {
        id,
      },
      data: {
        category: req.body.category ?? setting.category,
        key: req.body.key ?? setting.key,
        value: req.body.value ?? setting.value,
        dataType: req.body.dataType ?? setting.dataType,
        description:
          req.body.description ?? setting.description,
        isEditable:
          req.body.isEditable ?? setting.isEditable,
        isEncrypted:
          req.body.isEncrypted ?? setting.isEncrypted,
        requiresRestart:
          req.body.requiresRestart ??
          setting.requiresRestart,
        isActive:
          req.body.isActive ?? setting.isActive,
        updatedBy: req.body.updatedBy,
      },
    });

    res.status(200).json({
      success: true,
      message: "System setting updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update system setting.",
      error: error.message,
    });
  }
};

/* ======================================================
   DELETE SYSTEM SETTING
====================================================== */

export const deleteSystemSetting = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const setting = await prisma.systemSetting.findUnique({
      where: {
        id,
      },
    });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    await prisma.systemSetting.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: "System setting deleted successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete system setting.",
      error: error.message,
    });
  }
};

/* ======================================================
   BULK UPDATE SYSTEM SETTINGS
====================================================== */

export const bulkUpdateSystemSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings) || settings.length === 0) {
      res.status(400).json({
        success: false,
        message: "Settings array is required.",
      });
      return;
    }

    const updated: any[] = [];

    for (const item of settings) {
      const setting =
        await prisma.systemSetting.findUnique({
          where: {
            key: item.key,
          },
        });

      if (!setting || !setting.isEditable) {
        continue;
      }

      const result =
        await prisma.systemSetting.update({
          where: {
            key: item.key,
          },
          data: {
            value: item.value,
            updatedBy: req.body.updatedBy,
          },
        });

      updated.push(result);
    }

    res.status(200).json({
      success: true,
      message: "Bulk update completed successfully.",
      updatedCount: updated.length,
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Bulk update failed.",
      error: error.message,
    });
  }
};

/* ======================================================
   TOGGLE ACTIVE STATUS
====================================================== */

export const toggleSystemSettingStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const setting =
      await prisma.systemSetting.findUnique({
        where: {
          id,
        },
      });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    const updated =
      await prisma.systemSetting.update({
        where: {
          id,
        },
        data: {
          isActive: !setting.isActive,
        },
      });

    res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update status.",
      error: error.message,
    });
  }
};

/* ======================================================
   TOGGLE ENCRYPTION
====================================================== */

export const toggleEncryption = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = String(req.params.id);

    const setting =
      await prisma.systemSetting.findUnique({
        where: {
          id,
        },
      });

    if (!setting) {
      res.status(404).json({
        success: false,
        message: "System setting not found.",
      });
      return;
    }

    const updated =
      await prisma.systemSetting.update({
        where: {
          id,
        },
        data: {
          isEncrypted: !setting.isEncrypted,
        },
      });

    res.status(200).json({
      success: true,
      message: "Encryption status updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update encryption status.",
      error: error.message,
    });
  }
};

