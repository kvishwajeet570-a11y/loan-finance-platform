"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const prisma_1 = require("../../prisma/prisma");
class OcrService {
    static async extractTextFromImage(filePath) {
        const result = await tesseract_js_1.default.recognize(filePath, "eng");
        return {
            text: result.data.text,
            confidence: result.data.confidence,
        };
    }
    static async extractTextFromPdf(filePath) {
        const dataBuffer = fs_1.default.readFileSync(filePath);
        const pdf = await (0, pdf_parse_1.default)(dataBuffer);
        return {
            text: pdf.text,
            pages: pdf.numpages,
        };
    }
    static classifyDocument(text) {
        const content = text.toUpperCase();
        if (content.includes("INCOME TAX DEPARTMENT")) {
            return "PAN";
        }
        if (content.includes("UNIQUE IDENTIFICATION AUTHORITY")) {
            return "AADHAAR";
        }
        if (content.includes("ACCOUNT STATEMENT") ||
            content.includes("BANK STATEMENT")) {
            return "BANK_STATEMENT";
        }
        return "UNKNOWN";
    }
    static extractPanDetails(text) {
        const pan = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
        return {
            panNumber: pan?.[0] || null,
        };
    }
    static extractAadhaarDetails(text) {
        const aadhaar = text.match(/\d{4}\s?\d{4}\s?\d{4}/);
        return {
            aadhaarNumber: aadhaar?.[0] || null,
        };
    }
    static extractBankDetails(text) {
        const accountNo = text.match(/\b\d{9,18}\b/);
        const ifsc = text.match(/[A-Z]{4}0[A-Z0-9]{6}/);
        return {
            accountNumber: accountNo?.[0] || null,
            ifsc: ifsc?.[0] || null,
        };
    }
    static async processDocument(filePath, userId) {
        const extension = path_1.default.extname(filePath).toLowerCase();
        let extractedText = "";
        if (extension === ".pdf") {
            const pdf = await this.extractTextFromPdf(filePath);
            extractedText =
                pdf.text;
        }
        else {
            const image = await this.extractTextFromImage(filePath);
            extractedText =
                image.text;
        }
        const documentType = this.classifyDocument(extractedText);
        let extractedData = {};
        switch (documentType) {
            case "PAN":
                extractedData =
                    this.extractPanDetails(extractedText);
                break;
            case "AADHAAR":
                extractedData =
                    this.extractAadhaarDetails(extractedText);
                break;
            case "BANK_STATEMENT":
                extractedData =
                    this.extractBankDetails(extractedText);
                break;
        }
        const record = await prisma_1.prisma.ocrDocument.create({
            data: {
                userId,
                documentType,
                rawText: extractedText,
                extractedData: JSON.stringify(extractedData),
            },
        });
        return {
            success: true,
            documentType,
            extractedData,
            documentId: record.id,
        };
    }
}
exports.OcrService = OcrService;
