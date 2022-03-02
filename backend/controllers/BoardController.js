import {
  createBoard,
  getAllBoards,
  getAllTaskOfBoards
} from "./../service/BoardService";

export const addBoard = (req, res, next) => {
  createBoard(
    req.body,
    req.tenant.key,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};

export const getAllBoardController = (req, res, next) => {
  getAllBoards(
    req.tenant.key,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};

export const getAllTaskOfBoardsController = (req, res, next) => {
  getAllTaskOfBoards(
    req.tenant.key,
    req.param("boardId"),
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};
