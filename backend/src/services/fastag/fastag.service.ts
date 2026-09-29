import prisma from "../../prisma/prisma";

export interface CreateFastagPayload {
  customerId: string;
  vehicleNumber: string;
  vehicleType: string;
  mobileNumber?: string;
  amount: number;
}

export class FastagService {
  /* ========================================
     CREATE FASTAG
  ======================================== */
  static async createFastag(
    payload: CreateFastagPayload
  ) {
    return prisma.fastTag.create({
      data: {
        userId: payload.customerId,
        vehicleNo: payload.vehicleNumber,
        provider: payload.vehicleType,
        amount: payload.amount,
        status: "ACTIVE",
      },
    });
  }

  /* ========================================
     GET FASTAG BY ID
  ======================================== */
  static async getFastagById(id: string) {
    return prisma.fastTag.findUnique({
      where: { id },
    });
  }

  /* ========================================
     GET CUSTOMER FASTAGS
  ======================================== */
  static async getCustomerFastags(
    customerId: string
  ) {
    return prisma.fastTag.findMany({
      where: {
        userId: customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ========================================
     RECHARGE FASTAG
  ======================================== */
  static async rechargeFastag(
    fastagId: string,
    amount: number
  ) {
    const fastag = await prisma.fastTag.findUnique({
      where: { id: fastagId },
    });

    if (!fastag) {
      throw new Error("FASTag not found");
    }

    return prisma.fastTag.update({
      where: {
        id: fastagId,
      },
      data: {
        amount: fastag.amount + amount,
      },
    });
  }

  /* ========================================
     ACTIVATE FASTAG
  ======================================== */
  static async activateFastag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: true,
        status: "ACTIVE",
      },
    });
  }

  /* ========================================
     DEACTIVATE FASTAG
  ======================================== */
  static async deactivateFastag(id: string) {
    return prisma.fastTag.update({
      where: { id },
      data: {
        isActive: false,
        status: "INACTIVE",
      },
    });
  }

  /* ========================================
     GET ALL FASTAGS
  ======================================== */
  static async getAllFastags() {
    const data = await prisma.fastTag.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      data,
      total: data.length,
      page: 1,
      limit: data.length,
      totalPages: 1,
    };
  }

  /* ========================================
     FASTAG STATS
  ======================================== */
  static async getStats() {
    const total = await prisma.fastTag.count();

    const active = await prisma.fastTag.count({
      where: {
        isActive: true,
      },
    });

    const inactive = await prisma.fastTag.count({
      where: {
        isActive: false,
      },
    });

    return {
      total,
      active,
      inactive,
    };
  }

  /* ========================================
     TRANSACTIONS (TEMP)
  ======================================== */
  static async getTransactions(
    fastagId: string
  ) {
    return [];
  }

  /* ========================================
     CONTROLLER COMPATIBILITY METHODS
  ======================================== */

  static async getFastTags(params?: any) {
    return this.getAllFastags();
  }

  static async getFastTagById(id: string) {
    return this.getFastagById(id);
  }

  static async createFastTag(
    payload: CreateFastagPayload
  ) {
    return this.createFastag(payload);
  }

  static async activateTag(id: string) {
    return this.activateFastag(id);
  }

  static async deactivateTag(id: string) {
    return this.deactivateFastag(id);
  }

  static async getFastTagStats() {
    return this.getStats();
  }
}

export default FastagService;