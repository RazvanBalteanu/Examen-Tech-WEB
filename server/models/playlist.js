const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

//Definirea primei entități - 0.3
const Playlist = sequelize.define("playlist", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  descriere: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: 3,
    },
  },
  data: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isAfter: "2022-02-12"
    }
  }
});

module.exports = Playlist;
