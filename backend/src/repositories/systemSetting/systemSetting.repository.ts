import { Prisma, SystemSetting } from "@prisma/client";
import prisma from "../../prisma/prisma";

class SystemSettingRepository {
  // =========================================
  // CREATE
  // =========================================

  async create(data: Prisma.SystemSettingCreateInput): Promise<SystemSetting> {
    return prisma.systemSetting.create({
      data,
    });
  }

  // =========================================
  // GET ALL
  // =========================================

  async findAll(
    where: Prisma.SystemSettingWhereInput = {},
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
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

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // =========================================
  // FIND BY ID
  // =========================================

  async findById(id: string): Promise<SystemSetting | null> {
    return prisma.systemSetting.findUnique({
      where: {
        id,
      },
    });
  }

  // =========================================
  // FIND BY KEY
  // =========================================

  async findByKey(key: string): Promise<SystemSetting | null> {
    return prisma.systemSetting.findUnique({
      where: {
        key,
      },
    });
  }

  // =========================================
  // UPDATE
  // =========================================

  async update(
    id: string,
    data: Prisma.SystemSettingUpdateInput
  ): Promise<SystemSetting> {
    return prisma.systemSetting.update({
      where: {
        id,
      },
      data,
    });
  }

  // =========================================
  // DELETE
  // =========================================

  async delete(id: string): Promise<SystemSetting> {
    return prisma.systemSetting.delete({
      where: {
        id,
      },
    });
  }

  // =========================================
  // COUNT
  // =========================================

  async count(
    where: Prisma.SystemSettingWhereInput = {}
  ): Promise<number> {
    return prisma.systemSetting.count({
      where,
    });
  }

  // =========================================
  // BULK UPDATE
  // =========================================

  async bulkUpdate(
    settings: {
      key: string;
      value: Prisma.InputJsonValue;
      updatedBy?: string;
    }[]
  ) {
    return prisma.$transaction(
      settings.map((item) =>
        prisma.systemSetting.update({
          where: {
            key: item.key,
          },
          data: {
            value: item.value,
            updatedBy: item.updatedBy,
          },
        })
      )
    );
  }

  // =========================================
  // TOGGLE ACTIVE STATUS
  // =========================================

  async toggleStatus(id: string): Promise<SystemSetting> {
    const setting = await prisma.systemSetting.findUnique({
      where: {
        id,
      },
    });

    if (!setting) {
      throw new Error("System setting not found.");
    }

    return prisma.systemSetting.update({
      where: {
        id,
      },
      data: {
        isActive: !setting.isActive,
      },
    });
  }

  // =========================================
  // TOGGLE ENCRYPTION
  // =========================================

  async toggleEncryption(id: string): Promise<SystemSetting> {
    const setting = await prisma.systemSetting.findUnique({
      where: {
        id,
      },
    });

    if (!setting) {
      throw new Error("System setting not found.");
    }

    return prisma.systemSetting.update({
      where: {
        id,
      },
      data: {
        isEncrypted: !setting.isEncrypted,
      },
    });
  }

  // =========================================
  // EXISTS BY KEY
  // =========================================

  async exists(key: string): Promise<boolean> {
    const count = await prisma.systemSetting.count({
      where: {
        key,
      },
    });

    return count > 0;
  }

  // =========================================
  // GET ACTIVE SETTINGS
  // =========================================

  async getActiveSettings(): Promise<SystemSetting[]> {
    return prisma.systemSetting.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        key: "asc",
      },
    });
  }

  // =========================================
  // GET BY CATEGORY
  // =========================================

  async getByCategory(category: string): Promise<SystemSetting[]> {
    return prisma.systemSetting.findMany({
      where: {
        category: category as any,
      },
      orderBy: {
        key: "asc",
      },
    });
  }
}

export default new SystemSettingRepository();