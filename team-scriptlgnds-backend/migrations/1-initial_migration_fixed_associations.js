'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "games", deps: []
 * createTable "Reviews", deps: []
 * createTable "Users", deps: []
 * createTable "Posts", deps: [games, Users, Users]
 *
 **/

var info = {
  revision: 1,
  name: 'initial_migration_fixed_associations',
  created: '2022-07-05T17:42:26.969Z',
  comment: '',
};

var migrationCommands = [
  {
    fn: 'createTable',
    params: [
      'games',
      {
        GameId: {
          type: Sequelize.INTEGER,
          field: 'GameId',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        GameThumbnail: {
          type: Sequelize.STRING,
          field: 'GameThumbnail',
        },
        Name: {
          type: Sequelize.STRING,
          field: 'Name',
        },
        Description: {
          type: Sequelize.STRING,
          field: 'Description',
        },
        post_id: {
          type: Sequelize.INTEGER,
          field: 'post_id',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'Reviews',
      {
        review_id: {
          type: Sequelize.INTEGER,
          field: 'review_id',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        postGameId: {
          type: Sequelize.INTEGER,
          field: 'postGameId',
        },
        review: {
          type: Sequelize.STRING,
          field: 'review',
        },
        rating: {
          type: Sequelize.INTEGER,
          field: 'rating',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'Users',
      {
        user_id: {
          type: Sequelize.INTEGER,
          field: 'user_id',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        username: {
          type: Sequelize.STRING,
          field: 'username',
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          field: 'email',
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: 'password',
          allowNull: false,
        },
        admin: {
          type: Sequelize.BOOLEAN,
          field: 'admin',
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      {},
    ],
  },
  {
    fn: 'createTable',
    params: [
      'Posts',
      {
        post_id: {
          type: Sequelize.INTEGER,
          field: 'post_id',
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        post: {
          type: Sequelize.STRING,
          field: 'post',
        },
        GameId: {
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: {
            model: 'games',
            key: 'GameId',
          },
          allowNull: true,
          field: 'GameId',
        },
        user_id: {
          type: Sequelize.INTEGER,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          references: {
            model: 'Users',
            key: 'user_id',
          },
          allowNull: true,
          field: 'user_id',
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      {},
    ],
  },
];

module.exports = {
  pos: 0,
  up: function (queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log('[#' + index + '] execute: ' + command.fn);
          index++;
          queryInterface[command.fn]
            .apply(queryInterface, command.params)
            .then(next, reject);
        } else resolve();
      }
      next();
    });
  },
  info: info,
};
