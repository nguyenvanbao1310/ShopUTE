"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderDetails", {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      orderId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: "Orders", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      productId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: "Products", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      price: { type: Sequelize.DECIMAL(12,2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      subtotal: { type: Sequelize.DECIMAL(14,2), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
    });
  },
  async down(queryInterface) {
    return queryInterface.dropTable("OrderDetails");
  }
};
