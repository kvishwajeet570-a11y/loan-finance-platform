// src/services/insurance.service.ts

import { prisma } from "../config/prisma";

export interface CreateInsurancePolicyDto {
  customerId: string;
  policyType: string;
  providerName: string;
  policyNumber: string;
  premiumAmount: number;
  sumInsured: number;
  startDate: Date;
  endDate: Date;
}

export class InsuranceService {
  /* ========================================
     CREATE POLICY
  ======================================== */
  static async createPolicy(
    payload: CreateInsurancePolicyDto
  ) {
    return prisma.insurancePolicy.create({
      data: {
        customerId: payload.customerId,
        policyType: payload.policyType,
        providerName: payload.providerName,
        policyNumber: payload.policyNumber,
        premiumAmount: payload.premiumAmount,
        sumInsured: payload.sumInsured,
        startDate: payload.startDate,
        endDate: payload.endDate,
        status: "ACTIVE",
      },
    });
  }

  /* ========================================
     GET POLICY BY ID
  ======================================== */
  static async getPolicyById(id: string) {
    return prisma.insurancePolicy.findUnique({
      where: { id },
    });
  }

  /* ========================================
     GET CUSTOMER POLICIES
  ======================================== */
  static async getCustomerPolicies(
    customerId: string
  ) {
    return prisma.insurancePolicy.findMany({
      where: { customerId },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ========================================
     GET ALL POLICIES
  ======================================== */
  static async getAllPolicies() {
    return prisma.insurancePolicy.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /* ========================================
     RENEW POLICY
  ======================================== */
  static async renewPolicy(
    policyId: string,
    endDate: Date
  ) {
    return prisma.insurancePolicy.update({
      where: { id: policyId },
      data: {
        endDate,
        status: "ACTIVE",
      },
    });
  }

  /* ========================================
     EXPIRE POLICY
  ======================================== */
  static async expirePolicy(
    policyId: string
  ) {
    return prisma.insurancePolicy.update({
      where: { id: policyId },
      data: {
        status: "EXPIRED",
      },
    });
  }

  /* ========================================
     CREATE CLAIM
  ======================================== */
  static async createClaim(
    policyId: string,
    claimAmount: number,
    reason: string
  ) {
    return prisma.insuranceClaim.create({
      data: {
        policyId,
        claimAmount,
        reason,
        status: "PENDING",
      },
    });
  }

  /* ========================================
     APPROVE CLAIM
  ======================================== */
  static async approveClaim(
    claimId: string
  ) {
    return prisma.insuranceClaim.update({
      where: { id: claimId },
      data: {
        status: "APPROVED",
      },
    });
  }

  /* ========================================
     REJECT CLAIM
  ======================================== */
  static async rejectClaim(
    claimId: string
  ) {
    return prisma.insuranceClaim.update({
      where: { id: claimId },
      data: {
        status: "REJECTED",
      },
    });
  }

  /* ========================================
     POLICY ANALYTICS
  ======================================== */
  static async getAnalytics() {
    const totalPolicies =
      await prisma.insurancePolicy.count();

    const activePolicies =
      await prisma.insurancePolicy.count({
        where: {
          status: "ACTIVE",
        },
      });

    const totalClaims =
      await prisma.insuranceClaim.count();

    return {
      totalPolicies,
      activePolicies,
      totalClaims,
    };
  }
}