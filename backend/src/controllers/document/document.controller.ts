import { Request, Response } from "express";
import documentService from "../../services/document/document.service";

export const getDocuments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await documentService.getDocuments({
      page,
      limit,
      search,
      status,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document =
      await documentService.getDocumentById(
        String(req.params.id)
      );

    if (!document) {
      return void res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

export const uploadDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File;

    const document =
      await documentService.uploadDocument({
        userId: req.body.userId,
        loanId: req.body.loanId,

        documentType: req.body.documentType,
        documentName: req.body.documentName,

        fileUrl: file?.path || "",
        fileSize: file?.size || 0,
        mimeType: file?.mimetype || "",
      });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message:
        error?.message ||
        "Document upload failed",
    });
  }
};

export const verifyDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document =
      await documentService.verifyDocument(
        String(req.params.id),
        "SYSTEM"
      );

    res.status(200).json({
      success: true,
      message: "Document verified successfully",
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

export const rejectDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const document =
      await documentService.rejectDocument(
        String(req.params.id),
        req.body.reason
      );

    res.status(200).json({
      success: true,
      message: "Document rejected",
      data: document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Rejection failed",
    });
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await documentService.deleteDocument(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};

export const getDocumentAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await documentService.getDocumentStats();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};
export const getUserDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getUserDocuments not implemented" });
};

export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  return getDocuments(req, res);
};

export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "updateDocument not implemented" });
};

export const searchDocuments = async (req: Request, res: Response): Promise<void> => {
  return getDocuments(req, res);
};

export const getPendingDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getPendingDocuments not implemented" });
};

export const getVerifiedDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getVerifiedDocuments not implemented" });
};

export const getRejectedDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getRejectedDocuments not implemented" });
};

export const getDocumentsByType = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getDocumentsByType not implemented" });
};

export const downloadDocument = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "downloadDocument not implemented" });
};

export const getDocumentDashboard = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getDocumentDashboard not implemented" });
};

export const getRecentDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getRecentDocuments not implemented" });
};

export const getExpiredDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "getExpiredDocuments not implemented" });
};

export const bulkVerifyDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "bulkVerifyDocuments not implemented" });
};

export const bulkRejectDocuments = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "bulkRejectDocuments not implemented" });
};

export const exportDocumentsExcel = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "exportDocumentsExcel not implemented" });
};

export const exportDocumentsPdf = async (req: Request, res: Response): Promise<void> => {
  res.status(501).json({ success: false, message: "exportDocumentsPdf not implemented" });
};