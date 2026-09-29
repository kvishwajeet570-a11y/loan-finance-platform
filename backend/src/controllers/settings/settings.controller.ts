import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

/* ============================================================
   HELPERS
============================================================ */

const success = (
  res: Response,
  message: string,
  data?: unknown,
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const failure = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: unknown
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error:
      process.env.NODE_ENV === "development"
        ? error
        : undefined,
  });
};

const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next?: NextFunction
    ) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

/* ============================================================
   TYPE CAST
============================================================ */

export const castValueByDataType = (
  value: any,
  dataType: string
): Prisma.InputJsonValue => {
  if (value === null || value === undefined) {
    return null as unknown as Prisma.InputJsonValue;
  }

  switch (dataType.toLowerCase()) {
    case "number":
    case "int":
    case "integer":
    case "float":
    case "double": {
      const num = Number(value);
      return Number.isNaN(num) ? 0 : num;
    }

    case "boolean":
    case "bool":
      return (
        value === true ||
        value === "true" ||
        value === "1" ||
        value === 1
      );

    case "array":
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }

    case "object":
    case "json":
      if (typeof value === "object") return value;
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }

    case "string":
    default:
      return String(value);
  }
};

/* ============================================================
   PAGINATION
============================================================ */

const getPagination = (req: Request) => {
  const page = Math.max(Number(req.query.page) || 1, 1);

  const limit = Math.min(
    Math.max(Number(req.query.limit) || 20, 1),
    100
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/* ============================================================
   NEWLY ADDED / IMPLEMENTED CONTROLLER FUNCTIONS
============================================================ */

// 1. Dashboard Data Handler
export const getSettingDashboard = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const [totalSettings, activeSettings, publicSettings, encryptedSettings, categories] =
        await Promise.all([
          prisma.setting.count(),
          prisma.setting.count({ where: { isActive: true } }),
          prisma.setting.count({ where: { isPublic: true } }),
          prisma.setting.count({ where: { isEncrypted: true } }),
          prisma.setting.groupBy({
            by: ["category"],
            _count: { key: true },
          }),
        ]);

      const dashboardData = {
        summary: {
          total: totalSettings,
          active: activeSettings,
          inactive: totalSettings - activeSettings,
          public: publicSettings,
          encrypted: encryptedSettings,
        },
        categoriesCount: categories.map((c) => ({
          category: c.category,
          count: c._count.key,
        })),
      };

      return success(
        res,
        "Setting dashboard data fetched successfully.",
        dashboardData
      );
    } catch (error) {
      return failure(res, "Failed to fetch dashboard data.", 500, error);
    }
  }
);

// 2. Analytics Data Handler
export const getSettingAnalytics = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const [dataTypesCount, recentUpdates] = await Promise.all([
        prisma.setting.groupBy({
          by: ["dataType"],
          _count: { key: true },
        }),
        prisma.setting.findMany({
          take: 10,
          orderBy: { updatedAt: "desc" },
          select: {
            key: true,
            category: true,
            dataType: true,
            updatedAt: true,
            updatedBy: true,
          },
        }),
      ]);

      const analyticsData = {
        dataTypesBreakdown: dataTypesCount.map((d) => ({
          dataType: d.dataType,
          count: d._count.key,
        })),
        recentlyUpdated: recentUpdates,
      };

      return success(
        res,
        "Setting analytics fetched successfully.",
        analyticsData
      );
    } catch (error) {
      return failure(res, "Failed to fetch analytics data.", 500, error);
    }
  }
);

// 3. Audit Logs Handler
export const getAuditLogs = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = getPagination(req);

      const [logs, total] = await Promise.all([
        prisma.setting.findMany({
          skip,
          take: limit,
          orderBy: { updatedAt: "desc" },
          select: {
            key: true,
            category: true,
            updatedAt: true,
            updatedBy: true,
            createdBy: true,
            createdAt: true,
          },
        }),
        prisma.setting.count(),
      ]);

      return success(res, "Audit logs fetched successfully.", {
        logs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      return failure(res, "Failed to fetch audit logs.", 500, error);
    }
  }
);

// 4. Update Maintenance Settings
export const updateMaintenanceSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      if (Object.keys(updates).length === 0) {
        return failure(res, "No maintenance settings provided.", 400);
      }

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "maintenance",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "Maintenance settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update maintenance settings.",
        500,
        error
      );
    }
  }
);




