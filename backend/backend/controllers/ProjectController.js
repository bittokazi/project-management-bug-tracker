import { createProject, getAllProjects } from "./../service/ProjectService";

export const addProject = (req, res, next) => {
  createProject(
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

export const getAllProjectController = (req, res, next) => {
  getAllProjects(
    req.tenant.key,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};
