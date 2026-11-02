import { Request, Response } from "express";
import { customerService } from "../../services/customer/customer.service";

export const getAllCustomers = async (req: Request, res: Response) => {
  const data = await customerService.getCustomers(req.query);
  res.json(data);
};

export const getCustomerById = async (req: Request, res: Response) => {
  const data = await customerService.getCustomerById(String(req.params.id));
  res.json(data);
};

export const getCustomerByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const authUser = (req as any).user;
    const requestedUserId = String(req.params.userId || "");
    const role = String(authUser?.role || "")
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

    if (
      !authUser?.id ||
      String(authUser.id) !== requestedUserId ||
      !["USER", "CUSTOMER"].includes(role)
    ) {
      res.status(403).json({
        success: false,
        message: "Access denied for this customer account.",
      });
      return;
    }

    const data = await customerService.getCustomerByUserId(requestedUserId);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Customer account not found.",
      });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error("GET CUSTOMER BY USER ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer account.",
    });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.createCustomer(req.body);
  res.status(201).json(data);
};

export const updateCustomer = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.updateCustomer(
    String(req.params.id),
    req.body
  );

  res.json(data);
};

export const deleteCustomer = async (
  req: Request,
  res: Response
) => {
  await customerService.deleteCustomer(String(req.params.id));

  res.json({
    success: true,
    message: "Customer deleted successfully",
  });
};

export const blockCustomer = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.blockCustomer(
    String(req.params.id)
  );

  res.json(data);
};

export const unblockCustomer = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.unblockCustomer(
    String(req.params.id)
  );

  res.json(data);
};

export const searchCustomers = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.searchCustomers(
    String(req.query.search || "")
  );

  res.json(data);
};

export const getCustomerLoans = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.getCustomerLoans(
    String(req.params.customerId)
  );

  res.json(data);
};

export const getCustomerTransactions = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getCustomerTransactions(
      String(req.params.customerId)
    );

  res.json(data);
};

export const getCustomerDocuments = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.getCustomerDocuments(
    String(req.params.customerId)
  );

  res.json(data);
};

export const getCustomerKyc = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.getCustomerKyc(
    String(req.params.customerId)
  );

  res.json(data);
};

export const verifyCustomer = async (
  req: Request,
  res: Response
) => {
  const data = await customerService.verifyCustomer(
    String(req.params.id)
  );

  res.json(data);
};

export const getActiveCustomers = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getActiveCustomers();

  res.json(data);
};

export const getInactiveCustomers = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getInactiveCustomers();

  res.json(data);
};

export const getTopCustomers = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getTopCustomers();

  res.json(data);
};

export const getMonthlyCustomers = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getMonthlyCustomers();

  res.json(data);
};

export const getCustomerDashboard = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getCustomerDashboard(
      String(req.params.id)
    );

  res.json(data);
};

export const getCustomerProfile = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getCustomerProfile(
      String(req.params.customerId)
    );

  res.json(data);
};

export const getCustomerAnalytics = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.getCustomerAnalytics();

  res.json(data);
};

export const exportCustomersExcel = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.exportCustomersExcel();

  res.json(data);
};

export const exportCustomersPdf = async (
  req: Request,
  res: Response
) => {
  const data =
    await customerService.exportCustomersPdf();

  res.json(data);
};