// 7. Export Settings to Excel JSON
export const exportSettingsExcel = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const where: Prisma.SettingWhereInput = {};
      if (category) where.category = String(category);

      const settings = await prisma.setting.findMany({
        where,
        orderBy: { category: "asc" },
      });

      const formattedData = settings.map((s) => ({
        Key: s.key,
        Value: typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value),
        Category: s.category,
        Group: s.group || "",
        DataType: s.dataType,
        IsActive: s.isActive,
        IsPublic: s.isPublic,
        Description: s.description || "",
        UpdatedAt: s.updatedAt,
      }));

      return success(res, "Settings exported for Excel successfully.", formattedData);
    } catch (error) {
      return failure(res, "Failed to export settings for Excel.", 500, error);
    }
  }
);

// 8. Export Settings to PDF Payload
export const exportSettingsPdf = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const where: Prisma.SettingWhereInput = {};
      if (category) where.category = String(category);

      const settings = await prisma.setting.findMany({
        where,
        select: {
          key: true,
          value: true,
          category: true,
          description: true,
          updatedAt: true,
        },
        orderBy: { category: "asc" },
      });

      return success(res, "Settings exported for PDF successfully.", {
        generatedAt: new Date().toISOString(),
        totalRecords: settings.length,
        items: settings,
      });
    } catch (error) {
      return failure(res, "Failed to export settings for PDF.", 500, error);
    }
  }
);

// 9. Search Settings
export const searchSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { query } = req.query;
      const { page, limit, skip } = getPagination(req);

      if (!query || String(query).trim() === "") {
        return failure(res, "Search query param is required.", 400);
      }

      const searchTerm = String(query).trim();

      const where: Prisma.SettingWhereInput = {
        OR: [
          { key: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { category: { contains: searchTerm, mode: "insensitive" } },
          { group: { contains: searchTerm, mode: "insensitive" } },
        ],
      };

      const [results, total] = await Promise.all([
        prisma.setting.findMany({
          where,
          skip,
          take: limit,
          orderBy: { sortOrder: "asc" },
        }),
        prisma.setting.count({ where }),
      ]);

      return success(res, `Search results for query: "${searchTerm}"`, {
        results,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      return failure(res, "Failed to search settings.", 500, error);
    }
  }
);

/* ============================================================
   GET ALL SETTINGS
============================================================ */

export const getAllSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { page, limit, skip } = getPagination(req);

      const {
        category,
        group,
        isActive,
        isPublic,
        search,
        sortBy = "sortOrder",
        order = "asc",
      } = req.query;

      const where: Prisma.SettingWhereInput = {};

      if (category) {
        where.category = String(category);
      }

      if (group) {
        where.group = String(group);
      }

      if (isActive !== undefined) {
        where.isActive = isActive === "true";
      }

      if (isPublic !== undefined) {
        where.isPublic = isPublic === "true";
      }

      if (search) {
        where.OR = [
          {
            key: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            category: {
              contains: String(search),
              mode: "insensitive",
            },
          },
          {
            group: {
              contains: String(search),
              mode: "insensitive",
            },
          },
        ];
      }

      const [settings, total] = await Promise.all([
        prisma.setting.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            [String(sortBy)]:
              order === "desc" ? "desc" : "asc",
          },
        }),

        prisma.setting.count({
          where,
        }),
      ]);

      return success(res, "Settings fetched successfully", {
        settings,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      return failure(
        res,
        "Failed to fetch settings",
        500,
        error
      );
    }
  }
);

/* ============================================================
   GET SETTING BY KEY
============================================================ */

export const getSettingByKey = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const key =
  typeof req.params.key === "string"
    ? req.params.key
    : undefined;

      const setting = await prisma.setting.findUnique({
        where: {
          key,
        },
      });

      if (!setting) {
        return failure(
          res,
          "Setting not found",
          404
        );
      }

      return success(
        res,
        "Setting fetched successfully",
        setting
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch setting",
        500,
        error
      );
    }
  }
);

/* ============================================================
   CREATE SETTING
============================================================ */

