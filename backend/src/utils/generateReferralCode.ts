import crypto
from "crypto";


/* ========================================
   GENERATE REFERRAL CODE
======================================== */

const generateReferralCode =
  () => {

    return (

      "LP" +

      crypto

        .randomBytes(4)

        .toString("hex")

        .toUpperCase()

    );

  };

export default
generateReferralCode;