const express = require("express");

const routes = () => {
  const app = express();

  // if the front end hits the "/songs" endpoint, it will render the get-songs.js file
  // also, this line basically says mount the router as middleware at path /songs
  // then under the get-songs.js, the router.get is only for defining subpaths (i.e., /songs/somethingElse)
  app.use("/songs", require("./get-songs")()); // the "()" after the require is needed because we are invoking a function. Great explanation here: https://stackoverflow.com/questions/24044997/what-does-double-parentheses-mean-in-a-require
  app.use("/lobbies", require("./get-lobbies")());

  // if the front end hits the "/" endpoint, it will run the call back function below
  app.use("/", (req, res, next) => {
    console.log("You have hit [GET] /api endpoint");
    let responseMessage = "Welcome to weDJ API";
    console.log("Sending back the following message:\n" + responseMessage);
    // Return message
    return res.status(200).send(responseMessage);
  });

  return app;
};

const attachRoutes = (app) => {
  app.use("/api", routes());
};

module.exports = attachRoutes;
