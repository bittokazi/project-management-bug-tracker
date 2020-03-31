import bcrypt from "bcrypt";
import * as db from "./../models";
import {
  getCompanyFromKey,
  addUserToCompany,
  userCompanyExist
} from "./CompanyService";
import { validationResult } from "express-validator";
import { KJUR } from "jsrsasign";
import Config from "./../config/Config";

export const getAllUsers = (req, success, error) => {
  let where = {};
  if (req.tenant) {
    getCompanyFromKey(req.tenant.key, company => {
      db.company
        .findAll({
          where: {
            id: company.companyid
          },
          include: [
            {
              model: db.user,
              as: "users",
              attributes: ["id", "username", "email", "firstName", "lastName"]
            }
          ]
        })
        .then(result => {
          success(result[0].users);
        })
        .catch(err => {
          error(err);
        });
    });
  } else {
    db.user
      .findAll({
        attributes: ["id", "username", "email", "firstName", "lastName"],
        raw: true,
        order: [["id", "DESC"]]
      })
      .then(result => {
        success(result);
      })
      .catch(err => {
        error(err);
      });
  }
};

export const addUserProtected = (req, res, payload, tenant, success, error) => {
  getCompanyFromKey(tenant, callbackReslt => {
    payload.password = bcrypt.hashSync(payload.password, 10);
    payload.changePassword = true;
    payload.role = "tenantUser";
    if (callbackReslt != null) {
      checkUserAndEmailExist(
        payload,
        result => {
          if (result.length > 0) {
            getCompanyFromKey(tenant, companyUser => {
              companyUser.userid = result[0].id;
              companyUser.role = "user";
              userCompanyExist(
                companyUser,
                successResult => {
                  if (!successResult) {
                    addUserToCompany(
                      companyUser,
                      result => {
                        success({});
                      },
                      err => {
                        error(err);
                      }
                    );
                  } else {
                    success({});
                  }
                },
                err => {
                  error(err);
                }
              );
            });
          } else {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() });
            }
            db.user
              .create(payload)
              .then(result => {
                checkUserAndEmailExist(
                  payload,
                  result => {
                    getCompanyFromKey(tenant, companyUser => {
                      companyUser.userid = result[0].id;
                      companyUser.role = "user";
                      addUserToCompany(
                        companyUser,
                        result => {
                          success({});
                        },
                        err => {
                          error(err);
                        }
                      );
                    });
                  },
                  err => {
                    error(err);
                  }
                );
              })
              .catch(err => {
                error(err);
              });
          }
        },
        err => {
          error(err);
        }
      );
    } else {
      error(err);
    }
  });
};

export const checkUserAndEmailExist = (payload, success, error) => {
  db.user
    .findAll({
      where: db.Sequelize.or(
        { username: payload.username },
        { email: payload.email }
      ),
      attributes: ["id"],
      include: [{ all: true }],
      order: [["id", "DESC"]]
    })
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};

export const addUser = (user, success, error) => {
  user.password = bcrypt.hashSync(user.password, 10);
  user.changePassword = true;
  user.role = "tenantUser";
  db.user
    .create(user)
    .then(result => {
      success(result);
    })
    .catch(err => {
      error(err);
    });
};

export const generateChatServerToken = user => {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({
    tenant: user.tenant,
    id: user.id,
    name: user.username
  });
  const authToken = KJUR.jws.JWS.sign(
    "HS256",
    header,
    payload,
    Config().JWT_SECRET
  );
  return authToken;
};
