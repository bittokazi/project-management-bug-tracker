"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const companies = await queryInterface.sequelize.query(
      `SELECT * FROM "companies"`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );
    if (companies) {
      let allPromises = [];
      await companies.forEach(async element => {
        await queryInterface.sequelize.transaction(async t => {
          allPromises.push(
            queryInterface.createTable(
              {
                tableName: "Task",
                schema: element.key
              },
              {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: Sequelize.INTEGER
                },
                name: {
                  type: Sequelize.STRING
                },
                description: {
                  type: Sequelize.STRING
                },
                type: {
                  type: Sequelize.INTEGER
                },
                status: {
                  type: Sequelize.INTEGER
                },
                reporter: {
                  type: Sequelize.INTEGER
                },
                assignee: {
                  type: Sequelize.INTEGER
                },
                projectid: {
                  allowNull: false,
                  type: Sequelize.INTEGER
                },
                boardid: {
                  allowNull: false,
                  type: Sequelize.INTEGER
                },
                createdAt: {
                  allowNull: false,
                  type: Sequelize.DATE
                },
                updatedAt: {
                  allowNull: false,
                  type: Sequelize.DATE
                }
              }
            )
          );
        });
      });
      return Promise.all(allPromises);
    } else {
      return Promise.all([]);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tasks");
  }
};
