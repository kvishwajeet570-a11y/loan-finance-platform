import { Request, Response } from "express";
import subAgentService from "../../services/sub-agent/sub-agent.service";

export const createSubAgent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsaId = String(req.body.dsaId || "");

    if (!dsaId) {
      res.status(400).json({
        success: false,
        message: "DSA ID is required",
      });
      return;
    }

    const { name, email, phoneNo, password, city, state, pincode } = req.body;

    if (!name || !email || !phoneNo || !password) {
      res.status(400).json({
        success: false,
        message: "Name, email, phone number and password are required",
      });
      return;
    }

    const subAgent = await subAgentService.createSubAgent(dsaId, {
      name,
      email,
      phoneNo,
      password,
      city,
      state,
      pincode,
    });

    res.status(201).json({
      success: true,
      message: "Sub Agent created successfully",
      data: subAgent,
    });
  } catch (error: any) {
    console.error("CREATE_SUB_AGENT_ERROR:", error);

    res.status(400).json({
      success: false,
      message: error?.message || "Failed to create Sub Agent",
    });
  }
};

export const getSubAgents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dsaId = String(req.params.dsaId || "");

    if (!dsaId) {
      res.status(400).json({
        success: false,
        message: "DSA ID is required",
      });
      return;
    }

    const subAgents = await subAgentService.getSubAgents(dsaId);

    res.status(200).json({
      success: true,
      data: subAgents,
    });
  } catch (error: any) {
    console.error("GET_SUB_AGENTS_ERROR:", error);

    res.status(500).json({
      success: false,
      message: error?.message || "Failed to fetch Sub Agents",
    });
  }
};
