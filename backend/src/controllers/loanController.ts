import {

  Request,
  Response,

} from "express";

import prisma from "../prisma/prisma";


/* ========================================
   APPLY LOAN
======================================== */

export const applyLoan =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      console.log(

        "REQ BODY =>",

        req.body

      );


      const {

        userId,
        fullName,
        email,
        phone,
        loanType,
        amount,
        dob,
        panNo,
        aadhaarNo,
        monthlyIncome,
        employmentType,
        address,
        city,
        state,
        pincode,

      } = req.body;


      /* ========================================
         VALIDATION
      ======================================== */

      if (

        !fullName ||

        !email ||

        !phone ||

        !loanType ||

        !amount ||

        !dob ||

        !panNo

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All required fields are mandatory",

        });

      }


      /* ========================================
         EMAIL VALIDATION
      ======================================== */

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (

        !emailRegex.test(email)

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid email address",

        });

      }


      /* ========================================
         PHONE VALIDATION
      ======================================== */

      if (

        phone.length < 10

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid phone number",

        });

      }


      /* ========================================
         PAN VALIDATION
      ======================================== */

      const panRegex =
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;


      if (

        !panRegex.test(panNo)

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid PAN number",

        });

      }


      /* ========================================
         DUPLICATE LOAN CHECK
      ======================================== */

      const existingLoan =
        await prisma.loanApplication.findFirst({

          where: {

            email,

            status: "pending",

          },

        });


      if (existingLoan) {

        return res.status(400).json({

          success: false,

          message:
            "Loan application already pending",

        });

      }


      /* ========================================
         CHECK USER
      ======================================== */

      const existingUser =
        await prisma.user.findUnique({

          where: {

            email,

          },

        });


      /* ========================================
         CREATE LOAN
      ======================================== */

      const loan =
        await prisma.loanApplication.create({

          data: {

            userId:
              userId || null,

            fullName,

            email,

            phone,

            loanType,

            amount:
              Number(amount),

            dob,

            panNo,

            aadhaarNo,

            monthlyIncome:
              monthlyIncome
                ? Number(monthlyIncome)
                : null,

            employmentType,

            address,

            city,

            state,

            zipCode:
              pincode,

            status: "pending",

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      if (existingUser) {

        await prisma.notification.create({

          data: {

            userId:
              existingUser.id,

            title:
              "Loan Application Submitted",

            message:
              `Your ${loanType} loan application has been submitted successfully.`,

            type:
              "loan",

          },

        });

      }


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(201).json({

        success: true,

        message:
          "Loan application submitted successfully",

        loan,

      });

    } catch (error) {

      console.log(

        "LOAN ERROR =>",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Internal Server Error",

      });

    }

  };


/* ========================================
   GET ALL LOANS
======================================== */

export const getAllLoans =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const loans =
        await prisma.loanApplication.findMany({

          orderBy: {

            createdAt: "desc",

          },

          include: {

            user: true,

            commissions: true,

            emiPayments: true,

          },

        });


      return res.status(200).json({

        success: true,

        totalLoans:
          loans.length,

        loans,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch loans",

      });

    }

  };


/* ========================================
   GET SINGLE LOAN
======================================== */

export const getSingleLoan =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const loan =
        await prisma.loanApplication.findUnique({

          where: {

            id,

          },

          include: {

            user: true,

            commissions: true,

            emiPayments: true,

          },

        });


      if (!loan) {

        return res.status(404).json({

          success: false,

          message:
            "Loan not found",

        });

      }


      return res.status(200).json({

        success: true,

        loan,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch loan",

      });

    }

  };


/* ========================================
   APPROVE LOAN
======================================== */

export const approveLoan =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      /* ========================================
         FIND LOAN
      ======================================== */

      const existingLoan =
        await prisma.loanApplication.findUnique({

          where: {

            id,

          },

        });


      if (!existingLoan) {

        return res.status(404).json({

          success: false,

          message:
            "Loan not found",

        });

      }


      if (

        existingLoan.status ===
        "approved"

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Loan already approved",

        });

      }


      /* ========================================
         TRANSACTION
      ======================================== */

      const result =
        await prisma.$transaction(

          async (tx) => {

            /* UPDATE LOAN */

            const loan =
              await tx.loanApplication.update({

                where: {

                  id,

                },

                data: {

                  status:
                    "approved",

                },

              });


            /* CREATE COMMISSION */

            if (loan.userId) {

              await tx.commission.create({

                data: {

                  userId:
                    loan.userId,

                  amount:
                    loan.amount * 0.02,

                  loanId:
                    loan.id,

                },

              });

            }


            /* FIND USER */

            const user =
              await tx.user.findFirst({

                where: {

                  email:
                    loan.email,

                },

              });


            /* CREATE NOTIFICATION */

            if (user) {

              await tx.notification.create({

                data: {

                  userId:
                    user.id,

                  title:
                    "Loan Approved",

                  message:
                    `Congratulations! Your ${loan.loanType} loan has been approved.`,

                  type:
                    "loan",

                },

              });

            }


            return loan;

          }

        );


      return res.status(200).json({

        success: true,

        message:
          "Loan approved successfully",

        loan:
          result,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Loan approval failed",

      });

    }

  };


/* ========================================
   REJECT LOAN
======================================== */

export const rejectLoan =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      /* ========================================
         FIND LOAN
      ======================================== */

      const existingLoan =
        await prisma.loanApplication.findUnique({

          where: {

            id,

          },

        });


      if (!existingLoan) {

        return res.status(404).json({

          success: false,

          message:
            "Loan not found",

        });

      }


      /* ========================================
         UPDATE LOAN
      ======================================== */

      const loan =
        await prisma.loanApplication.update({

          where: {

            id,

          },

          data: {

            status:
              "rejected",

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      const user =
        await prisma.user.findFirst({

          where: {

            email:
              loan.email,

          },

        });


      if (user) {

        await prisma.notification.create({

          data: {

            userId:
              user.id,

            title:
              "Loan Rejected",

            message:
              `Your ${loan.loanType} loan application has been rejected.`,

            type:
              "loan",

          },

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Loan rejected successfully",

        loan,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Loan rejection failed",

      });

    }

  };


/* ========================================
   DELETE LOAN
======================================== */

export const deleteLoan =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const loan =
        await prisma.loanApplication.findUnique({

          where: {

            id,

          },

        });


      if (!loan) {

        return res.status(404).json({

          success: false,

          message:
            "Loan not found",

        });

      }


      await prisma.loanApplication.delete({

        where: {

          id,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Loan deleted successfully",

        loan,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete loan",

      });

    }

  };