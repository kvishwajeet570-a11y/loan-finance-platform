import prisma from "../prisma/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthService {
  generateToken(user: any) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    );
  }

  async register(data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
  }) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { phoneNo: data.phoneNo },
        ],
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      10
    );

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNo: data.phoneNo,
        password: hashedPassword,
        role: "user",
      },
    });

    const token = this.generateToken(user);

    return {
      success: true,
      token,
      user,
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValid) {
      throw new Error("Invalid password");
    }

    const token = this.generateToken(user);

    return {
      success: true,
      token,
      user,
    };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isValid) {
      throw new Error("Old password incorrect");
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Password changed successfully",
    };
  }
}

export default new AuthService();

