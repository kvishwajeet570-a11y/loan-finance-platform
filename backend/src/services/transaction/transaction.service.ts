import { Prisma } from "@prisma/client";
import transactionRepository from "../../repositories/transaction/transaction.repository";

class TransactionService {
  // ==========================================================
  // CREATE
  // ==========================================================

  async create(data: Prisma.TransactionCreateInput) {
    return transactionRepository.create(data);
  }

  // ==========================================================
  // GET
  // ==========================================================

  async getById(id: string) {
    return transactionRepository.findById(id);
  }

  async getByTransactionId(transactionId: string) {
    return transactionRepository.findByTransactionId(transactionId);
  }

  async getByReferenceId(referenceId: string) {
    return transactionRepository.findByReferenceId(referenceId);
  }

  async getAll(
    where: Prisma.TransactionWhereInput = {},
    page = 1,
    limit = 20
  ) {
    return transactionRepository.findMany(
      where,
      page,
      limit
    );
  }

  // ==========================================================
  // UPDATE
  // ==========================================================

  async update(
    id: string,
    data: Prisma.TransactionUpdateInput
  ) {
    return transactionRepository.update(
      id,
      data
    );
  }

  // ==========================================================
  // DELETE
  // ==========================================================

  async delete(id: string) {
    return transactionRepository.delete(id);
  }

  async bulkDelete(ids: string[]) {
    return transactionRepository.deleteMany(ids);
  }

  // ==========================================================
  // STATUS ACTIONS
  // ==========================================================

  async approve(
    id: string,
    approvedBy: string
  ) {
    return transactionRepository.update(id, {
      status: "success",
      isApproved: true,
      approvedBy,
      approvedAt: new Date(),
    });
  }

  async verify(
    id: string,
    verifiedBy: string
  ) {
    return transactionRepository.update(id, {
      isVerified: true,
      verifiedBy,
      verifiedAt: new Date(),
    });
  }

  async reject(
    id: string,
    rejectedBy: string,
    rejectReason: string
  ) {
    return transactionRepository.update(id, {
      status: "failed",
      rejectedBy,
      rejectedAt: new Date(),
      rejectReason,
    });
  }

  async refund(
    id: string,
    refundAmount: number,
    refundReason: string,
    refundedBy: string
  ) {
    return transactionRepository.update(id, {
      status: "refunded",
      isRefunded: true,
      refundAmount,
      refundReason,
      refundedBy,
      refundedAt: new Date(),
    });
  }

  async process(id: string) {
    return transactionRepository.update(id, {
      status: "processing",
    });
  }

  // ==========================================================
  // BULK
  // ==========================================================

  async bulkApprove(
    ids: string[],
    approvedBy: string
  ) {
    return transactionRepository.updateMany(
      ids,
      {
        status: "success",
        isApproved: true,
        approvedBy,
        approvedAt: new Date(),
      }
    );
  }

  async bulkReject(
    ids: string[],
    rejectedBy: string,
    rejectReason: string
  ) {
    return transactionRepository.updateMany(
      ids,
      {
        status: "failed",
        rejectedBy,
        rejectedAt: new Date(),
        rejectReason,
      }
    );
  }

  async bulkRefund(
    ids: string[],
    refundedBy: string
  ) {
    return transactionRepository.updateMany(
      ids,
      {
        status: "refunded",
        isRefunded: true,
        refundedBy,
        refundedAt: new Date(),
      }
    );
  }

  // ==========================================================
  // REPORTS
  // ==========================================================

  async dashboard() {
    return transactionRepository.dashboard();
  }

  async analytics() {
    return transactionRepository.groupByStatus();
  }

  async statistics() {
    return transactionRepository.aggregate();
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  async search(
    where: Prisma.TransactionWhereInput,
    page = 1,
    limit = 20
  ) {
    return transactionRepository.findMany(
      where,
      page,
      limit
    );
  }

  // ==========================================================
  // COUNT
  // ==========================================================

  async count(
    where: Prisma.TransactionWhereInput = {}
  ) {
    return transactionRepository.count(where);
  }
}

export default new TransactionService();