const db = require("../../database/models");
const { Song, Lobby, Queue } = db;

const setup = () => {

  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [POST] api/songs/add endpoint");
    next();
  };

  const compositeKeyObj = {
    lobbyId: null,
    songId: null
  };

  const checkIfSongExistAlready = (req, res, next) => {
    const { song_code, name } = req.body
    Song.findOne({
      where: { song_code: song_code }
    })
      .then(song => {
        if (!song) {  // if not in our songs table already, we have to add it. 
          const new_song = {
            song_code: song_code,
            name: name
          }
          Song.create(new_song)
            .then((songJustAdded) => {
              compositeKeyObj.songId = songJustAdded.get('id'); // After adding song, get pk that sequelize just created 
              next(); // go to next method 
            })
            .catch((err) => {
              res.status(400).json(err); // If cannot add song, send ERROR message
            });
        }
        else {
          compositeKeyObj.songId = song.get('id'); // if already exist is our songs table, just get the pk
          next(); // go to next method 
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
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
          compositeKeyObj.lobbyId = lobby.get('id'); // if row found in lobby table, get the pk
          next(); // go to next method
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const addSongToQueueTableUsingCompositeKey = (req, res, next) => {
    const songEntryToQueue = { // the new record we are going to enter to queue table
      rate: 1, // rate 1 because it was just by someone
      lobbyId: compositeKeyObj.lobbyId,
      songId: compositeKeyObj.songId
    }
    Queue.create(songEntryToQueue)
      .then((newEntry) => {
        res.status(200).json(newEntry); // After adding, send OK message and return the obj just added to queue
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  return [
    logEndPoint,
    checkIfSongExistAlready,
    getLobbyId,
    addSongToQueueTableUsingCompositeKey
  ];
};

module.exports = setup;
