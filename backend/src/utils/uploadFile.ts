import cloudinary
from "cloudinary";


/* ========================================
   CLOUDINARY CONFIG
======================================== */

cloudinary.v2.config({

  cloud_name:
    process.env.CLOUDINARY_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_SECRET,

});


/* ========================================
   UPLOAD FILE
======================================== */

const uploadFile =
  async (

    filePath: string

  ) => {

    const result =
      await cloudinary.v2.uploader.upload(

        filePath,

        {

          folder:
            "loan-finance",

        }

      );

    return result.secure_url;

  };

export default
uploadFile;