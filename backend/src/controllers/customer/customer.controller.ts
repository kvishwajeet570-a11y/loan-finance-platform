import { Request, Response } from "express";
import customerService from "../../services/customer/customer.service";

export const getCustomers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = String(req.query.search || "");
    const status = String(req.query.status || "");

    const result = await customerService.getCustomers({
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
      message: "Failed to fetch customers",
    });
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.id
    );

    if (!customer) {
      res.status(404).json({
        success: false,
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerService.createCustomer(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const blockCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerService.blockCustomer(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Customer blocked successfully",
      data: customer,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to block customer",
    });
  }
};

export const unblockCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customer = await customerService.unblockCustomer(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Customer unblocked successfully",
      data: customer,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to unblock customer",
    });
  }
};

export const getCustomerAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await customerService.getCustomerAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};