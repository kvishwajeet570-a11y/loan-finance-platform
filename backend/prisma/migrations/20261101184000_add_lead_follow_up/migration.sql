CREATE TABLE "LeadFollowUp" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'CALL',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT,
    "outcome" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdById" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LeadFollowUp_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LeadFollowUp_leadId_idx" ON "LeadFollowUp"("leadId");
CREATE INDEX "LeadFollowUp_scheduledAt_idx" ON "LeadFollowUp"("scheduledAt");
CREATE INDEX "LeadFollowUp_status_idx" ON "LeadFollowUp"("status");
CREATE INDEX "LeadFollowUp_createdById_idx" ON "LeadFollowUp"("createdById");

ALTER TABLE "LeadFollowUp"
ADD CONSTRAINT "LeadFollowUp_leadId_fkey"
FOREIGN KEY ("leadId") REFERENCES "Lead"("id")
ON DELETE CASCADE ON UPDATE CASCADE;