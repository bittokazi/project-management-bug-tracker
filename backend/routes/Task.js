import express from "express";
import {
  addTask,
  getAllTaskController,
  getAllUnassignedBoardTaskController,
  updateTaskBoardAndStatusController,
  updateTaskController
} from "./../controllers/TaskController";
import FormValidator from "./../middlewares/FormValidator";
import InvalidFormResponse from "./../middlewares/InvalidFormResponse";

const router = express.Router();

router.post("/", FormValidator("createTask"), InvalidFormResponse, addTask);
router.get("/", getAllTaskController);
router.put("/:id", updateTaskController);
router.get("/noboard", getAllUnassignedBoardTaskController);
router.post("/update/board/task", updateTaskBoardAndStatusController);

export default router;
