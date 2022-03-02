"use strict";
module.exports = (sequelize, DataTypes) => {
  const board = sequelize.define(
    "board",
    {
      title: DataTypes.STRING
    },
    {}
  );
  board.associate = function(models) {
    // associations can be defined here
    board.hasMany(models.Task, { foreignKey: "boardid", as: "tasks" });
  };
  return board;
};
