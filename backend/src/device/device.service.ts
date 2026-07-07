import prisma from "../../database/prisma/client";

class DeviceService {

  async createDevice(data: {
    userId: string;
    deviceName: string;
    deviceType: string;
    browser?: string;
    os?: string;
    ipAddress?: string;
  }) {

    return prisma.device.create({
      data,
    });

  }

  async getAllDevices(
    page = 1,
    limit = 10
  ) {

    const skip =
      (page - 1) * limit;

    const [devices, total] =
      await Promise.all([

        prisma.device.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.device.count(),
      ]);

    return {
      devices,
      total,
      page,
      limit,
    };
  }

  async getDeviceById(
    id: string
  ) {

    return prisma.device.findUnique({
      where: { id },
    });

  }

  async getUserDevices(
    userId: string
  ) {

    return prisma.device.findMany({
      where: {
        userId,
      },
      orderBy: {
        lastLoginAt: "desc",
      },
    });

  }

  async blockDevice(
    id: string
  ) {

    return prisma.device.update({
      where: { id },
      data: {
        isBlocked: true,
      },
    });

  }

  async unblockDevice(
    id: string
  ) {

    return prisma.device.update({
      where: { id },
      data: {
        isBlocked: false,
      },
    });

  }

  async deleteDevice(
    id: string
  ) {

    return prisma.device.delete({
      where: { id },
    });

  }

  async updateLastLogin(
    id: string
  ) {

    return prisma.device.update({
      where: { id },
      data: {
        lastLoginAt:
          new Date(),
      },
    });

  }

  async getDeviceAnalytics() {

    const [
      totalDevices,
      activeDevices,
      blockedDevices,
    ] = await Promise.all([

      prisma.device.count(),

      prisma.device.count({
        where: {
          isActive: true,
        },
      }),

      prisma.device.count({
        where: {
          isBlocked: true,
        },
      }),
    ]);

    return {
      totalDevices,
      activeDevices,
      blockedDevices,
    };
  }

}

export default new DeviceService();