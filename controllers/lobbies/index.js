function setup() {
  return {
    // "()" is needed because we are calling a function
    addNewLobby: require("./postlobby")(),
    lobbieslist: require("./getlobbies")(),
    deleteLobby: require("./deletelobby")()
  };
}

module.exports = setup;
