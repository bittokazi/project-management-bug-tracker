import * as db from "./../models";

export const createProject = (project, tenant, success, error) => {
  db.project
    .schema(tenant)
    .create(project)
    .then(result => {
      success({ success: true });
    })
    .catch(err => {
      error(err);
    });
};

export const getAllProjects = (tenant, success, error) => {
  db.project
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
