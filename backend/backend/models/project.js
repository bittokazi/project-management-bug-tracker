"use strict";
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define(
    "project",
    {
      title: DataTypes.STRING,
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {}
  );
  project.associate = function(models) {
    // associations can be defined here
    project.hasMany(models.Task, { foreignKey: "projectid", as: "tasks" });
  };
  return project;
};
