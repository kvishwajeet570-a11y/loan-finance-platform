import prisma from "../../prisma/prisma";

interface CreateSettingDTO {
  key: string;
  value: string;
  category: string;
  description?: string;
}

class SettingService {
  /**
   * Create Setting
   */
  async createSetting(
    data: CreateSettingDTO
  ) {
    const exists =
      await prisma.setting.findUnique({
        where: {
          key: data.key,
        },
      });

    if (exists) {
      throw new Error(
        "Setting already exists"
      );
    }

    return prisma.setting.create({
      data,
    });
  }

  /**
   * Get Setting By Key
   */
  async getSetting(
    key: string
  ) {
    return prisma.setting.findUnique({
      where: {
        key,
      },
    });
  }

  /**
   * Get All Settings
   */
  async getAllSettings(
    category?: string
  ) {
    return prisma.setting.findMany({
      where: category
        ? {
            category,
          }
        : {},

      orderBy: {
        category: "asc",
      },
    });
  }

  /**
   * Update Setting
   */
  async updateSetting(
    key: string,
    value: string
  ) {
    return prisma.setting.update({
      where: {
        key,
      },

      data: {
        value,
      },
    });
  }

  /**
   * Bulk Update
   */
  async bulkUpdate(
    settings: {
      key: string;
      value: string;
    }[]
  ) {
    const updates =
      settings.map((item) =>
        prisma.setting.update({
          where: {
            key: item.key,
          },

          data: {
            value:
              item.value,
          },
        })
      );

    return prisma.$transaction(
      updates
    );
  }

  /**
   * Delete Setting
   */
  async deleteSetting(
    settingId: string
  ) {
    return prisma.setting.delete({
      where: {
        id: settingId,
      },
    });
  }

  /**
   * Company Configuration
   */
  async companyConfig() {
    const settings =
      await prisma.setting.findMany({
        where: {
          category:
            "company",
        },
      });

    return Object.fromEntries(
      settings.map((s) => [
        s.key,
        s.value,
      ])
    );
  }

  /**
   * Loan Configuration
   */
  async loanConfig() {
    const settings =
      await prisma.setting.findMany({
        where: {
          category:
            "loan",
        },
      });

    return Object.fromEntries(
      settings.map((s) => [
        s.key,
        s.value,
      ])
    );
  }

  /**
   * Commission Configuration
   */
  async commissionConfig() {
    const settings =
      await prisma.setting.findMany({
        where: {
          category:
            "commission",
        },
      });

    return Object.fromEntries(
      settings.map((s) => [
        s.key,
        s.value,
      ])
    );
  }

  /**
   * Referral Configuration
   */
  async referralConfig() {
    const settings =
      await prisma.setting.findMany({
        where: {
          category:
            "referral",
        },
      });

    return Object.fromEntries(
      settings.map((s) => [
        s.key,
        s.value,
      ])
    );
  }

  /**
   * Maintenance Mode
   */
  async enableMaintenance() {
    return prisma.setting.upsert({
      where: {
        key:
          "maintenance_mode",
      },

      update: {
        value: "true",
      },

      create: {
        key:
          "maintenance_mode",
        value: "true",
        category:
          "system",
      },
    });
  }

  async disableMaintenance() {
    return prisma.setting.upsert({
      where: {
        key:
          "maintenance_mode",
      },

      update: {
        value: "false",
      },

      create: {
        key:
          "maintenance_mode",
        value: "false",
        category:
          "system",
      },
    });
  }

  /**
   * System Status
   */
  async systemStatus() {
    const maintenance =
      await prisma.setting.findUnique({
        where: {
          key:
            "maintenance_mode",
        },
      });

    return {
      maintenance:
        maintenance?.value ===
        "true",
    };
  }

  /**
   * Seed Default Settings
   */
  async seedDefaultSettings() {
    const settings = [
      {
        key: "company_name",
        value:
          "India Loan Finance",
        category:
          "company",
      },
      {
        key:
          "support_email",
        value:
          "support@indialoanfinance.com",
        category:
          "company",
      },
      {
        key:
          "support_phone",
        value:
          "8292908077",
        category:
          "company",
      },
      {
        key:
          "min_loan_amount",
        value: "10000",
        category: "loan",
      },
      {
        key:
          "max_loan_amount",
        value: "5000000",
        category: "loan",
      },
      {
        key:
          "referral_bonus",
        value: "500",
        category:
          "referral",
      },
    ];

    for (const setting of settings) {
      await prisma.setting.upsert({
        where: {
          key:
            setting.key,
        },

        update: {},

        create: setting,
      });
    }

    return {
      success: true,
      count:
        settings.length,
    };
  }

  /**
   * Settings Analytics
   */
  async getSettingStats() {
    const [
      totalSettings,
      categories,
    ] = await Promise.all([
      prisma.setting.count(),

      prisma.setting.groupBy({
        by: ["category"],
      }),
    ]);

    return {
      totalSettings,
      totalCategories:
        categories.length,
    };
  }
}

export default new SettingService();