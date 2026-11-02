import { Router } from "express";
import { searchPincodes, getPincodeDetails } from "../../controllers/pincode/pincode.controller";

const router = Router();

router.get("/search", searchPincodes);
router.get("/:pincode", getPincodeDetails);

export default router;
