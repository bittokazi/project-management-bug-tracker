"use strict";
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "company",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      enabled: DataTypes.BOOLEAN,
      key: DataTypes.STRING
    },
    {}
  );
  Company.associate = function(models) {
    Company.belongsToMany(models.user, {
      through: "companyuser",
      as: "users",
      foreignKey: "companyid",
      otherKey: "userid"
    });
  };
  return Company;
};
