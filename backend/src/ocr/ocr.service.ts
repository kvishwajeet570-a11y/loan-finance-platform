import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import { prisma } from "../../prisma/prisma";

export class OcrService {

  static async extractTextFromImage(
    filePath: string
  ) {
    const result = await Tesseract.recognize(
      filePath,
      "eng"
    );

    return {
      text: result.data.text,
      confidence: result.data.confidence,
    };
  }

  static async extractTextFromPdf(
    filePath: string
  ) {
    const dataBuffer =
      fs.readFileSync(filePath);

    const pdf =
      await pdfParse(dataBuffer);

    return {
      text: pdf.text,
      pages: pdf.numpages,
    };
  }

  static classifyDocument(
    text: string
  ) {
    const content =
      text.toUpperCase();

    if (
      content.includes(
        "INCOME TAX DEPARTMENT"
      )
    ) {
      return "PAN";
    }

    if (
      content.includes(
        "UNIQUE IDENTIFICATION AUTHORITY"
      )
    ) {
      return "AADHAAR";
    }

    if (
      content.includes(
        "ACCOUNT STATEMENT"
      ) ||
      content.includes(
        "BANK STATEMENT"
      )
    ) {
      return "BANK_STATEMENT";
    }

    return "UNKNOWN";
  }

  static extractPanDetails(
    text: string
  ) {
    const pan =
      text.match(
        /[A-Z]{5}[0-9]{4}[A-Z]{1}/
      );

    return {
      panNumber:
        pan?.[0] || null,
    };
  }

  static extractAadhaarDetails(
    text: string
  ) {
    const aadhaar =
      text.match(
        /\d{4}\s?\d{4}\s?\d{4}/
      );

    return {
      aadhaarNumber:
        aadhaar?.[0] || null,
    };
  }

  static extractBankDetails(
    text: string
  ) {
    const accountNo =
      text.match(
        /\b\d{9,18}\b/
      );

    const ifsc =
      text.match(
        /[A-Z]{4}0[A-Z0-9]{6}/
      );

    return {
      accountNumber:
        accountNo?.[0] || null,
      ifsc:
        ifsc?.[0] || null,
    };
  }

  static async processDocument(
    filePath: string,
    userId: string
  ) {

    const extension =
      path.extname(
        filePath
      ).toLowerCase();

    let extractedText = "";

    if (extension === ".pdf") {

      const pdf =
        await this.extractTextFromPdf(
          filePath
        );

      extractedText =
        pdf.text;

    } else {

      const image =
        await this.extractTextFromImage(
          filePath
        );

      extractedText =
        image.text;
    }

    const documentType =
      this.classifyDocument(
        extractedText
      );

    let extractedData = {};

    switch (
      documentType
    ) {

      case "PAN":
        extractedData =
          this.extractPanDetails(
            extractedText
          );
        break;

      case "AADHAAR":
        extractedData =
          this.extractAadhaarDetails(
            extractedText
          );
        break;

      case "BANK_STATEMENT":
        extractedData =
          this.extractBankDetails(
            extractedText
          );
        break;
    }

    const record =
      await prisma.ocrDocument.create({
        data: {
          userId,
          documentType,
          rawText:
            extractedText,
          extractedData:
            JSON.stringify(
              extractedData
            ),
        },
      });

    return {
      success: true,
      documentType,
      extractedData,
      documentId:
        record.id,
    };
  }
}