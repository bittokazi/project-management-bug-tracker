import { getCompanyEntityFromKey } from "./../service/CompanyService";

export const companyCheckAPI = (req, res) => {
  getCompanyEntityFromKey(req.param("key"), result => {
    if (result) {
      return res.status(200).json({
        name: result.name
      });
    } else {
      return res.status(404).json({ message: "404" });
    }
  });
};
