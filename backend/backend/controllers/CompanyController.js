import { addCompany, getAllCompanies } from "./../service/CompanyService";
import { getUserCompanies } from "./../service/TenatService";
import UserRole from "./../service/UserRole";

export const createCompany = (req, res, next) => {
  addCompany(
    req.body,
    result => {
      return res.status(200).json(result);
    },
    error => {
      return res.status(500).json(error);
    }
  );
};

export const getCompanies = (req, res, next) => {
  if (req.user.role == UserRole.owner) {
    getUserCompanies(
      req.user,
      result => {
        return res.status(200).json(result.companies);
      },
      error => {
        return res.status(500).json(error);
      }
    );
  } else if (req.user.role == UserRole.superAdmin) {
    getAllCompanies(
      result => {
        return res.status(200).json(result);
      },
      error => {
        return res.status(500).json(error);
      }
    );
  }
};
