module.exports = (sequelize, DataTypes) => {
  const Queue = sequelize.define("queue", {
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  return Queue;
};
