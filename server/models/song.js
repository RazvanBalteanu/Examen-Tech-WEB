const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

//Definire celei de-a doua entități - 0.3
const Song = sequelize.define("song", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
          len: 5
      }
    },
    url:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl:true
      }
    },
    stil: {
      type: DataTypes.ENUM({
        values: ['POP', 'ALTERNATIVE']
      }),
      validate: {
        isIn: {
          args: [['POP', 'ALTERNATIVE']],
            msg: "Valorile POSIBILE ale acestui camp sunt: POP, ALTERNATIVE."
        }
      }
    }
  });
  
  module.exports = Song;
  