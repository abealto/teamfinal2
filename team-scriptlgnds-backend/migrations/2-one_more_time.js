'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "UserUserId" to table "Posts"
 *
 **/

var info = {
    "revision": 2,
    "name": "one_more_time",
    "created": "2022-07-05T21:06:39.042Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "Posts",
        "UserUserId",
        {
            "type": Sequelize.INTEGER,
            "field": "UserUserId",
            "onUpdate": "CASCADE",
            "onDelete": "SET NULL",
            "references": {
                "model": "Users",
                "key": "user_id"
            },
            "allowNull": true
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