export const createSetting = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        key,
        value,
        category,
        group,
        description,
        dataType = "string",
        isActive = true,
        isPublic = false,
        isEditable = true,
        isEncrypted = false,
        sortOrder = 0,
        createdBy,
      } = req.body;

      if (!key || !category) {
        return failure(
          res,
          "Key and category are required.",
          400
        );
      }

      const exists = await prisma.setting.findUnique({
        where: { key },
      });

      if (exists) {
        return failure(
          res,
          "Setting already exists.",
          409
        );
      }

      const setting = await prisma.setting.create({
        data: {
          key,
          value: castValueByDataType(value, dataType),
          category,
          group,
          description,
          dataType,
          isActive,
          isPublic,
          isEditable,
          isEncrypted,
          sortOrder: Number(sortOrder),
          createdBy,
          updatedBy: createdBy,
        },
      });

      return success(
        res,
        "Setting created successfully.",
        setting,
        201
      );
    } catch (error) {
      return failure(
        res,
        "Failed to create setting.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE SETTING
============================================================ */

export const updateSetting = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const key =
  typeof req.params.key === "string"
    ? req.params.key
    : undefined;

      const existing = await prisma.setting.findUnique({
        where: { key },
      });

      if (!existing) {
        return failure(
          res,
          "Setting not found.",
          404
        );
      }

      if (!existing.isEditable) {
        return failure(
          res,
          "This setting cannot be edited.",
          403
        );
      }

      const {
        value,
        category,
        group,
        description,
        dataType,
        isActive,
        isPublic,
        isEditable,
        isEncrypted,
        sortOrder,
        updatedBy,
      } = req.body;

      const setting = await prisma.setting.update({
        where: { key },
        data: {
          value:
            value !== undefined
              ? castValueByDataType(
                  value,
                  dataType || existing.dataType
                )
              : undefined,

          category,
          group,
          description,
          dataType,
          isActive,
          isPublic,
          isEditable,
          isEncrypted,
          sortOrder:
            sortOrder !== undefined
              ? Number(sortOrder)
              : undefined,
          updatedBy,
        },
      });

      return success(
        res,
        "Setting updated successfully.",
        setting
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update setting.",
        500,
        error
      );
    }
  }
); 

/* ============================================================
   DELETE SETTING
============================================================ */

export const deleteSetting = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const key =
  typeof req.params.key === "string"
    ? req.params.key
    : undefined;

      const setting = await prisma.setting.findUnique({
        where: { key },
      });

      if (!setting) {
        return failure(res, "Setting not found.", 404);
      }

      await prisma.setting.delete({
        where: { key },
      });

      return success(
        res,
        "Setting deleted successfully."
      );
    } catch (error) {
      return failure(
        res,
        "Failed to delete setting.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   BULK UPDATE SETTINGS
============================================================ */

export const bulkUpdateSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { settings, updatedBy } = req.body;

      if (!Array.isArray(settings) || settings.length === 0) {
        return failure(
          res,
          "Settings array is required.",
          400
        );
      }

      const result = await prisma.$transaction(
        settings.map((item: any) =>
          prisma.setting.update({
            where: {
              key: item.key,
            },
            data: {
              value:
                item.value !== undefined
                  ? castValueByDataType(
                      item.value,
                      item.dataType || "string"
                    )
                  : undefined,

              category: item.category,
              group: item.group,
              description: item.description,
              dataType: item.dataType,
              isActive: item.isActive,
              isPublic: item.isPublic,
              isEditable: item.isEditable,
              isEncrypted: item.isEncrypted,
              sortOrder: item.sortOrder,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        `${result.length} settings updated successfully.`,
        result
      );
    } catch (error) {
      return failure(
        res,
        "Bulk update failed.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   BULK DELETE SETTINGS
============================================================ */

export const bulkDeleteSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keys } = req.body;

      if (!Array.isArray(keys) || keys.length === 0) {
        return failure(
          res,
          "Keys array is required.",
          400
        );
      }

      const result = await prisma.setting.deleteMany({
        where: {
          key: {
            in: keys,
          },
        },
      });

      return success(res, "Settings deleted successfully.", {
        deletedCount: result.count,
      });
    } catch (error) {
      return failure(
        res,
        "Bulk delete failed.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   SYSTEM SETTINGS
============================================================ */

export const getSystemSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "system",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: any, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "System settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch system settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE SYSTEM SETTINGS
============================================================ */

export const updateSystemSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const updatedBy = req.body.updatedBy;

      const keys = Object.keys(updates).filter(
        (key) => key !== "updatedBy"
      );

      const result = await prisma.$transaction(
        keys.map((key) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: updates[key] as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: updates[key] as Prisma.InputJsonValue,
              category: "system",
              dataType: typeof updates[key],
              updatedBy,
              createdBy: updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "System settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update system settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   COMPANY SETTINGS
============================================================ */

export const getCompanySettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "company",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: any, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "Company settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch company settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE COMPANY SETTINGS
============================================================ */

export const updateCompanySettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const updatedBy = req.body.updatedBy;

      const keys = Object.keys(updates).filter(
        (key) => key !== "updatedBy"
      );

      const result = await prisma.$transaction(
        keys.map((key) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: updates[key] as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: updates[key] as Prisma.InputJsonValue,
              category: "company",
              dataType: typeof updates[key],
              updatedBy,
              createdBy: updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "Company settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update company settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   WEBSITE SETTINGS
============================================================ */

export const getWebsiteSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "website",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "Website settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch website settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE WEBSITE SETTINGS
============================================================ */

export const updateWebsiteSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "website",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "Website settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update website settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   SEO SETTINGS
============================================================ */

export const getSeoSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "seo",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "SEO settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch SEO settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE SEO SETTINGS
============================================================ */

export const updateSeoSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "seo",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "SEO settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update SEO settings.",
        500,
        error
      );
    }
  }
); 

/* ============================================================
   EMAIL SETTINGS
============================================================ */

export const getEmailSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "email",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "Email settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch email settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE EMAIL SETTINGS
============================================================ */

export const updateEmailSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "email",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "Email settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update email settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   SMS SETTINGS
============================================================ */

export const getSmsSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "sms",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "SMS settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch SMS settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE SMS SETTINGS
============================================================ */

export const updateSmsSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "sms",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "SMS settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update SMS settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   WHATSAPP SETTINGS
============================================================ */

export const getWhatsappSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "whatsapp",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "WhatsApp settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch WhatsApp settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE WHATSAPP SETTINGS
============================================================ */

export const updateWhatsappSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "whatsapp",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "WhatsApp settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update WhatsApp settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   NOTIFICATION SETTINGS
============================================================ */

export const getNotificationSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: {
          category: "notification",
          isActive: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(
        res,
        "Notification settings fetched successfully.",
        data
      );
    } catch (error) {
      return failure(
        res,
        "Failed to fetch notification settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   UPDATE NOTIFICATION SETTINGS
============================================================ */

export const updateNotificationSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "notification",
              dataType: Array.isArray(value)
                ? "array"
                : value === null
                ? "string"
                : typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(
        res,
        "Notification settings updated successfully.",
        result
      );
    } catch (error) {
      return failure(
        res,
        "Failed to update notification settings.",
        500,
        error
      );
    }
  }
);

/* ============================================================
   PAYMENT GATEWAY SETTINGS
============================================================ */

export const getPaymentGatewaySettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "payment_gateway", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Payment gateway settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch payment gateway settings.", 500, error);
    }
  }
);

export const updatePaymentGatewaySettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "payment_gateway",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Payment gateway settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update payment gateway settings.", 500, error);
    }
  }
);

