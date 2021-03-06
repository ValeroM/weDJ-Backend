const express = require("express");
const cors = require("cors");
const { songs } = require("../controllers"); // the syntax "{ songs }" is the destructuring assignment syntax. This is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects,into distinct variables.
// in order to be able to use the controllers by importing from the controller directory, the "songs"  variable has to match the key under the index.js file under controllers directory

const setup = () => {
  const controller = songs(); // imports the controllers (i.e, whatever logic we want to perform)
  const router = express.Router();

  router.options("/", cors());
  router.options("/add", cors());
  router.options("/queue/:lobbycode", cors());
  router.options("/delete", cors());
  router.options("/rate/:lobbycode/:songcode/:rate", cors());

  router.get("/", cors(), controller.songsOnTableSongs); // calls the actual logic from the controller/songs/songs.js file
  router.post("/", cors(), controller.addSongsToTableSongs); // logic from controller/songs/postsongs.js
  router.post("/add", cors(), controller.addSongsToQueue); // logic from controller/songs/posttoqueue.js
  router.get("/queue/:lobbycode", cors(), controller.getSongsInQueue); // logic from controller/songs/getsongsinqueue.js
  router.delete("/delete", cors(), controller.delSongInQueue); // logic from controller/songs/deletesonginqueue.js
  router.put("/rate/:lobbycode/:songcode/:rate", cors(), controller.updateSongRating);

  return router;
};

module.exports = setup;
