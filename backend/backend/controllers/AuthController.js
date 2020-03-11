import { checkUserGetOauthCredentials } from "./../service/AuthService";
import { addUser } from "./../service/UserService";
import {
  addCompany,
  addUserToCompany,
  generateCompanyUser,
  getCompanyFromKey
} from "./../service/CompanyService";

export const login = (req, res, next) => {
  checkUserGetOauthCredentials(
    {
      username: req.body.username,
      password: req.body.password
    },
    result => {
      return res.status(200).json(result);
    },
    notFound => {
      return res.status(401).json({
        message: "Authorization Failed"
      });
    },
    error => {
      return res.status(500).json(error);
    }
  );
};

export const registerCompanyAndUser = (req, res, next) => {
  getCompanyFromKey(req.body.company.key, result => {
    if (result == null) {
      addUser(
        req.body.user,
        result => {
          addCompany(
            req.body.company,
            success => {
              console.log("user created, Company Created");
              generateCompanyUser(
                req.body.user,
                req.body.company,
                companyUser => {
                  companyUser.role = "owner";
                  console.log(companyUser);
                  addUserToCompany(
                    companyUser,
                    success => {
                      return res.status(200).json({ success: true });
                    },
                    error => {
                      return res.status(500).json(error);
                    }
                  );
                }
              );
            },
            error => {
              return res.status(500).json(error);
            }
          );
        },
        error => {
          return res.status(500).json(error);
        }
      );
    } else {
      return res.status(422).json({
        error: [{ msg: "Company Key Exist" }]
      });
    }
  });
};
