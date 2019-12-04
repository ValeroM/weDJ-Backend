const db = require("../../database/models");
const { Song } = db;

const setup = () => {

  const logEndPoint = (req, res, next) => {
    console.log("You have hit the [GET] api/songs endpoint");
    next();
  };

  // Return all songs in our songs table
  const sendBackSongsCodes = (req, res, next) => {
    Song.findAll().then((songs) => res.status(200).json(songs));
  };

  return [logEndPoint, sendBackSongsCodes]; // performs the methods we declared
};

module.exports = setup;
