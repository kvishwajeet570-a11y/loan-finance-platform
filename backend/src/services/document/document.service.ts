import prisma from "../../prisma/prisma";
import { Prisma } from "@prisma/client";

interface CreateDocumentDto {
  userId: string;
  loanId?: string;

  documentType: string;
  documentName: string;

  fileUrl: string;
  fileSize?: number;

  mimeType?: string;
}

interface DocumentFilters {
  page?: number;
  limit?: number;
  search?: string;
  documentType?: string;
  status?: string;
}

class DocumentService {
  /**
   * Upload Document
   */
  async uploadDocument(
    data: CreateDocumentDto
  ) {
    return prisma.document.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }

  /**
   * Get Document By ID
   */
  async getDocumentById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  /**
   * User Documents
   */
  async getUserDocuments(
    userId: string
  ) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Verify Document
   */
  async verifyDocument(
    documentId: string,
    verifiedBy: string
  ) {
    return prisma.document.update({
      where: { id: documentId },
      data: {
        status: "VERIFIED",
        verifiedBy,
        verifiedAt: new Date(),
      },
    });
  }

  /**
   * Reject Document
   */
  async rejectDocument(
    documentId: string,
    reason: string
  ) {
    return prisma.document.update({
      where: { id: documentId },
      data: {
        status: "REJECTED",
        rejectionReason: reason,
      },
    });
  }

  /**
   * Get All Documents
   */
  async getDocuments(
    filters: DocumentFilters
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      documentType,
      status,
    } = filters;

    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput =
      {};

    if (search) {
      where.OR = [
        {
          documentName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (documentType) {
      where.documentType =
        documentType;
    }

    if (status) {
      where.status = status;
    }

    const [documents, total] =
      await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take: limit,
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.document.count({
          where,
        }),
      ]);

    return {
      documents,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  /**
   * Pending Documents
   */
  async getPendingDocuments() {
    return prisma.document.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Delete Document
   */
  async deleteDocument(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }

  /**
   * Loan Documents
   */
  async getLoanDocuments(
    loanId: string
  ) {
    return prisma.document.findMany({
      where: {
        loanId,
      },
    });
  }

  /**
   * KYC Completion Check
   */
  async checkKYCCompletion(
    userId: string
  ) {
    const documents =
      await prisma.document.findMany({
        where: {
          userId,
          status: "VERIFIED",
        },
      });

    const requiredDocs = [
      "PAN",
      "AADHAAR",
      "BANK_STATEMENT",
    ];

    const uploaded =
      documents.map(
        (doc) => doc.documentType
      );

    const completed =
      requiredDocs.every((doc) =>
        uploaded.includes(doc)
      );

    return {
      completed,
      uploaded,
      requiredDocs,
    };
  }

  /**
   * Dashboard Statistics
   */
  async getDocumentStats() {
    const [
      total,
      verified,
      pending,
      rejected,
    ] = await Promise.all([
      prisma.document.count(),

      prisma.document.count({
        where: {
          status: "VERIFIED",
        },
      }),

      prisma.document.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.document.count({
        where: {
          status: "REJECTED",
        },
      }),
    ]);

    return {
      total,
      verified,
      pending,
      rejected,
    };
  }
}

export default new DocumentService();