import {
  createTask,
  getAllTask,
  getAllUnassignedBoardTask,
  updateTaskBoardAndStatus,
  updateTask
} from "./../service/TaskService";

export const addTask = (req, res, next) => {
  createTask(
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

export const getAllTaskController = (req, res, next) => {
  getAllTask(
    req.tenant.key,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};

export const updateTaskController = (req, res, next) => {
  updateTask(
    req.tenant.key,
    req.body,
    req.param("id"),
    result => {
      res.status(200).json(result);
    },
    error => {
      res.status(200).json(error);
    }
  );
};

export const getAllUnassignedBoardTaskController = (req, res, next) => {
  getAllUnassignedBoardTask(
    req.tenant.key,
    result => {
      res.status(200).json(result);
    },
    error => {
      res.status(200).json(error);
    }
  );
};

export const updateTaskBoardAndStatusController = (req, res, next) => {
  updateTaskBoardAndStatus(
    req.tenant.key,
    req.body,
    result => {
      res.status(200).json(result);
    },
    error => {
      res.status(200).json(error);
    }
  );
};
