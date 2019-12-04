function setup() {
  return {
    // "()" is needed because we are calling a function
    songsOnTableSongs: require("./songs")(),
    addSongsToTableSongs: require("./postsongs")(),
    addSongsToQueue: require("./posttoqueue")(),
    getSongsInQueue: require("./getsongsinqueue")(),
    delSongInQueue: require("./delsonginqueue.js")(),
    updateSongRating: require("./updatesongrate.js")()
  };
}

module.exports = setup;

// when we import the songs directory, node looks for index.js first (this one), so back under routes/get-songs we are calling the specified controllers
