const db = require("../../database/models");
const { Lobby } = db;

const setup = () => {
  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [GET] api/lobbies endpoint");
    next();
  };

  const getLobbiesFromDb = (req, res) => {
    Lobby.findAll().then((lobbies) => res.status(200).json(lobbies));
  };

  return [logEndPoint, getLobbiesFromDb]; // performs the methods we declared
};

module.exports = setup;
