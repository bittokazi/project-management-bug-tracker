"use strict";
module.exports = (sequelize, DataTypes) => {
  const CompanyUser = sequelize.define(
    "companyuser",
    {
      companyid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id"
        }
      },
      userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "company",
          key: "id"
        }
      },
      role: {
        type: DataTypes.STRING
      }
    },
    {}
  );
  CompanyUser.associate = function(models) {
    // associations can be defined here
  };
  return CompanyUser;
};
