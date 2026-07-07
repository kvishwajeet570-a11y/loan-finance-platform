import {

  Request,
  Response,

} from "express";

import prisma
from "../prisma/prisma";


/* ========================================
   CREATE JOB APPLICATION
======================================== */

export const createJobApplication =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const {

        fullName,
        email,
        phone,
        resumeUrl,
        position,

      } = req.body;


      /* ========================================
         VALIDATION
      ======================================== */

      if (

        !fullName ||

        !email ||

        !phone

      ) {

        return res.status(400).json({

          success: false,

          message:
            "All fields are required",

        });

      }


      /* ========================================
         CHECK EXISTING
      ======================================== */

      const existingApplication =
        await prisma.jobApplication.findFirst({

          where: {

            email,

          },

        });


      if (existingApplication) {

        return res.status(400).json({

          success: false,

          message:
            "Application already submitted",

        });

      }


      /* ========================================
         CREATE APPLICATION
      ======================================== */

      const application =
        await prisma.jobApplication.create({

          data: {

            fullName,

            email,

            phone,

            resumeUrl,

            position:
              position || "Sales Executive",

            status: "pending",

          },

        });


      /* ========================================
         FIND ADMIN
      ======================================== */

      const admin =
        await prisma.user.findFirst({

          where: {

            role: "admin",

          },

        });


      /* ========================================
         CREATE NOTIFICATION
      ======================================== */

      if (admin) {

        await prisma.notification.create({

          data: {

            userId:
              admin.id,

            title:
              "New Job Application",

            message:
              `${fullName} applied for ${position || "Sales Executive"}`,

            type:
              "career",

          },

        });

      }


      /* ========================================
         RESPONSE
      ======================================== */

      return res.status(201).json({

        success: true,

        message:
          "Job application submitted successfully",

        application,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to submit application",

      });

    }

  };


/* ========================================
   GET ALL APPLICATIONS
======================================== */

export const getJobApplications =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const applications =
        await prisma.jobApplication.findMany({

          orderBy: {

            createdAt: "desc",

          },

        });


      return res.status(200).json({

        success: true,

        count:
          applications.length,

        applications,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch applications",

      });

    }

  };


/* ========================================
   GET SINGLE APPLICATION
======================================== */

export const getSingleApplication =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const application =
        await prisma.jobApplication.findUnique({

          where: {

            id,

          },

        });


      if (!application) {

        return res.status(404).json({

          success: false,

          message:
            "Application not found",

        });

      }


      return res.status(200).json({

        success: true,

        application,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch application",

      });

    }

  };


/* ========================================
   UPDATE APPLICATION STATUS
======================================== */

export const updateJobStatus =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const {

        status,

      } = req.body;


      const application =
        await prisma.jobApplication.findUnique({

          where: {

            id,

          },

        });


      if (!application) {

        return res.status(404).json({

          success: false,

          message:
            "Application not found",

        });

      }


      const updatedApplication =
        await prisma.jobApplication.update({

          where: {

            id,

          },

          data: {

            status,

          },

        });


      return res.status(200).json({

        success: true,

        message:
          "Application status updated successfully",

        application:
          updatedApplication,

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to update status",

      });

    }

  };


/* ========================================
   DELETE APPLICATION
======================================== */

export const deleteJobApplication =
  async (

    req: Request,

    res: Response

  ) => {

    try {

      const id =
        req.params.id as string;


      const application =
        await prisma.jobApplication.findUnique({

          where: {

            id,

          },

        });


      if (!application) {

        return res.status(404).json({

          success: false,

          message:
            "Application not found",

        });

      }


      await prisma.jobApplication.delete({

        where: {

          id,

        },

      });


      return res.status(200).json({

        success: true,

        message:
          "Application deleted successfully",

      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({

        success: false,

        message:
          "Failed to delete application",

      });

    }

  };