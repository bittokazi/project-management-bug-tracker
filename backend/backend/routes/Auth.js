import express from "express";
import { login } from "./../controllers/AuthController";
import { registerCompanyAndUser } from "./../controllers/AuthController";
import FormValidator from "./../middlewares/FormValidator";
import InvalidFormResponse from "./../middlewares/InvalidFormResponse";

const router = express.Router();

router.post("/", login);
router.post(
  "/register",
  FormValidator("signup"),
  InvalidFormResponse,
  registerCompanyAndUser
);

export default router;
