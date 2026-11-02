import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../../prisma/prisma";

export const registerPartner = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const phoneNo = String(req.body.phoneNo || "").trim();
    const password = String(req.body.password || "");
    const companyName = String(req.body.companyName || "").trim();
    const contactPerson = String(req.body.contactPerson || "").trim();

    if (!email || !phoneNo || !password || !companyName || !contactPerson) {
      return res.status(400).json({
        success: false,
        message: "Name, company, email, phone and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }

    if (!/^[6-9]\d{9}$/.test(phoneNo)) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number" });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser || !existingUser.isVerified || existingUser.otp) {
      return res.status(403).json({
        success: false,
        message: "Please complete email OTP verification first",
      });
    }

    if (existingUser.password || existingUser.role.toLowerCase() !== "user") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Use a new email for Partner registration.",
      });
    }

    const [phoneUser, existingPartner] = await Promise.all([
      prisma.user.findUnique({ where: { phoneNo } }),
      prisma.partner.findUnique({ where: { email } }),
    ]);

    if (phoneUser && phoneUser.id !== existingUser.id) {
      return res.status(409).json({ success: false, message: "Mobile number already registered" });
    }

    if (existingPartner) {
      return res.status(409).json({ success: false, message: "Partner already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: existingUser.id },
        data: {
          name: contactPerson,
          phoneNo,
          password: hashedPassword,
          role: "PARTNER",
          isVerified: true,
          isActive: true,
          isBlocked: false,
        },
      });

      const partner = await tx.partner.create({
        data: {
          userId: user.id,
          companyName,
          contactPerson,
          email,
          phone: phoneNo,
          status: "PENDING",
          isActive: true,
          isBlocked: false,
        },
      });

      return { user, partner };
    });

    return res.status(201).json({
      success: true,
      message: "Partner registration submitted. Await Super Admin approval.",
      partner: {
        id: result.partner.id,
        companyName: result.partner.companyName,
        contactPerson: result.partner.contactPerson,
        email: result.partner.email,
        status: result.partner.status,
      },
    });
  } catch (error) {
    console.error("[PARTNER_REGISTRATION_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Partner registration failed",
    });
  }
};