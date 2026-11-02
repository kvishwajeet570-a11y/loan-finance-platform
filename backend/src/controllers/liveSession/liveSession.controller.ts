import { Request, Response } from "express";
import prisma from "../../prisma/prisma";

export async function listSessions(req: Request, res: Response) {
  try {
    const userId = String((req as any).user?.id || "");
    const all = req.path.includes("/admin");
    const sessions = await prisma.trainingSession.findMany({
      where: all ? {} : { status: "PUBLISHED" },
      orderBy: { startsAt: "asc" },
      include: {
        _count: { select: { registrations: true } },
        registrations: { where: { userId }, select: { id: true, status: true } }
      }
    });
    return res.json({ success: true, data: sessions });
  } catch (error) {
    console.error("LIST LIVE SESSIONS:", error);
    return res.status(500).json({ success: false, message: "Unable to load sessions." });
  }
}

export async function createSession(req: Request, res: Response) {
  try {
    const title = String(req.body.title || "").trim();
    const description = String(req.body.description || "").trim();
    const startsAt = new Date(req.body.startsAt);
    const platform = String(req.body.platform || "").trim();
    const meetingLink = String(req.body.meetingLink || "").trim();
    const createdBy = String((req as any).user?.id || "");

    if (!title || !createdBy || !req.body.startsAt || Number.isNaN(startsAt.getTime())) {
      return res.status(400).json({ success: false, message: "Title and valid session date/time are required." });
    }
    if (meetingLink && !/^https?:\/\/\S+$/i.test(meetingLink)) {
      return res.status(400).json({ success: false, message: "Meeting link must be a valid HTTP(S) URL." });
    }

    const session = await prisma.trainingSession.create({
      data: {
        title,
        description: description || null,
        startsAt,
        platform: platform || null,
        meetingLink: meetingLink || null,
        createdBy,
        status: "DRAFT"
      }
    });
    return res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error("CREATE LIVE SESSION:", error);
    return res.status(500).json({ success: false, message: "Unable to create session." });
  }
}

export async function publishSession(req: Request, res: Response) {
  try {
    const id = String(req.params.id || "");
    const existing = await prisma.trainingSession.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Session not found." });

    const session = await prisma.trainingSession.update({
      where: { id },
      data: { status: "PUBLISHED" }
    });
    return res.json({ success: true, data: session });
  } catch (error) {
    console.error("PUBLISH LIVE SESSION:", error);
    return res.status(500).json({ success: false, message: "Unable to publish session." });
  }
}

export async function registerForSession(req: Request, res: Response) {
  try {
    const sessionId = String(req.params.id || "");
    const userId = String((req as any).user?.id || "");
    if (!userId) return res.status(401).json({ success: false, message: "Login required." });

    const session = await prisma.trainingSession.findFirst({
      where: { id: sessionId, status: "PUBLISHED" }
    });
    if (!session) return res.status(404).json({ success: false, message: "Published session not found." });

    const registration = await prisma.trainingSessionRegistration.upsert({
      where: { sessionId_userId: { sessionId, userId } },
      create: { sessionId, userId },
      update: {}
    });
    return res.status(200).json({ success: true, message: "Registration confirmed.", data: registration });
  } catch (error) {
    console.error("REGISTER LIVE SESSION:", error);
    return res.status(500).json({ success: false, message: "Unable to register for session." });
  }
}
