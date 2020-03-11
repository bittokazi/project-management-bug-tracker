import express from "express";
import { getUserCompany } from "./../controllers/TenantSwitchController";

const router = express.Router();

router.get("/", getUserCompany);

export default router;
