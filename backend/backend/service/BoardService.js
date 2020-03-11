import * as db from "./../models";

export const createBoard = (board, tenant, success, error) => {
  db.board
    .schema(tenant)
    .create(board)
    .then(result => {
      success({ success: true });
    })
    .catch(err => {
      error(err);
    });
};

export const getAllBoards = (tenant, success, error) => {
  db.board
    .schema(tenant)
    .findAll({
      raw: true,
      order: [["id", "DESC"]]
    })
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};

export const getAllTaskOfBoards = (tenant, id, success, error) => {
  db.Task.schema(tenant)
    .findAll({
      where: {
        boardid: id
      },
      include: [
        {
          model: db.project.schema(tenant),
          as: "project"
        },
        {
          model: db.board.schema(tenant),
          as: "board"
        }
      ],
      order: [["id", "DESC"]]
    })
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};
