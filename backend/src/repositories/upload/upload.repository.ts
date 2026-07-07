import { prisma } from "../../prisma";

export class UploadRepository {

  /* =====================================
      CREATE UPLOAD
  ===================================== */

  static async createUpload(data: {
    userId?: string;
    fileName: string;
    originalName: string;
    fileUrl: string;
    filePath: string;
    fileType: string;
    mimeType: string;
    fileSize: number;
    category?: string;
    folder?: string;
    extension?: string;
    uploadedBy?: string;
    metadata?: any;
    tags?: string[];
    isPublic?: boolean;
  }) {

    return prisma.upload.create({
      data
    });
  }

  /* =====================================
      GET BY ID
  ===================================== */

  static async getById(id: string) {

    return prisma.upload.findUnique({

      where: { id },

      include: {
        user: true
      }
    });
  }

  /* =====================================
      GET FILE
  ===================================== */

  static async getFileByUrl(
    fileUrl: string
  ) {

    return prisma.upload.findFirst({

      where: {
        fileUrl
      }
    });
  }

  /* =====================================
      USER FILES
  ===================================== */

  static async getUserFiles(
    userId: string,
    page = 1,
    limit = 20
  ) {

    return prisma.upload.findMany({

      where: {
        userId
      },

      skip: (page - 1) * limit,

      take: limit,

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =====================================
      CATEGORY FILES
  ===================================== */

  static async getByCategory(
    category: string
  ) {

    return prisma.upload.findMany({

      where: {
        category
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =====================================
      FILE TYPE
  ===================================== */

  static async getByFileType(
    fileType: string
  ) {

    return prisma.upload.findMany({

      where: {
        fileType
      }
    });
  }

  /* =====================================
      UPDATE FILE
  ===================================== */

  static async updateFile(
    id: string,
    data: any
  ) {

    return prisma.upload.update({

      where: { id },

      data
    });
  }

  /* =====================================
      VIEW COUNT
  ===================================== */

  static async incrementView(
    id: string
  ) {

    return prisma.upload.update({

      where: { id },

      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }

  /* =====================================
      DOWNLOAD COUNT
  ===================================== */

  static async incrementDownload(
    id: string
  ) {

    return prisma.upload.update({

      where: { id },

      data: {
        downloadCount: {
          increment: 1
        }
      }
    });
  }

  /* =====================================
      MAKE PUBLIC
  ===================================== */

  static async makePublic(
    id: string
  ) {

    return prisma.upload.update({

      where: { id },

      data: {
        isPublic: true
      }
    });
  }

  /* =====================================
      MAKE PRIVATE
  ===================================== */

  static async makePrivate(
    id: string
  ) {

    return prisma.upload.update({

      where: { id },

      data: {
        isPublic: false
      }
    });
  }

  /* =====================================
      DELETE FILE
  ===================================== */

  static async deleteFile(
    id: string
  ) {

    return prisma.upload.delete({

      where: { id }
    });
  }

  /* =====================================
      SEARCH FILES
  ===================================== */

  static async searchFiles(
    keyword: string
  ) {

    return prisma.upload.findMany({

      where: {

        OR: [

          {
            fileName: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            originalName: {
              contains: keyword,
              mode: "insensitive"
            }
          },

          {
            category: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =====================================
      ALL FILES
  ===================================== */

  static async getAllFiles(
    page = 1,
    limit = 50
  ) {

    const skip =
      (page - 1) * limit;

    const [files, total] =
      await Promise.all([

        prisma.upload.findMany({

          skip,
          take: limit,

          include: {
            user: true
          },

          orderBy: {
            createdAt: "desc"
          }
        }),

        prisma.upload.count()
      ]);

    return {
      files,
      total,
      page,
      limit
    };
  }

  /* =====================================
      STORAGE ANALYTICS
  ===================================== */

  static async getAnalytics() {

    const [

      totalFiles,

      totalStorage,

      publicFiles,

      privateFiles

    ] = await Promise.all([

      prisma.upload.count(),

      prisma.upload.aggregate({
        _sum: {
          fileSize: true
        }
      }),

      prisma.upload.count({
        where: {
          isPublic: true
        }
      }),

      prisma.upload.count({
        where: {
          isPublic: false
        }
      })
    ]);

    return {

      totalFiles,

      totalStorage:
        totalStorage._sum.fileSize || 0,

      publicFiles,

      privateFiles
    };
  }

  /* =====================================
      RECENT FILES
  ===================================== */

  static async getRecentFiles(
    limit = 20
  ) {

    return prisma.upload.findMany({

      take: limit,

      include: {
        user: true
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  /* =====================================
      DASHBOARD
  ===================================== */

  static async getDashboard() {

    const [

      analytics,

      recentFiles

    ] = await Promise.all([

      this.getAnalytics(),

      this.getRecentFiles()
    ]);

    return {

      analytics,

      recentFiles
    };
  }
}