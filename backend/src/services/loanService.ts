import prisma
from "../prisma/prisma";


/* ========================================
   CREATE LOAN
======================================== */

export const createLoanService =
  async (

    data: any

  ) => {

    return await prisma.loanApplication.create({

      data,

    });

  };


/* ========================================
   GET USER LOANS
======================================== */

export const getUserLoansService =
  async (

    userId: string

  ) => {

    return await prisma.loanApplication.findMany({

      where: {

        userId,

      },

      orderBy: {

        createdAt: "desc",

      },

    });

  };