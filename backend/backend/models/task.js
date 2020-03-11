"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      type: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      reporter: DataTypes.INTEGER,
      assignee: DataTypes.INTEGER,
      projectid: DataTypes.INTEGER,
      boardid: DataTypes.INTEGER
    },
    {}
  );
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.project, { foreignKey: "projectid", as: "project" });
    Task.belongsTo(models.board, { foreignKey: "boardid", as: "board" });
  };
  return Task;
};
