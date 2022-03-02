import express from "express";
import {
  addBoard,
  getAllBoardController,
  getAllTaskOfBoardsController
} from "./../controllers/BoardController";
import FormValidator from "./../middlewares/FormValidator";
import InvalidFormResponse from "./../middlewares/InvalidFormResponse";

const router = express.Router();

router.post("/", FormValidator("createBoard"), InvalidFormResponse, addBoard);
router.get("/", getAllBoardController);
router.get("/:boardId/tasks", getAllTaskOfBoardsController);

export default router;
