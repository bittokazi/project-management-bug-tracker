import * as db from "./../models";

export const getUserCompanies = (user, result, error) => {
  db.user
    .findAll({
      attributes: ["username"],
      where: {
        id: user.id
      },
      include: [{ all: true }]
    })
    .then(success => {
      result(success[0]);
    })
    .catch(err => {
      error(err);
    });
};
