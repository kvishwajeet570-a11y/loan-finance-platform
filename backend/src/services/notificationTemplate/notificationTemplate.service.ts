
import prisma from "../../prisma/prisma";

export class NotificationTemplateService {
  /* =========================================
     CREATE TEMPLATE
  ========================================= */

  async createTemplate(
    data: {
      name: string;
      code: string;
      category: string;
      type: string;
      subject?: string;
      content: string;
      variables?: any;
    },
    userId?: string
  ) {
    return prisma.notificationTemplate.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
        createdBy: userId,
      },
    });
  }

  /* =========================================
     GET ALL TEMPLATES
  ========================================= */

  async getAllTemplates(
    page: number,
    limit: number,
    filters: any
  ) {
    const skip = (page - 1) * limit;

    const [templates, total] =
      await Promise.all([
        prisma.notificationTemplate.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.notificationTemplate.count({
          where: filters,
        }),
      ]);

    return {
      templates,
      total,
      page,
      limit,
    };
  }

  /* =========================================
     GET TEMPLATE BY ID
  ========================================= */

  async getTemplateById(id: string) {
    return prisma.notificationTemplate.findUnique({
      where: { id },
    });
  }

  /* =========================================
     GET TEMPLATE BY CODE
  ========================================= */

  async getTemplateByCode(code: string) {
    return prisma.notificationTemplate.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });
  }

  /* =========================================
     UPDATE TEMPLATE
  ========================================= */

  async updateTemplate(
    id: string,
    data: any
  ) {
    return prisma.notificationTemplate.update({
      where: { id },

      data: {
        ...data,

        version: {
          increment: 1,
        },
      },
    });
  }

  /* =========================================
     DELETE TEMPLATE
  ========================================= */

  async deleteTemplate(id: string) {
    return prisma.notificationTemplate.delete({
      where: { id },
    });
  }

  /* =========================================
     TOGGLE STATUS
  ========================================= */

  async toggleStatus(id: string) {
    const template =
      await prisma.notificationTemplate.findUnique({
        where: { id },
      });

    if (!template) {
      throw new Error(
        "Template not found"
      );
    }

    return prisma.notificationTemplate.update({
      where: { id },

      data: {
        isActive:
          !template.isActive,
      },
    });
  }

  /* =========================================
     APPROVE TEMPLATE
  ========================================= */

  async approveTemplate(
    id: string,
    approvedBy?: string
  ) {
    return prisma.notificationTemplate.update({
      where: { id },

      data: {
        approvedBy:
          approvedBy || "SYSTEM",
      },
    });
  }

  /* =========================================
     DELIVERY STATS
  ========================================= */

  async updateDeliveryStats(
    templateId: string,
    delivered: boolean
  ) {
    return prisma.notificationTemplate.update({
      where: {
        id: templateId,
      },

      data: {
        totalSent: {
          increment: 1,
        },

        ...(delivered
          ? {
              totalDelivered: {
                increment: 1,
              },
            }
          : {
              totalFailed: {
                increment: 1,
              },
            }),
      },
    });
  }

  /* =========================================
     TEMPLATE ANALYTICS
  ========================================= */

  async getAnalytics() {
    return prisma.notificationTemplate.aggregate({
      _count: {
        id: true,
      },

      _sum: {
        totalSent: true,
        totalDelivered: true,
        totalFailed: true,
      },
    });
  }

  /* =========================================
     TEMPLATE RENDER ENGINE
  ========================================= */

  renderTemplate(
    template: string,
    data: Record<string, any>
  ) {
    return template.replace(
      /{{(.*?)}}/g,
      (_, key) =>
        data[key.trim()] || ""
    );
  }
}

export const notificationTemplateService =
  new NotificationTemplateService();
