const db = require("../../database/models");
const { Song, Lobby, Queue } = db;

const setup = () => {

  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [GET] api/songs/queue/:lobbycode endpoint");
    next();
  };

  let lobbyIdTemp = null;
  let finalData = []; // array of objs that will contain all songs for the front end from a specicic lobby

  const getLobbyId = (req, res, next) => {
    const { lobbycode } = req.params; // get lobby code from the request body
    Lobby.findOne({
      where: { lobby_code: lobbycode },
    })
      .then(lobby => {
        if (!lobby) { // if lobby not found, then we received wrong code from frontend. 
          return res.sendStatus(404);
        }
        else {
          lobbyIdTemp = lobby.get('id'); // if row found in lobby table, get the pk for the lobby
          next(); // go to next method
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const getSongsPKsInQueueForSpecificLobby = (req, res, next) => {
    Queue.findAll({
      where: {
        lobbyId: lobbyIdTemp
      }
    }) // myArrWithIds is an array of objs, where each obj is a record in our queue table for THAT lobby code
      .then(myArrWithIds => {
        finalData = []; // RESET ARRAY. FOR SOME REASON THIS WORKS. NOTE: ASK TEACHER WHY. -- MARCO VALERO
        myArrWithIds.forEach(obj => { // store all songs as objs for the specific lobby in an array
          finalData.push({
            id: obj.songId,
            rate: obj.rate,
            name: null, // this will get filled in the next method
            song_code: null
          });
        });
        next(); // go to next method 
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  const getSongsForSpecificLobby = (req, res, next) => {
    let arrayWithSongPks = finalData.map(obj => obj.id); // array with all the pks songs in a specific lobby
    Song.findAll({
      where: {
        id: arrayWithSongPks // find all the records in songs table that matches all these pks
      }
    })
      .then(songsFound => { // songsFound is an array of objs that matches the query above
        songsFound.forEach(song => { // for each song
          let index = finalData.findIndex(elem => elem.id == song.id); // get index of a song in my final data arr
          finalData[index].name = song.name; // when found, update the name and code since it was null before
          finalData[index].song_code = song.song_code;
        });
        res.status(200).json(finalData); // send the frontend all the songs for a specific queue 
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  };

  return [
    logEndPoint,
    getLobbyId,
    getSongsPKsInQueueForSpecificLobby,
    getSongsForSpecificLobby
  ];

};

module.exports = setup;