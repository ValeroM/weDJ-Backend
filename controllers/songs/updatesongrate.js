const db = require("../../database/models");
const { Song, Queue, Lobby } = db;

const setup = () => {

    const logEndPoint = (req, res, next) => {
        console.log("You have hit the [GET] api/songs/:lobbycode/:songcode/:rate endpoint");
        next();
    };

    const compositeKeyObj = {
        lobbyId: null,
        songId: null
    };

    const findSongByPk = (req, res, next) => {

        // Parse JSON body
        const song_id = req.params.songcode;

        // Find "song_id" in Song table
        Song
            .findOne({ where: { song_code: song_id } })
            .then(isSongFound => {

                // Check if song was found
                if (!isSongFound) {
                    // Send back JSON message
                    res.sendStatus(400);
                } else {

                    // Execute code below, if song was found
                    // Get song's primary key
                    compositeKeyObj.songId = isSongFound.get("id");
                    next();
                }
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    }

    const findLobbyByPk = (req, res, next) => {

        // Parse JSON boddy
        const lobby_id = req.params.lobbycode;

        // Look for lobby_id in Lobby table
        Lobby
            .findOne({ where: { lobby_code: lobby_id } })
            .then(isLobbyFound => {

                // Return error 400, if lobby wasn't found
                if (!isLobbyFound) {
                    res.sendStatus(400);
                } else {
                    // Get lobby's primary key, if found
                    compositeKeyObj.lobbyId = isLobbyFound.get("id");
                    next();
                }
            })
            .catch((err) => {
                res.status(400).json(err);
            })
    }

    const changeSongRating = (req, res) => {

        // OBJECTIVE: Go to Queue's lobby and fetch row with lobby's and song's id

        // Parse JSON body
        const incoming_rate = parseInt(req.params.rate);

        if (incoming_rate > 1 || incoming_rate < -1) {
            res.sendStatus(400);
        }

        Queue
        .findOne({
            returning: false,
            where: {lobbyId: compositeKeyObj.lobbyId,
            songId: compositeKeyObj.songId}
        })
        .then((recordFound) => {
            if (incoming_rate == 1) {
                recordFound.increment("rate", {by: 1});
                res.sendStatus(200);
            } else if (incoming_rate == -1) {
                recordFound.decrement("rate", {by: 1});
                res.sendStatus(200);
            }
        })
        .catch( (err) => {
            res.status(400).json(err);
        })
    }

    return [logEndPoint, findSongByPk, findLobbyByPk, changeSongRating]; // performs the methods we declared
};

module.exports = setup;
