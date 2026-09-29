import prisma from "../../prisma/prisma";

export class SettingsRepository {
  /* =========================
      CREATE SETTING
  ========================= */

  static async createSetting(data: {
    key: string;
    value: string;
    category: string;
    description?: string;
  }) {
    return prisma.setting.create({
      data,
    });
  }

  /* =========================
      GET BY ID
  ========================= */

  static async getById(id: string) {
    return prisma.setting.findUnique({
      where: { id },
    });
  }

  /* =========================
      GET BY KEY
  ========================= */

  static async getByKey(key: string) {
    return prisma.setting.findUnique({
      where: { key },
    });
  }

  /* =========================
      GET CATEGORY SETTINGS
  ========================= */

  static async getByCategory(category: string) {
    return prisma.setting.findMany({
      where: {
        category,
      },
      orderBy: {
        key: "asc",
      },
    });
  }

  /* =========================
      UPDATE SETTING
  ========================= */

  static async updateSetting(
    key: string,
    value: string,
    description?: string
  ) {
    return prisma.setting.update({
      where: {
        key,
      },
      data: {
        value,
        description,
      },
    });
  }

  /* =========================
      UPSERT SETTING
  ========================= */

  static async upsertSetting(data: {
    key: string;
    value: string;
    category: string;
    description?: string;
  }) {
    return prisma.setting.upsert({
      where: {
        key: data.key,
      },
      update: {
        value: data.value,
        category: data.category,
        description: data.description,
      },
      create: data,
    });
  }

  /* =========================
      DELETE SETTING
  ========================= */

  static async deleteSetting(key: string) {
    return prisma.setting.delete({
      where: {
        key,
      },
    });
  }

  /* =========================
      BULK UPDATE
  ========================= */

  static async bulkUpdate(
    settings: {
      key: string;
      value: string;
    }[]
  ) {
    return prisma.$transaction(
      settings.map((setting) =>
        prisma.setting.update({
          where: {
            key: setting.key,
          },
          data: {
            value: setting.value,
          },
        })
      )
    );
  }

  /* =========================
      SEARCH SETTINGS
  ========================= */

/* =========================
    SEARCH SETTINGS
========================= */

static async searchSettings(keyword: string) {
  return prisma.setting.findMany({
    where: {
      OR: [
        {
          key: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: keyword,
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      key: "asc",
    },
  });
}
  /* =========================
      GET ALL SETTINGS
  ========================= */

  static async getAllSettings(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [settings, total] = await Promise.all([
      prisma.setting.findMany({
        skip,
        take: limit,
        orderBy: {
          category: "asc",
        },
      }),
      prisma.setting.count(),
    ]);

    return {
      settings,
      total,
      page,
      limit,
    };
  }

  /* =========================
      SETTINGS ANALYTICS
  ========================= */

  static async getAnalytics() {
    const totalSettings = await prisma.setting.count();

    const categories = await prisma.setting.groupBy({
      by: ["category"],
      _count: true,
    });

    return {
      totalSettings,
      categories,
    };
  }

  /* =========================
      PLATFORM CONFIG
  ========================= */

  static async getPlatformConfig() {
    const settings = await prisma.setting.findMany();

    return settings.reduce<Record<string, unknown>>(
      (acc, item) => {
        acc[item.key] = item.value;
        return acc;
      },
      {}
    );
  }
}

export default SettingsRepository;