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
        req.params.id
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
  } catch {
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
    const document =
      await documentService.uploadDocument({
        ...req.body,
        file: req.file,
      });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
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
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Document verified successfully",
      data: document,
    });
  } catch {
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
        req.params.id,
        req.body.reason
      );

    res.status(200).json({
      success: true,
      message: "Document rejected",
      data: document,
    });
  } catch {
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
    await documentService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch {
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
      await documentService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });
  }
};