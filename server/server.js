"use strict";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const aplicatie = express();

aplicatie.use(cors());
aplicatie.use(bodyParser.json());

const sequelize = require("./sequelize");

const Playlist = require("./models/playlist");
const Song = require("./models/song");

//Definirea relației dintre cele două entități - 0.3
Playlist.hasMany(Song, { foreignKey: "id_playlist" });

aplicatie.use(
  express.urlencoded({
    extended: true,
  })
);
aplicatie.use(express.json());

aplicatie.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}.`);
});

aplicatie.use((error, request, response, next) => {
  console.error(`[ERROR]: ${error}`);
  response.status(500).json(error);
});

aplicatie.get("/create", async (request, response, next) => {
  try {
    await sequelize.sync({ force: true });
    response.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

          //ENTITATEA 1 - PLAYLIST
// Operație GET pentru prima entitate - 0.3
aplicatie.get("/playlists", async (request, response, next) => {
  try {
    // Filtrare după două câmpuri pentru prima entitate - 0.3
    // Sortare după un câmp pentru prima entitate - 0.3
    // Paginare pentru prima entitate - 0.3
    const Op = require("sequelize").Op;
    const query = {};
    let pePag = 4;
    const filtre = ["descriere", "id"];
    const chei = Object.keys(request.query).filter(
      (e) => filtre.indexOf(e) !== -1
    );
    if (chei.length > 0) {
      query.where = {};
      for (const cheie of chei) {
        if (isNaN(request.query[cheie]) == true) {
          query.where[cheie] = {
            [Op.like]: `%${request.query[cheie]}%`,
          };
        } else {
          query.where[cheie] = {
            [Op.gt]: parseInt(request.query[cheie]),
          };
        }
      }
    }

    const campSortare = "data";
    let ordineSortare = "ASC";
    if (request.query.ordineSortare && request.query.ordineSortare === "-1") {
      ordineSortare = "DESC";
    }

    if (request.query.pePag) {
      pePag = parseInt(request.query.pePag);
    }

    if (campSortare) {
      query.order = [[campSortare, ordineSortare]];
    }

    if (!isNaN(parseInt(request.query.page))) {
      query.limit = pePag;
      query.offset = pePag * parseInt(request.query.page);
    }

    const records = await Playlist.findAll(query);
    const count = await Playlist.count();
    response.status(200).json({ records, count });
  } catch (e) {
    console.warn(e);
    response.status(500).json({ message: "There is an error within this server" });
  }
});

//Operație GET pentru prima entitate - 0.3
aplicatie.get("/playlists/:playlistId", async (request, response, next) => {
  try {
    const playlist = await Playlist.findByPk(request.params.playlistId);
    if (playlist) {
      response.status(200).json(playlist);
    } else {
      response.status(404).json({
        error: `There is no Playlist with id: ${req.params.playlistId} !`,
      });
    }
  } catch (err) {
    next(err);
  }
});

//Operație POST pentru prima entitate - 0.3
aplicatie.post("/playlists", async (request, response, next) => {
  try {
    const playlist = await Playlist.create(request.body);
    response.status(201).json({ message: "A new Playlist was added!" });
  } catch (error) {
    next(error);
  }
});

//Operație PUT pentru prima entitate - 0.3
aplicatie.put("/playlists/:playlistId", async (request, response, next) => {
  try {
    const playlist = await Playlist.findByPk(request.params.playlistId);
    if (playlist) {
      await playlist.update(request.body);
      response.status(200).json({
        message: `There are new changes within the playlist with the id: ${request.params.playlistId} !`,
      });
    } else {
      response.status(404).json({
        error: `There is no Playlist with id: ${request.params.playlistId} !`,
      });
    }
  } catch (err) {
    next(err);
  }
});

//Operație DELETE pentru prima entitate - 0.3
aplicatie.delete("/playlists/:playlistId", async (request, response, next) => {
  try {
    const playlist = await Playlist.findByPk(request.params.playlistId);
    if (playlist) {
      await playlist.destroy();
      response.status(200).json({
        message: `The Playlist with id: ${request.params.playlistId} was deleted!`,
      });
    } else {
      response.status(404).json({
        error: `There is no Playlist with id: ${request.params.playlistId} !`,
      });
    }
  } catch (err) {
    next(err);
  }
});

          //ENTITATEA 2 - 
//Operație GET pentru a doua entitate ca subresursă - 0.3
aplicatie.get(
  "/playlists/:playlistId/songs",
  async (request, response, next) => {
    try {
      const playlist = await Playlist.findByPk(request.params.playlistId);
      if (playlist) {
        const records = await playlist.getSongs();
        if (records.length > 0) {
          response.status(200).json({ records });
        } else {
          response.sendStatus(204);
        }
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//Operație GET pentru a doua entitate ca subresursă - 0.3
aplicatie.get(
  "/playlists/:playlistId/songs/:songId",
  async (request, response, next) => {
    try {
      const playlist = await Playlist.findByPk(request.params.playlistId);
      if (playlist) {
        const songs = await playlist.getSongs({
          where: { id: request.params.songId },
        });
        const song = songs.shift();
        if (song) {
          response.status(200).json(song);
        } else {
          response.sendStatus(404);
        }
      } else {
        response.status(404).json({
          error: `There is no Song with id: ${request.params.songId} !`,
        });
      }
    } catch (err) {
      next(error);
    }
  }
);

//Operație POST pentru a doua entitate ca subresursă - 0.3
aplicatie.post(
  "/playlists/:playlistId/songs",
  async (request, response, next) => {
    try {
      const playlist = await Playlist.findByPk(request.params.playlistId);
      if (playlist) {
        const song = await Song.create(request.body);
        playlist.addSong(song);
        await playlist.save();
        response.status(200).json(song);
      } else {
        response.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//Operație PUT pentru a doua entitate ca subresursă - 0.3
aplicatie.put(
  "/playlists/:playlistId/songs/:songId",
  async (request, response, next) => {
    try {
      const playlist = await Playlist.findByPk(request.params.playlistId);
      if (playlist) {
        const songs = await playlist.getSongs({
          where: { id: request.params.songId },
        });
        const song = songs.shift();
        if (song) {
          await song.update(request.body);
          response.status(200).json({
            message: `There are new changes within the Song with the id:${request.params.songId} !`,
          });
        } else {
          response.status(404).json({
            error: `There is no Song with id: ${request.params.songId} !`,
          });
        }
      } else {
        response.sendStatus(404);
      }
    } catch (err) {
      next(err);
    }
  }
);

//Operație DELETE pentru a doua entitate ca subresursă - 0.3
aplicatie.delete(
  "/playlists/:playlistId/songs/:songId",
  async (request, response, next) => {
    try {
      const playlist = await Playlist.findByPk(request.params.playlistId);
      if (playlist) {
        const songs = await playlist.getSongs({
          where: { id: request.params.songId },
        });
        const song = songs.shift();
        if (song) {
          await song.destroy();
          response.status(200).json({
            message: `The Song with id: ${request.params.songId} was deleted !`,
          });
        } else {
          response.status(404).json({
            error: `There is no Song with id: ${request.params.songId} !`,
          });
        }
      } else {
        response.status(404).json({
          error: `There is no Song with id: ${request.params.songId} !`,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
