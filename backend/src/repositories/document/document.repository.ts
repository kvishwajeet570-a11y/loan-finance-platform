import prisma from "../../prisma/prisma";

export class DocumentRepository {

  /* ==========================
      UPLOAD DOCUMENT
  ========================== */

  static async createDocument(data: {
    userId: string;
    documentType: string;
    documentName: string;
    fileUrl: string;
    fileSize?: number;
    mimeType?: string;
  }) {

    return prisma.document.create({
      data
    });
  }

  /* ==========================
      GET DOCUMENT BY ID
  ========================== */

  static async getDocumentById(
    documentId: string
  ) {

    return prisma.document.findUnique({
      where: {
        id: documentId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNo: true
          }
        }
      }
    });
  }

  /* ==========================
      USER DOCUMENTS
  ========================== */

  static async getUserDocuments(
    userId: string
  ) {

    return prisma.document.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      DOCUMENT TYPE FILTER
  ========================== */

  static async getDocumentsByType(
    documentType: string
  ) {

    return prisma.document.findMany({
      where: {
        documentType
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* ==========================
      VERIFY DOCUMENT
  ========================== */

  static async verifyDocument(
    documentId: string,
    verifiedBy: string
  ) {

    return prisma.document.update({
      where: {
        id: documentId
      },
      data: {
        status: "VERIFIED",
        verifiedBy,
      }
    });
  }

  /* ==========================
      REJECT DOCUMENT
  ========================== */

  static async rejectDocument(
  documentId: string,
  rejectionReason: string
) {

  return prisma.document.update({
    where: {
      id: documentId
    },
    data: {
      status: "REJECTED",
      rejectionReason
    }
  });
}

/* ==========================
    UPDATE DOCUMENT
========================== */

static async updateDocument(
  documentId: string,
  data: Partial<{
    documentName: string;
    fileUrl: string;
    rejectionReason: string;
  }>
) {

  return prisma.document.update({
    where: {
      id: documentId
    },
    data
  });
}

  /* ==========================
      DELETE DOCUMENT
  ========================== */

  static async deleteDocument(
    documentId: string
  ) {

    return prisma.document.delete({
      where: {
        id: documentId
      }
    });
  }

  /* ==========================
      SEARCH DOCUMENTS
  ========================== */

  static async searchDocuments(
    keyword: string
  ) {

    return prisma.document.findMany({
      where: {
        OR: [
          {
            documentType: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            documentName: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      }
    });
  }

  /* ==========================
      ADMIN ALL DOCUMENTS
  ========================== */

  static async getAllDocuments(
    page = 1,
    limit = 20
  ) {

    const skip =
      (page - 1) * limit;

    const [documents, total] =
      await Promise.all([

        prisma.document.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc"
          },
          include: {
            user: true
          }
        }),

        prisma.document.count()
      ]);

    return {
      total,
      page,
      limit,
      documents
    };
  }

  /* ==========================
      DOCUMENT ANALYTICS
  ========================== */

  static async getDocumentAnalytics() {

    const [
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      rejectedDocuments
    ] = await Promise.all([

      prisma.document.count(),

      prisma.document.count({
        where: {
          status: "VERIFIED"
        }
      }),

      prisma.document.count({
        where: {
          status: "PENDING"
        }
      }),

      prisma.document.count({
        where: {
          status: "REJECTED"
        }
      })
    ]);

    return {
      totalDocuments,
      verifiedDocuments,
      pendingDocuments,
      rejectedDocuments
    };
  }

  /* ==========================
      PENDING DOCUMENTS
  ========================== */

  static async getPendingDocuments() {

    return prisma.document.findMany({
      where: {
        status: "PENDING"
      },
      include: {
        user: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });
  }

  /* ==========================
      RECENT DOCUMENTS
  ========================== */

  static async getRecentDocuments(
    limit = 10
  ) {

    return prisma.document.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: true
      }
    });
  }
}