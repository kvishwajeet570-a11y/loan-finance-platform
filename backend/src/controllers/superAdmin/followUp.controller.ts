import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

type AuthRequest = Request & {
  user?: { id?: string; role?: string };
};

const writeAudit = async (
  action: string,
  entityId: string,
  userId: string | undefined,
  metadata: Record<string, unknown>
) => {
  await prisma.auditLog.create({
    data: {
      action,
      entityId,
      performedBy: userId,
      module: "FOLLOW_UP",
      metadata: metadata as any,
    },
  });
};

export const listFollowUps = async (req: AuthRequest, res: Response) => {
  try {
    const status = String(req.query.status || "");
    const search = String(req.query.search || "").trim();
    const now = new Date();

    const where: any = {
      lead: { isDeleted: false },
    };

    if (["PENDING", "COMPLETED", "CANCELLED"].includes(status)) {
      where.status = status;
    }

    if (req.query.due === "today") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.scheduledAt = { gte: start, lt: end };
      where.status = "PENDING";
    } else if (req.query.due === "overdue") {
      where.scheduledAt = { lt: now };
      where.status = "PENDING";
    }

    if (search) {
      where.lead = {
        isDeleted: false,
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { mobileNumber: { contains: search } },
        ],
      };
    }

    const [data, total, pending, completed, overdue, dueToday] =
      await Promise.all([
        prisma.leadFollowUp.findMany({
          where,
          include: {
            lead: {
              select: {
                id: true,
                fullName: true,
                mobileNumber: true,
                productType: true,
                status: true,
                assignedTo: true,
              },
            },
          },
          orderBy: { scheduledAt: "asc" },
          take: 200,
        }),
        prisma.leadFollowUp.count({ where }),
        prisma.leadFollowUp.count({
          where: { status: "PENDING", lead: { isDeleted: false } },
        }),
        prisma.leadFollowUp.count({
          where: { status: "COMPLETED", lead: { isDeleted: false } },
        }),
        prisma.leadFollowUp.count({
          where: {
            status: "PENDING",
            scheduledAt: { lt: now },
            lead: { isDeleted: false },
          },
        }),
        prisma.leadFollowUp.count({
          where: {
            status: "PENDING",
            scheduledAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date(new Date().setHours(0, 0, 0, 0)).setDate(new Date().getDate() + 1)),
            },
            lead: { isDeleted: false },
          },
        }),
      ]);

    res.json({
      success: true,
      data,
      total,
      stats: { pending, completed, overdue, dueToday },
    });
  } catch (error) {
    console.error("[FOLLOW-UPS] List error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch follow-ups" });
  }
};

export const createFollowUp = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId, type, scheduledAt, remarks } = req.body;

    if (!leadId || !scheduledAt || Number.isNaN(new Date(scheduledAt).getTime())) {
      res.status(400).json({
        success: false,
        message: "Valid leadId and scheduledAt are required",
      });
      return;
    }

    const lead = await prisma.lead.findFirst({
      where: { id: String(leadId), isDeleted: false },
    });

    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    const followUp = await prisma.leadFollowUp.create({
      data: {
        leadId: String(leadId),
        type: ["CALL", "WHATSAPP", "EMAIL", "MEETING"].includes(type)
          ? type
          : "CALL",
        scheduledAt: new Date(scheduledAt),
        remarks: remarks ? String(remarks) : null,
        createdById: req.user?.id,
      },
      include: { lead: true },
    });

    await writeAudit("FOLLOW_UP_CREATED", followUp.id, req.user?.id, {
      leadId,
      scheduledAt,
      type: followUp.type,
    });

    res.status(201).json({
      success: true,
      message: "Follow-up created successfully",
      data: followUp,
    });
  } catch (error) {
    console.error("[FOLLOW-UPS] Create error:", error);
    res.status(500).json({ success: false, message: "Failed to create follow-up" });
  }
};

export const updateFollowUp = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.leadFollowUp.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }

    const { scheduledAt, type, remarks, outcome, status } = req.body;
    const allowedStatus = ["PENDING", "COMPLETED", "CANCELLED"];

    const updated = await prisma.leadFollowUp.update({
      where: { id },
      data: {
        ...(scheduledAt && !Number.isNaN(new Date(scheduledAt).getTime())
          ? { scheduledAt: new Date(scheduledAt) }
          : {}),
        ...(type && ["CALL", "WHATSAPP", "EMAIL", "MEETING"].includes(type)
          ? { type }
          : {}),
        ...(remarks !== undefined ? { remarks: String(remarks) } : {}),
        ...(outcome !== undefined ? { outcome: String(outcome) } : {}),
        ...(allowedStatus.includes(status) ? { status } : {}),
        ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
        ...(status === "PENDING" ? { completedAt: null } : {}),
      },
      include: { lead: true },
    });

    await writeAudit("FOLLOW_UP_UPDATED", id, req.user?.id, {
      previousStatus: existing.status,
      newStatus: updated.status,
    });

    res.json({ success: true, message: "Follow-up updated", data: updated });
  } catch (error) {
    console.error("[FOLLOW-UPS] Update error:", error);
    res.status(500).json({ success: false, message: "Failed to update follow-up" });
  }
};

export const deleteFollowUp = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.leadFollowUp.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }

    await prisma.leadFollowUp.delete({ where: { id } });
    await writeAudit("FOLLOW_UP_DELETED", id, req.user?.id, {
      leadId: existing.leadId,
    });

    res.json({ success: true, message: "Follow-up deleted" });
  } catch (error) {
    console.error("[FOLLOW-UPS] Delete error:", error);
    res.status(500).json({ success: false, message: "Failed to delete follow-up" });
  }
};
