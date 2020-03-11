import express from "express";
import {
  createCompany,
  getCompanies
} from "./../controllers/CompanyController";

const router = express.Router();

router.get("/", getCompanies);
router.post("/", createCompany);

export default router;
