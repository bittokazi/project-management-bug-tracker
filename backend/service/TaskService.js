import * as db from "./../models";

export const createTask = (task, tenant, success, error) => {
  task.status = 0;
  db.Task.schema(tenant)
    .create(task)
    .then(result => {
      success({ success: true });
    })
    .catch(err => {
      error(err);
    });
};

export const getAllTask = (tenant, success, error) => {
  db.Task.schema(tenant)
    .findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: db.project.schema(tenant),
          as: "project"
        },
        {
          model: db.board.schema(tenant),
          as: "board"
        }
      ]
    })
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};

export const updateTask = (tenant, payload, id, success, error) => {
  db.Task.schema(tenant)
    .update(payload, {
      where: {
        id
      }
    })
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};

export const getAllUnassignedBoardTask = (tenant, success, error) => {
  db.Task.schema(tenant)
    .findAll({
      where: {
        boardid: null
      },
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

export const updateTaskBoardAndStatus = (tenant, payload, success, error) => {
  db.Task.schema(tenant)
    .update(
      { boardid: payload.boardid, status: payload.status },
      {
        where: {
          id: payload.id
        }
      }
    )
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};
