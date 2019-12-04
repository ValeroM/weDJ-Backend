const db = require("../../database/models");
const { Song } = db;

const setup = () => {
  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [POST] api/songs endpoint");
    next();
  };

  // Add song code
  const addSongCode = (req, res) => {
    const new_song = req.body; // only expects the code for the song (The one YT api gives us) and the name of the song. 
    Song.create(new_song)
      .then((song) => {
        res.status(200).json(song); // After adding song, send OK message and return the song
      })
      .catch((err) => {
        res.status(400).json(err); // If cannot add song, send ERROR message
      });
  };

  return [logEndPoint, addSongCode]; // performs the methods we declared
};

module.exports = setup;
