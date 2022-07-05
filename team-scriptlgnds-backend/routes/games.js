var express = require('express');
var router = express.Router();
const { Post, User, games } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

var auth = require('../services/auth');

router.get('/games', function (req, res, next) {
  User.findAll().then((games) => {
    res.json(games);
  });
});

// //--------------------------------------------------

// Search
router.get('/search/:query', (req, res, next) => {
  games
    .findAll({
      where: {
        //Name: req.params.query,
        [Op.or]: [{ Name: { [Op.like]: '%' + req.params.query + '%' } }],
      },
    })
    .then(
      (rows) => {
        if (rows) {
          res.json(rows);
        } else {
          res.status(404).send();
        }
      },
      (err) => {
        res.status(500).send(err);
      }
    );
});

router.get('/list', (req, res, next) => {
  games.findAll().then((games) => {
    res.json(games);
  });
});

// router.get('/:id', (req, res, next) => {
//   const gameId = parseInt(req.params.id);

//   games
//     .findOne({
//       where: {
//         GameId: gameId,
//       },
//       include: [Post],
//     })
//     .then(
//       (theGame) => {
//         if (theGame) {
//           res.json(theGame);
//         } else {
//           res.status(404).send();
//         }
//       },
//       (err) => {
//         res.status(500).send(err);
//       }
//     );
// });

//Get posts by game ID
router.get('/:id', (req, res, next) => {
  const gameIdParam = parseInt(req.params.id);

  // Post.findAll({
  //   where: {
  //     gameId: gameIdParam,
  //   },
  // }).then((posts) => {
  //   console.log(posts);
  //   res.json(posts);
  // });

  games
    .findOne({
      where: {
        GameId: gameIdParam,
      },
    })
    .then((response) => {
      res.json(response);
    });
});

module.exports = router;
