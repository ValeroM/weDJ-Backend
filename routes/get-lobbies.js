const express = require("express");
const cors = require("cors");
const { lobbies } = require("../controllers"); // gets lobbies directory from the index.js under controllers directory

const setup = () => {
  const controller = lobbies(); // imports the controllers (i.e, whatever logic we want to perform)
  const router = express.Router();

  router.options("/", cors());
  router.options("/delete", cors());

  router.get("/", cors(), controller.lobbieslist);
  router.post("/", cors(), controller.addNewLobby);
  router.delete("/delete", cors(), controller.deleteLobby);

  return router;
};

module.exports = setup;
