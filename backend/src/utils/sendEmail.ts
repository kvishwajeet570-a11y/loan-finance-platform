import nodemailer from "nodemailer";


export const sendEmail =
  async (

    to: string,

    subject: string,

    text: string

  ) => {

    try {

      /* ========================================
         ENV CHECK
      ======================================== */

      if (

        !process.env.EMAIL_USER ||

        !process.env.EMAIL_PASS

      ) {

        throw new Error(

          "Email environment variables missing"

        );

      }


      /* ========================================
         TRANSPORTER
      ======================================== */

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {

            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,

          },

        });


      /* ========================================
         VERIFY SMTP
      ======================================== */

      await transporter.verify();


      console.log(

        "SMTP SERVER CONNECTED"

      );


      /* ========================================
         SEND EMAIL
      ======================================== */

      const info =
        await transporter.sendMail({

          from:
            `"Loan Finance" <${process.env.EMAIL_USER}>`,

          to,

          subject,

          text,

        });


      console.log(

        "EMAIL SENT =>",

        info.messageId

      );


      return info;

    } catch (error: any) {

      /* ========================================
         ERROR LOG
      ======================================== */

      console.log(

        "EMAIL ERROR =>",

        error.message

      );


      console.log(error);


      /* ========================================
         THROW ERROR
      ======================================== */

      const emailError =
        new Error(

          "Failed to send email"

        );

      throw emailError;

    }

  };