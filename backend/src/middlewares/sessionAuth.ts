import prisma from "../prisma/prisma";

export async function isActiveAuthSession(
  userId: string,
  sessionId: unknown
): Promise<boolean> {
  if (
    typeof sessionId !== "string" ||
    !sessionId.trim()
  ) {
    return false;
  }

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId,
      isActive: true,
      expiresAt: { gt: new Date() },
    },
    select: { id: true },
  });

  return Boolean(session);
}
