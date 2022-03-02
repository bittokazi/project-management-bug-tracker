import express from "express";
import {
  addProject,
  getAllProjectController
} from "./../controllers/ProjectController";
import FormValidator from "./../middlewares/FormValidator";
import InvalidFormResponse from "./../middlewares/InvalidFormResponse";

const router = express.Router();

router.post(
  "/",
  FormValidator("createProject"),
  InvalidFormResponse,
  addProject
);
router.get("/", getAllProjectController);

export default router;
