import { getUserCompanies } from "./../service/TenatService";

export const getUserCompany = (req, res, next) => {
  getUserCompanies(
    req.user,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};