/* ============================================================
   LOAN SETTINGS
============================================================ */

export const getLoanSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "loan", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Loan settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch loan settings.", 500, error);
    }
  }
);

export const updateLoanSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "loan",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Loan settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update loan settings.", 500, error);
    }
  }
);

/* ============================================================
   COMMISSION SETTINGS
============================================================ */

export const getCommissionSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "commission", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Commission settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch commission settings.", 500, error);
    }
  }
);

export const updateCommissionSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "commission",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Commission settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update commission settings.", 500, error);
    }
  }
);

/* ============================================================
   REFERRAL SETTINGS
============================================================ */

export const getReferralSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "referral", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Referral settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch referral settings.", 500, error);
    }
  }
);

export const updateReferralSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "referral",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Referral settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update referral settings.", 500, error);
    }
  }
);

/* ============================================================
   KYC SETTINGS
============================================================ */

export const getKycSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "kyc", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "KYC settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch KYC settings.", 500, error);
    }
  }
);

export const updateKycSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "kyc",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "KYC settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update KYC settings.", 500, error);
    }
  }
);

/* ============================================================
   SECURITY SETTINGS
============================================================ */

export const getSecuritySettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "security", isActive: true },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Security settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch security settings.", 500, error);
    }
  }
);

export const updateSecuritySettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { updatedBy, ...updates } = req.body;

      const result = await prisma.$transaction(
        Object.entries(updates).map(([key, value]) =>
          prisma.setting.upsert({
            where: { key },
            update: {
              value: value as Prisma.InputJsonValue,
              updatedBy,
            },
            create: {
              key,
              value: value as Prisma.InputJsonValue,
              category: "security",
              dataType: typeof value,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Security settings updated successfully.", result);
    } catch (error) {
      return failure(res, "Failed to update security settings.", 500, error);
    }
  }
);

/* ============================================================
   MAINTENANCE SETTINGS & TOGGLE
============================================================ */

export const getMaintenanceSettings = asyncHandler(
  async (_req: Request, res: Response) => {
    try {
      const settings = await prisma.setting.findMany({
        where: { category: "maintenance" },
        orderBy: { sortOrder: "asc" },
      });

      const data = settings.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});

      return success(res, "Maintenance settings fetched successfully.", data);
    } catch (error) {
      return failure(res, "Failed to fetch maintenance settings.", 500, error);
    }
  }
);

