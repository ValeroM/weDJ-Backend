const db = require("../../database/models");
const { Lobby } = db;

function createCode(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const setup = () => {
  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [POST] api/lobbies endpoint");
    next();
  };

  const addLobby = (req, res) => {
    const new_lobby = {
      name: req.body.name, // get the name from the params sent by the frontend
      lobby_code: createCode(6)
    }
    // using sequelize, we create a new record for our table "lobbies" with new_lobby
    Lobby.create(new_lobby)
      .then((lobby) => {
        res.status(200).json(lobby);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  return [logEndPoint, addLobby]; // performs the methods we declared
};

module.exports = setup;
