module.exports = (sequelize, DataTypes) => {
  const Lobby = sequelize.define("lobby", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lobby_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Lobby code is already in use!'
      }
    }
  });
  Lobby.associate = function (models) {
    models.Lobby.belongsToMany(models.Song, { through: models.Queue });
  };
  return Lobby;
};

/*
Links that explain how the relationship between tables work and how we are able to create a composite queue in the table "Queue":
https://stackoverflow.com/questions/36883437/sequelize-foreign-keys-as-composite-primary-key/48917638
https://stackoverflow.com/questions/56122602/understanding-associations-in-sequelize
https://sequelize.readthedocs.io/en/latest/docs/associations/
*/
