import { Router  } from "express";
import { authMiddleware  } from "../middleware/auth";
import * as addressController from "../controllers/AddressControllers"

const router = Router();

router.post("/create", authMiddleware, addressController.createAddress);
router.put("/:id", authMiddleware, addressController.updateAddress);
router.delete("/:id", authMiddleware, addressController.deleteAddress);
router.get("/default", authMiddleware, addressController.getDefaultAddress);
router.get("/", authMiddleware, addressController.getAllAddress);
router.get("/:id", authMiddleware, addressController.getAddressById);
export default router;