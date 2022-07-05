const jwt = require('jsonwebtoken');
const { User } = require('../models');
var bcrypt = require('bcrypt');

const secretKey = 'password123';

// using jwt to create a JWT token
module.exports = {
  verifyUser: (token) => {
    const decodedPayload = jwt.verify(token, secretKey);
    return User.findByPk(decodedPayload.id);
  },
  signUser: function (user) {
    const token = jwt.sign(
      {
        username: user.username,
        user_id: user.user_id,
      },
      'secretKey',
      {
        expiresIn: '1h',
      }
    );
    return token;
  },
  verifyUser2: function (token) {
    try {
      let decoded = jwt.verify(token, 'secretKey');

      return User.findByPk(decoded.user_id);
    } catch (err) {
      console.log(err);
      return null;
    }
  },
  hashPassword: function (plainTextPassword) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(plainTextPassword, salt);
    return hash;
  },
  comparePasswords: function (plainTextPassword, hashedPassword) {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  },
};