// Enable/Disable Maintenance Mode Dedicated Toggle
export const toggleMaintenanceMode = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { enabled, message, allowedIps, updatedBy } = req.body;

      if (typeof enabled !== "boolean") {
        return failure(res, "'enabled' (boolean) status is required.", 400);
      }

      const operations = [
        prisma.setting.upsert({
          where: { key: "maintenance_mode_enabled" },
          update: { value: enabled, updatedBy },
          create: {
            key: "maintenance_mode_enabled",
            value: enabled,
            category: "maintenance",
            dataType: "boolean",
            createdBy: updatedBy,
            updatedBy,
          },
        }),
      ];

      if (message !== undefined) {
        operations.push(
          prisma.setting.upsert({
            where: { key: "maintenance_mode_message" },
            update: { value: message, updatedBy },
            create: {
              key: "maintenance_mode_message",
              value: message,
              category: "maintenance",
              dataType: "string",
              createdBy: updatedBy,
              updatedBy,
            },
          })
        );
      }

      if (allowedIps !== undefined) {
        operations.push(
          prisma.setting.upsert({
            where: { key: "maintenance_allowed_ips" },
            update: { value: allowedIps, updatedBy },
            create: {
              key: "maintenance_allowed_ips",
              value: allowedIps,
              category: "maintenance",
              dataType: "array",
              createdBy: updatedBy,
              updatedBy,
            },
          })
        );
      }

      await prisma.$transaction(operations);

      return success(
        res,
        `Maintenance mode ${enabled ? "enabled" : "disabled"} successfully.`,
        { maintenanceMode: enabled }
      );
    } catch (error) {
      return failure(res, "Failed to toggle maintenance mode.", 500, error);
    }
  }
);

// Production Grade Restore Settings - Validates & Upserts Backup Data
export const restoreSettings = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { backupData, updatedBy, clearExisting } = req.body;

      const rawRecords = Array.isArray(backupData)
        ? backupData
        : backupData?.settings;

      if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
        return failure(
          res,
          "Invalid payload: backupData array or backup package containing settings is required.",
          400
        );
      }

      if (clearExisting === true) {
        await prisma.setting.deleteMany({
          where: { isEditable: true },
        });
      }

      const restored = await prisma.$transaction(
        rawRecords.map((item: any) =>
          prisma.setting.upsert({
            where: { key: item.key },
            update: {
              value: item.value,
              category: item.category || "general",
              group: item.group || null,
              description: item.description || null,
              dataType: item.dataType || typeof item.value,
              isActive: item.isActive ?? true,
              isPublic: item.isPublic ?? false,
              isEditable: item.isEditable ?? true,
              isEncrypted: item.isEncrypted ?? false,
              sortOrder: item.sortOrder ?? 0,
              updatedBy,
            },
            create: {
              key: item.key,
              value: item.value,
              category: item.category || "general",
              group: item.group || null,
              description: item.description || null,
              dataType: item.dataType || typeof item.value,
              isActive: item.isActive ?? true,
              isPublic: item.isPublic ?? false,
              isEditable: item.isEditable ?? true,
              isEncrypted: item.isEncrypted ?? false,
              sortOrder: item.sortOrder ?? 0,
              createdBy: updatedBy,
              updatedBy,
            },
          })
        )
      );

      return success(res, "Settings restored successfully.", {
        restoredCount: restored.length,
        restoredAt: new Date().toISOString(),
      });
    } catch (error) {
      return failure(
        res,
        "Failed to restore settings from backup.",
        500,
        error
      );
    }
  }
);

export const resetSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prisma.setting.deleteMany();

    const defaultSettings = [
      {
        key: "site_name",
        value: "DSA FinCorp",
        category: "website",
        description: "Website Name",
      },
      {
        key: "maintenance_mode",
        value: false,
        category: "system",
        description: "Maintenance Mode",
      },
      {
        key: "registration_enabled",
        value: true,
        category: "system",
        description: "Allow User Registration",
      },
    ];

    await prisma.setting.createMany({
      data: defaultSettings,
      skipDuplicates: true,
    });

    res.status(200).json({
      success: true,
      message: "Settings reset successfully.",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to reset settings.",
      error: error.message,
    });
  }
};