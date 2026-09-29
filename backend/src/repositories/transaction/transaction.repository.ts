import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";

class TransactionRepository {
  // ==========================================================
  // CREATE
  // ==========================================================

  async create(data: Prisma.TransactionCreateInput) {
    return prisma.transaction.create({
      data,
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  // ==========================================================
  // FIND UNIQUE
  // ==========================================================

  async findById(id: string) {
    return prisma.transaction.findFirst({
      where: {
        OR: [
          { id },
          { transactionId: id },
          { referenceId: id },
        ],
      },
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  async findByTransactionId(transactionId: string) {
    return prisma.transaction.findUnique({
      where: {
        transactionId,
      },
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  async findByReferenceId(referenceId: string) {
    return prisma.transaction.findUnique({
      where: {
        referenceId,
      },
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  // ==========================================================
  // FIND MANY
  // ==========================================================

  async findMany(
    where: Prisma.TransactionWhereInput = {},
    page = 1,
    limit = 20
  ) {
    const skip = (page - 1) * limit;

    const [data, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          wallet: true,
        },
      }),

      prisma.transaction.count({
        where,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  // ==========================================================
  // UPDATE
  // ==========================================================

  async update(
    id: string,
    data: Prisma.TransactionUpdateInput
  ) {
    return prisma.transaction.update({
      where: {
        id,
      },
      data,
      include: {
        user: true,
        wallet: true,
      },
    });
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async delete(id: string) {
    return prisma.transaction.delete({
      where: {
        id,
      },
    });
  }

  async deleteMany(ids: string[]) {
    return prisma.transaction.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  // ==========================================================
  // COUNT
  // ==========================================================

  async count(
    where: Prisma.TransactionWhereInput = {}
  ) {
    return prisma.transaction.count({
      where,
    });
  }

  // ==========================================================
  // AGGREGATE
  // ==========================================================

  async aggregate(
    where: Prisma.TransactionWhereInput = {}
  ) {
    return prisma.transaction.aggregate({
      where,
      _count: true,
      _sum: {
        amount: true,
        fee: true,
        gst: true,
        commission: true,
        cashback: true,
      },
      _avg: {
        amount: true,
      },
      _min: {
        amount: true,
      },
      _max: {
        amount: true,
      },
    });
  }

  // ==========================================================
  // GROUP BY STATUS
  // ==========================================================

  async groupByStatus() {
    return prisma.transaction.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      _sum: {
        amount: true,
      },
    });
  }

  // ==========================================================
  // BULK UPDATE
  // ==========================================================

  async updateMany(
    ids: string[],
    data: Prisma.TransactionUpdateManyMutationInput
  ) {
    return prisma.transaction.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data,
    });
  }

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  async dashboard() {
    return prisma.$transaction([
      prisma.transaction.count(),

      prisma.transaction.aggregate({
        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.count({
        where: {
          status: "pending",
        },
      }),

      prisma.transaction.count({
        where: {
          status: "success",
        },
      }),

      prisma.transaction.count({
        where: {
          status: "failed",
        },
      }),

      prisma.transaction.count({
        where: {
          isRefunded: true,
        },
      }),

      prisma.transaction.findMany({
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: true,
          wallet: true,
        },
      }),
    ]);
  }
}

export default new TransactionRepository();