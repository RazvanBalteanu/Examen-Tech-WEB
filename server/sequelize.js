const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./sqlite/playlists_examDB.db",
  define: {
    timestamps: false,
  },
});

module.exports = sequelize;