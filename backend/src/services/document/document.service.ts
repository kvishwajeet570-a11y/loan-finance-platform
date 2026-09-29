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

  async getDocumentById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
  }

  async getUserDocuments(
    userId: string
  ) {
    return prisma.document.findMany({
      where: { userId },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async verifyDocument(
    documentId: string,
    verifiedBy: string
  ) {
    return prisma.document.update({
      where: { id: documentId },
      data: {
        status: "VERIFIED",
        verifiedBy,
      },
    });
  }

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

    const where: Prisma.DocumentWhereInput = {};

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
      where.documentType = documentType;
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

  async getVerifiedDocuments() {
    return prisma.document.findMany({
      where: {
        status: "VERIFIED",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getRejectedDocuments() {
    return prisma.document.findMany({
      where: {
        status: "REJECTED",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteDocument(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  }

  async getLoanDocuments(
    loanId: string
  ) {
    return prisma.document.findMany({
      where: { loanId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

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
// ========================================
// UPDATE DOCUMENT
// ========================================

async updateDocument(id: string, data: any) {
  return prisma.document.update({
    where: { id },
    data,
  });
}

// ========================================
// SEARCH DOCUMENTS
// ========================================

async searchDocuments(search: string) {
  return prisma.document.findMany({
    where: {
      OR: [
        {
          documentName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          documentType: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ========================================
// DOCUMENTS BY TYPE
// ========================================

async getDocumentsByType(type: string) {
  return prisma.document.findMany({
    where: {
      documentType: type,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ========================================
// DOWNLOAD DOCUMENT
// ========================================

async downloadDocument(id: string) {
  return prisma.document.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
}

// ========================================
// DOCUMENT DASHBOARD
// ========================================

async getDocumentDashboard() {
  return this.getDocumentStats();
}

// ========================================
// RECENT DOCUMENTS
// ========================================

async getRecentDocuments(limit: number = 10) {
  return prisma.document.findMany({
    take: limit,
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ========================================
// BULK VERIFY DOCUMENTS
// ========================================

async bulkVerifyDocuments(
  ids: string[],
  verifiedBy: string
) {
  return prisma.document.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: "VERIFIED",
      verifiedBy,
    },
  });
}

// ========================================
// BULK REJECT DOCUMENTS
// ========================================

async bulkRejectDocuments(
  ids: string[],
  reason: string
) {
  return prisma.document.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      status: "REJECTED",
      rejectionReason: reason,
    },
  });
}

// ========================================
// EXPORT DOCUMENTS EXCEL
// ========================================

async exportDocumentsExcel() {
  return prisma.document.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// ========================================
// EXPORT DOCUMENTS PDF
// ========================================

async exportDocumentsPdf() {
  return prisma.document.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

} // Class DocumentService ends here

export default new DocumentService();

