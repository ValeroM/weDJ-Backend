const db = require("../../database/models");
const { Song, Lobby, Queue } = db;

const setup = () => {

  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [DELETE] api/songs/delete endpoint");
    next();
  };

  const compositeKeyObj = {
    lobbyId: null,
    songId: null
  };

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
          compositeKeyObj.lobbyId = lobby.get('id'); // if row found in lobby table, get the pk for the lobby
          next(); // go to next method
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const getSongId = (req, res, next) => {
    const { song_code, name } = req.body;
    Song.findOne({
      where: {
        song_code: song_code,
        name: name
      }
    })
      .then(songFound => {
        if (!songFound) { // if song record not found, then we received wrong song code from frontend. 
          return res.sendStatus(404);
        }
        else {
          compositeKeyObj.songId = songFound.get('id'); // if row found in song table, get the pk
          next();
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const deleteSongFromQueue = (req, res, next) => {
    Queue.destroy({
      where: {
        lobbyId: compositeKeyObj.lobbyId,
        songId: compositeKeyObj.songId
      }
    })
      .then(response => {
        res.status(200).json(response); // 1 for succesfull and 0 for not successfull
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  return [
    logEndPoint,
    getLobbyId,
    getSongId,
    deleteSongFromQueue
  ];
};

module.exports = setup;
