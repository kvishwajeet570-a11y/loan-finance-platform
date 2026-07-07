import prisma from "../../prisma/prisma";

export class AuthRepository {

  async createUser(data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    otp: string;
    otpExpiry: Date;
  }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNo: data.phoneNo,
        password: data.password,
        otp: data.otp,
        otpExpiry: data.otpExpiry,
        isVerified: false,
        isBlocked: false,
        role: "user",
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phoneNo: string) {
    return prisma.user.findUnique({
      where: { phoneNo },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        wallet: true,
        loans: true,
        referral: true,
      },
    });
  }

  async updateOTP(
    userId: string,
    otp: string,
    otpExpiry: Date
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        otp,
        otpExpiry,
      },
    });
  }

  async verifyUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        otp: null,
        otpExpiry: null,
      },
    });
  }

  async updatePassword(
    userId: string,
    password: string
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        password,
      },
    });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string
  ) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken,
      },
    });
  }

  async clearRefreshToken(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });
  }

  async blockUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: true,
      },
    });
  }

  async unblockUser(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        isBlocked: false,
      },
    });
  }

  async deleteUser(userId: string) {
    return prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}

export default new AuthRepository();