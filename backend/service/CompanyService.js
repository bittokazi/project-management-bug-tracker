import * as db from "./../models";

export const addCompany = (company, success, error) => {
  company.enabled = true;
  company.description = "N/A";
  db.company
    .create(company)
    .then(result => {
      db.sequelize
        .createSchema(company.key)
        .then(async () => {
          await db.Comment.schema(company.key).sync();
          console.log("Comment Table Created");

          await db.project.schema(company.key).sync();
          console.log("Project Table Created");

          await db.board.schema(company.key).sync();
          console.log("Board Table Created");

          await db.Task.schema(company.key).sync();
          console.log("Task Table Created");

          success({ success: true });
        })
        .catch(err => {
          error(err);
        });
    })
    .catch(err => {
      error(err);
    });
};

export const getAllCompanies = (success, error) => {
  db.company
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

export const addUserToCompany = (companyUser, success, error) => {
  db.companyuser
    .create(companyUser)
    .then(result => {
      success({ success: true });
    })
    .catch(err => {
      error(err);
    });
};

export const generateCompanyUser = (user, company, callback) => {
  db.user
    .findAll({
      attributes: ["id"],
      where: {
        username: user.username,
        email: user.email
      },
      raw: true,
      order: [["id", "DESC"]]
    })
    .then(result => {
      let userid = result[0].id;
      db.company
        .findAll({
          attributes: ["id"],
          where: {
            key: company.key
          },
          raw: true,
          order: [["id", "DESC"]]
        })
        .then(result1 => {
          let companyid = result1[0].id;
          callback({
            userid,
            companyid
          });
        });
    });
};

export const getCompanyFromKey = (key, callback) => {
  db.company
    .findAll({
      attributes: ["id"],
      where: {
        key
      },
      raw: true,
      order: [["id", "DESC"]]
    })
    .then(result1 => {
      if (result1.length > 0) {
        let companyid = result1[0].id;
        callback({
          companyid
        });
      } else {
        callback(null);
      }
    });
};

export const getCompanyEntityFromKey = (key, callback) => {
  db.company
    .findAll({
      attributes: ["id", "name"],
      where: {
        key
      },
      raw: true,
      order: [["id", "DESC"]]
    })
    .then(result1 => {
      if (result1.length > 0) {
        let companyid = result1[0].id;
        callback({
          companyid,
          name: result1[0].name
        });
      } else {
        callback(null);
      }
    });
};

export const userCompanyExist = (payload, success, error) => {
  db.companyuser
    .findAll({
      where: {
        companyid: payload.companyid,
        userid: payload.userid
      }
    })
    .then(result => {
      if (result.length > 0) {
        success(true);
      } else {
        success(false);
      }
    })
    .catch(err => {
      error(err);
    });
};
