import { prisma } from "../../prisma";

export class SettingsRepository {

  /* =========================
      CREATE SETTING
  ========================= */

  static async createSetting(data: {
    settingKey: string;
    settingValue: any;
    category: string;
    description?: string;
    isPublic?: boolean;
    createdBy?: string;
  }) {

    return prisma.setting.create({
      data
    });
  }

  /* =========================
      GET BY ID
  ========================= */

  static async getById(
    id: string
  ) {

    return prisma.setting.findUnique({
      where: { id }
    });
  }

  /* =========================
      GET BY KEY
  ========================= */

  static async getByKey(
    settingKey: string
  ) {

    return prisma.setting.findUnique({

      where: {
        settingKey
      }
    });
  }

  /* =========================
      GET CATEGORY SETTINGS
  ========================= */

  static async getByCategory(
    category: string
  ) {

    return prisma.setting.findMany({

      where: {
        category
      },

      orderBy: {
        settingKey: "asc"
      }
    });
  }

  /* =========================
      GET PUBLIC SETTINGS
  ========================= */

  static async getPublicSettings() {

    return prisma.setting.findMany({

      where: {
        isPublic: true
      }
    });
  }

  /* =========================
      UPDATE SETTING
  ========================= */

  static async updateSetting(
    settingKey: string,
    settingValue: any,
    updatedBy?: string
  ) {

    return prisma.setting.update({

      where: {
        settingKey
      },

      data: {
        settingValue,
        updatedBy
      }
    });
  }

  /* =========================
      UPSERT SETTING
  ========================= */

  static async upsertSetting(data: {
    settingKey: string;
    settingValue: any;
    category: string;
    description?: string;
    isPublic?: boolean;
    updatedBy?: string;
  }) {

    return prisma.setting.upsert({

      where: {
        settingKey: data.settingKey
      },

      update: {
        settingValue: data.settingValue,
        updatedBy: data.updatedBy
      },

      create: data
    });
  }

  /* =========================
      DELETE SETTING
  ========================= */

  static async deleteSetting(
    settingKey: string
  ) {

    return prisma.setting.delete({

      where: {
        settingKey
      }
    });
  }

  /* =========================
      BULK UPDATE
  ========================= */

  static async bulkUpdate(
    settings: {
      settingKey: string;
      settingValue: any;
    }[]
  ) {

    return prisma.$transaction(

      settings.map(setting =>
        prisma.setting.update({

          where: {
            settingKey: setting.settingKey
          },

          data: {
            settingValue:
              setting.settingValue
          }
        })
      )
    );
  }

  /* =========================
      SEARCH SETTINGS
  ========================= */

  static async searchSettings(
    keyword: string
  ) {

    return prisma.setting.findMany({

      where: {

        OR: [

          {
            settingKey: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            category: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            description: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* =========================
      GET ALL SETTINGS
  ========================= */

  static async getAllSettings(
    page = 1,
    limit = 50
  ) {

    const skip =
      (page - 1) * limit;

    const [settings, total] =
      await Promise.all([

        prisma.setting.findMany({

          skip,
          take: limit,

          orderBy: {
            category: "asc"
          }
        }),

        prisma.setting.count()
      ]);

    return {
      settings,
      total,
      page,
      limit
    };
  }

  /* =========================
      SETTINGS ANALYTICS
  ========================= */

  static async getAnalytics() {

    const [
      totalSettings,
      publicSettings
    ] = await Promise.all([

      prisma.setting.count(),

      prisma.setting.count({
        where: {
          isPublic: true
        }
      })
    ]);

    return {
      totalSettings,
      publicSettings
    };
  }

  /* =========================
      PLATFORM CONFIG
  ========================= */

  static async getPlatformConfig() {

    const settings =
      await prisma.setting.findMany();

    return settings.reduce(
      (acc, item) => {

        acc[item.settingKey] =
          item.settingValue;

        return acc;

      },
      {} as Record<string, any>
    );
  }
}