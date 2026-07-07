import { prisma } from "../../prisma";

export class ProfileRepository {

  /* =========================
      GET PROFILE
  ========================= */

  static async getProfile(
    userId: string
  ) {

    return prisma.user.findUnique({

      where: {
        id: userId
      },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        profileImage: true,
        gender: true,
        dob: true,
        address: true,
        city: true,
        state: true,
        pincode: true,
        isVerified: true,
        createdAt: true
      }
    });
  }

  /* =========================
      UPDATE PROFILE
  ========================= */

  static async updateProfile(
    userId: string,
    data: Partial<{
      name: string;
      gender: string;
      dob: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
      profileImage: string;
    }>
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data
    });
  }

  /* =========================
      UPDATE PROFILE IMAGE
  ========================= */

  static async updateProfileImage(
    userId: string,
    profileImage: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        profileImage
      }
    });
  }

  /* =========================
      REMOVE PROFILE IMAGE
  ========================= */

  static async removeProfileImage(
    userId: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        profileImage: null
      }
    });
  }

  /* =========================
      UPDATE ADDRESS
  ========================= */

  static async updateAddress(
    userId: string,
    address: string,
    city: string,
    state: string,
    pincode: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        address,
        city,
        state,
        pincode
      }
    });
  }

  /* =========================
      CHANGE EMAIL
  ========================= */

  static async updateEmail(
    userId: string,
    email: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        email
      }
    });
  }

  /* =========================
      CHANGE PHONE
  ========================= */

  static async updatePhone(
    userId: string,
    phoneNo: string
  ) {

    return prisma.user.update({

      where: {
        id: userId
      },

      data: {
        phoneNo
      }
    });
  }

  /* =========================
      PROFILE COMPLETION
  ========================= */

  static async getProfileCompletion(
    userId: string
  ) {

    const user =
      await prisma.user.findUnique({
        where: {
          id: userId
        }
      });

    if (!user) {
      return 0;
    }

    const fields = [
      user.name,
      user.email,
      user.phoneNo,
      user.profileImage,
      user.gender,
      user.dob,
      user.address,
      user.city,
      user.state,
      user.pincode
    ];

    const completed =
      fields.filter(Boolean).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }

  /* =========================
      PROFILE SUMMARY
  ========================= */

  static async getProfileSummary(
    userId: string
  ) {

    const [
      user,
      totalLoans,
      totalDocuments,
      totalNotifications
    ] = await Promise.all([

      prisma.user.findUnique({
        where: {
          id: userId
        }
      }),

      prisma.loanApplication.count({
        where: {
          userId
        }
      }),

      prisma.document.count({
        where: {
          userId
        }
      }),

      prisma.notification.count({
        where: {
          userId
        }
      })
    ]);

    return {
      user,
      totalLoans,
      totalDocuments,
      totalNotifications
    };
  }

  /* =========================
      ACCOUNT STATUS
  ========================= */

  static async getAccountStatus(
    userId: string
  ) {

    return prisma.user.findUnique({

      where: {
        id: userId
      },

      select: {
        isVerified: true,
        isBlocked: true,
        role: true,
        createdAt: true
      }
    });
  }

  /* =========================
      DELETE ACCOUNT
  ========================= */

  static async deleteProfile(
    userId: string
  ) {

    return prisma.user.delete({
      where: {
        id: userId
      }
    });
  }

  /* =========================
      PROFILE DASHBOARD
  ========================= */

  static async getDashboard(
    userId: string
  ) {

    const [
      profile,
      loanCount,
      approvedLoans,
      pendingLoans,
      unreadNotifications
    ] = await Promise.all([

      this.getProfile(userId),

      prisma.loanApplication.count({
        where: { userId }
      }),

      prisma.loanApplication.count({
        where: {
          userId,
          status: "APPROVED"
        }
      }),

      prisma.loanApplication.count({
        where: {
          userId,
          status: "PENDING"
        }
      }),

      prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })
    ]);

    return {
      profile,
      loanCount,
      approvedLoans,
      pendingLoans,
      unreadNotifications
    };
  }
}