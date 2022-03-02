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
                tableName: "Comments",
                schema: element.key
              },
              {
                id: {
                  allowNull: false,
                  autoIncrement: true,
                  primaryKey: true,
                  type: Sequelize.INTEGER
                },
                description: {
                  type: Sequelize.STRING
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
    return queryInterface.dropTable("Comments");
  }
};
