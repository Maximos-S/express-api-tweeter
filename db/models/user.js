'use strict';
const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    hashedPassword: DataTypes.STRING
  }, {});
  User.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString())
  }
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};