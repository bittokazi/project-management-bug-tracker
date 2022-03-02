import {
  getAllUsers,
  checkUserAndEmailExist,
  addUserProtected
} from "./../../service/UserService";
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
