import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma";

class SubAgentService {
  async createSubAgent(dsaId: string, data: {
    name: string;
    email: string;
    phoneNo: string;
    password: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) {
    const dsa = await prisma.user.findFirst({
      where: {
        id: dsaId,
        role: "DSA",
        isBlocked: false,
        isActive: true,
      },
      select: { id: true },
    });

    if (!dsa) {
      throw new Error("Valid active DSA not found.");
    }

    const emailExists = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (emailExists) {
      throw new Error("Email already registered.");
    }

    const phoneExists = await prisma.user.findUnique({
      where: { phoneNo: data.phoneNo },
      select: { id: true },
    });

    if (phoneExists) {
      throw new Error("Phone number already registered.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNo: data.phoneNo,
        password: hashedPassword,
        role: "SUB_AGENT",
        parentDsaId: dsaId,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        isVerified: false,
        isActive: true,
        isBlocked: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        city: true,
        state: true,
        pincode: true,
        isVerified: true,
        isActive: true,
        isBlocked: true,
        parentDsaId: true,
        createdAt: true,
      },
    });
  }

  async getSubAgents(dsaId: string) {
    return prisma.user.findMany({
      where: {
        parentDsaId: dsaId,
        role: "SUB_AGENT",
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        role: true,
        city: true,
        state: true,
        pincode: true,
        isVerified: true,
        isActive: true,
        isBlocked: true,
        parentDsaId: true,
        createdAt: true,
        _count: {
          select: {
            loans: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new SubAgentService();
