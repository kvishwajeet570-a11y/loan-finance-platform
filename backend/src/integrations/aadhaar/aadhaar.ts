// src/integrations/aadhar/aadhar.ts

export interface AadhaarVerificationRequest {
  aadhaarNumber: string;
  fullName: string;
  dob: string;
}

export interface AadhaarVerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
  data?: {
    aadhaarNumber: string;
    fullName: string;
    dob: string;
    status: string;
  };
}

export class AadhaarService {
  static async verifyAadhaar(
    payload: AadhaarVerificationRequest
  ): Promise<AadhaarVerificationResponse> {
    try {
      const { aadhaarNumber, fullName, dob } =
        payload;

      if (!/^\d{12}$/.test(aadhaarNumber)) {
        return {
          success: false,
          verified: false,
          message:
            "Invalid Aadhaar number format",
        };
      }

      return {
        success: true,
        verified: true,
        message:
          "Aadhaar verification successful",
        data: {
          aadhaarNumber,
          fullName,
          dob,
          status: "VERIFIED",
        },
      };
    } catch (error) {
      return {
        success: false,
        verified: false,
        message:
          "Aadhaar verification failed",
      };
    }
  }

  static maskAadhaar(
    aadhaarNumber: string
  ): string {
    return `XXXXXXXX${aadhaarNumber.slice(
      -4
    )}`;
  }
}