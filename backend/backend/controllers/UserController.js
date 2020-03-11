import {
  getAllUsers,
  checkUserAndEmailExist,
  addUserProtected
} from "./../service/UserService";
import UserAccess from "./../service/UserAccess";
import md5 from "md5";

export const UserList = (req, res, next) => {
  getAllUsers(
    req,
    result => {
      return res.status(200).json(result);
    },
    error => {
      console.error(error);
      return res.status(500).json({
        message: "Database Error"
      });
    }
  );
};

export const addUserController = (req, res, next) => {
  addUserProtected(
    req,
    res,
    req.body,
    req.tenant.key,
    result => {
      return res.status(200).json(result);
    },
    error => {
      console.error(error);
      return res.status(500).json({
        message: "Database Error"
      });
    }
  );
};

export const checkUserExist = (req, res, next) => {
  checkUserAndEmailExist(
    req.body,
    result => {
      return res.status(200).json(result);
    },
    error => {
      console.error(error);
      return res.status(500).json({
        message: "Database Error"
      });
    }
  );
};

export const whoAmI = (req, res, next) => {
  return res.status(200).json({
    username: req.user.username,
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    role: req.user.role,
    image: `http://www.gravatar.com/avatar/${md5(req.user.email)}?d=identicon`,
    access: UserAccess(req.user.role, req)
  });
};