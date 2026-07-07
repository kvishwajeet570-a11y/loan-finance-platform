import { prisma } from "../config/prisma";

export interface CreateFastagPayload {
  customerId: string;
  vehicleNumber: string;
  vehicleType: string;
  mobileNumber: string;
  amount: number;
}

export class FastagService {
  /* ========================================
     CREATE FASTAG
  ======================================== */
  static async createFastag(
    payload: CreateFastagPayload
  ) {
    return prisma.fastag.create({
      data: {
        customerId: payload.customerId,
        vehicleNumber: payload.vehicleNumber,
        vehicleType: payload.vehicleType,
        mobileNumber: payload.mobileNumber,
        balance: payload.amount,
        status: "ACTIVE",
      },
    });
  }

  /* ========================================
     GET FASTAG BY ID
  ======================================== */
  static async getFastagById(id: string) {
    return prisma.fastag.findUnique({
      where: { id },
    });
  }

  /* ========================================
     GET CUSTOMER FASTAGS
  ======================================== */
  static async getCustomerFastags(
    customerId: string
  ) {
    return prisma.fastag.findMany({
      where: {
        customerId,
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
    return prisma.$transaction(
      async (tx) => {
        const fastag =
          await tx.fastag.findUnique({
            where: { id: fastagId },
          });

        if (!fastag) {
          throw new Error(
            "Fastag not found"
          );
        }

        const updated =
          await tx.fastag.update({
            where: {
              id: fastagId,
            },
            data: {
              balance:
                fastag.balance + amount,
            },
          });

        await tx.fastagTransaction.create({
          data: {
            fastagId,
            amount,
            type: "RECHARGE",
            status: "SUCCESS",
          },
        });

        return updated;
      }
    );
  }

  /* ========================================
     DEDUCT TOLL
  ======================================== */
  static async deductToll(
    fastagId: string,
    amount: number
  ) {
    return prisma.$transaction(
      async (tx) => {
        const fastag =
          await tx.fastag.findUnique({
            where: { id: fastagId },
          });

        if (!fastag) {
          throw new Error(
            "Fastag not found"
          );
        }

        if (
          fastag.balance < amount
        ) {
          throw new Error(
            "Insufficient balance"
          );
        }

        const updated =
          await tx.fastag.update({
            where: {
              id: fastagId,
            },
            data: {
              balance:
                fastag.balance - amount,
            },
          });

        await tx.fastagTransaction.create({
          data: {
            fastagId,
            amount,
            type: "TOLL_DEDUCTION",
            status: "SUCCESS",
          },
        });

        return updated;
      }
    );
  }

  /* ========================================
     GET TRANSACTIONS
  ======================================== */
  static async getTransactions(
    fastagId: string
  ) {
    return prisma.fastagTransaction.findMany(
      {
        where: {
          fastagId,
        },
        orderBy: {
          createdAt: "desc",
        },
      }
    );
  }

  /* ========================================
     BLOCK FASTAG
  ======================================== */
  static async blockFastag(
    fastagId: string
  ) {
    return prisma.fastag.update({
      where: {
        id: fastagId,
      },
      data: {
        status: "BLOCKED",
      },
    });
  }

  /* ========================================
     ACTIVATE FASTAG
  ======================================== */
  static async activateFastag(
    fastagId: string
  ) {
    return prisma.fastag.update({
      where: {
        id: fastagId,
      },
      data: {
        status: "ACTIVE",
      },
    });
  }
}