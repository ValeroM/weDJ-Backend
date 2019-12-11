const express = require("express");
const cors = require("cors");
const { lobbies } = require("../controllers"); // gets lobbies directory from the index.js under controllers directory

const setup = () => {
  const controller = lobbies(); // imports the controllers (i.e, whatever logic we want to perform)
  const router = express.Router();

  router.options("/", cors());
  router.get("/", controller.lobbieslist);
  router.post("/", cors(), controller.addNewLobby);

  return router;
};

module.exports = setup;
