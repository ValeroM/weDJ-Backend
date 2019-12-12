const db = require("../../database/models");
const { Lobby, Queue } = db;

const setup = () => {

  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [DELETE] /lobbies/delete endpoint");
    next();
  };

  let lobbyId = null;

  const getLobbyId = (req, res, next) => {
    const { lobby_code } = req.body // get lobby code from the request body
    Lobby.findOne({
      where: { lobby_code: lobby_code }
    })
      .then(lobby => {
        if (!lobby) { // if lobby not found, then we received wrong code from frontend. 
          return res.sendStatus(404);
        }
        else {
          lobbyId = lobby.get('id'); // if row found in lobby table, get the pk for the lobby
          next(); // go to next method
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const deleteRecordsInQueueWithDeletedLobby = (req, res, next) => {
    Queue.destroy({
      where: {
        lobbyId: lobbyId
      }
    })
      .then(response => {
        if (response) {
          next();
        }
        else {
          return res.sendStatus(404);
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const deleteLobbyRecordInLobbyTable = (req, res, next) => {
    Lobby.destroy({
      where: {
        lobby_code: req.body.lobby_code
      }
    })
      .then(response => {
        res.status(200).json(response); // 1 for succesfull and 0 for not successfull
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  return [
    logEndPoint,
    getLobbyId,
    deleteRecordsInQueueWithDeletedLobby,
    deleteLobbyRecordInLobbyTable
  ];
};

module.exports = setup;
