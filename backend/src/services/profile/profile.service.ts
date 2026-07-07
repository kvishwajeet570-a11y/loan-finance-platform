import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";

interface UpdateProfileDTO {
  name?: string;
  email?: string;
  phoneNo?: string;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dob?: string;
}

class ProfileService {
  /**
   * Get Profile
   */
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },

      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        profileImage: true,
        isVerified: true,
        isBlocked: true,
        createdAt: true,
        updatedAt: true,

        address: true,
        city: true,
        state: true,
        pincode: true,
        dob: true,

        wallet: true,

        loans: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  /**
   * Update Profile
   */
  async updateProfile(
    userId: string,
    payload: UpdateProfileDTO
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error("User not found");
    }

    if (
      payload.email &&
      payload.email !== user.email
    ) {
      const emailExists =
        await prisma.user.findUnique({
          where: {
            email: payload.email,
          },
        });

      if (emailExists) {
        throw new Error(
          "Email already exists"
        );
      }
    }

    if (
      payload.phoneNo &&
      payload.phoneNo !== user.phoneNo
    ) {
      const phoneExists =
        await prisma.user.findUnique({
          where: {
            phoneNo: payload.phoneNo,
          },
        });

      if (phoneExists) {
        throw new Error(
          "Phone number already exists"
        );
      }
    }

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: payload,
    });
  }

  /**
   * Change Password
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error("User not found");
    }

    const isValid =
      await bcrypt.compare(
        oldPassword,
        user.password
      );

    if (!isValid) {
      throw new Error(
        "Old password incorrect"
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password:
          hashedPassword,
      },
    });
  }

  /**
   * Upload Profile Photo
   */
  async updateProfileImage(
    userId: string,
    imageUrl: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        profileImage:
          imageUrl,
      },
    });
  }

  /**
   * Complete Profile %
   */
  async profileCompletion(
    userId: string
  ) {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    let score = 0;

    if (user.name) score += 15;
    if (user.email) score += 15;
    if (user.phoneNo) score += 15;
    if (user.profileImage)
      score += 15;
    if (user.address)
      score += 10;
    if (user.city) score += 10;
    if (user.state) score += 10;
    if (user.pincode)
      score += 5;
    if (user.dob) score += 5;

    return {
      completion:
        Math.min(score, 100),
    };
  }

  /**
   * Account Summary
   */
  async accountSummary(
    userId: string
  ) {
    const [
      loans,
      wallet,
      commissions,
    ] = await Promise.all([
      prisma.loanApplication.count({
        where: {
          userId,
        },
      }),

      prisma.wallet.findUnique({
        where: {
          userId,
        },
      }),

      prisma.commission.aggregate({
        where: {
          userId,
        },

        _sum: {
          commissionAmount:
            true,
        },
      }),
    ]);

    return {
      totalLoans: loans,

      walletBalance:
        wallet?.balance || 0,

      totalCommission:
        commissions._sum
          .commissionAmount || 0,
    };
  }

  /**
   * User Activity
   */
  async recentActivity(
    userId: string
  ) {
    const notifications =
      await prisma.notification.findMany({
        where: {
          userId,
        },

        take: 10,

        orderBy: {
          createdAt:
            "desc",
        },
      });

    return notifications;
  }

  /**
   * KYC Status
   */
  async getKycStatus(
    userId: string
  ) {
    return prisma.kYC.findFirst({
      where: {
        userId,
      },

      orderBy: {
        createdAt:
          "desc",
      },
    });
  }

  /**
   * Delete Profile
   */
  async deleteAccount(
    userId: string
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        isBlocked: true,
      },
    });
  }

  /**
   * Dashboard Profile Data
   */
  async dashboardProfile(
    userId: string
  ) {
    const [
      profile,
      completion,
      summary,
    ] = await Promise.all([
      this.getProfile(userId),

      this.profileCompletion(
        userId
      ),

      this.accountSummary(
        userId
      ),
    ]);

    return {
      profile,
      completion,
      summary,
    };
  }
}

export default new ProfileService();