var express = require('express');
var router = express.Router();
const { Post } = require('../models');
var auth = require('../services/auth');

/* POST create a post */
router.post('/:id/', async (req, res, next) => {
  let token = req.localStorage.token;
  if (token) {
    auth.verifyUser2(token).then((user) => {
      if (!user) {
        res.status(403).send();
        return;
      }

      // create a post with the userid
      Post.create({
        post: req.body.body,
        user_id: user.user_id,
        GameId: req.params.id,
      })
        .then((newPost) => {
          res.json(newPost);
        })
        .catch(() => {
          res.status(400).send();
        });
    });
  }
});

/* POST create a post */
router.post('/create/:id', async (req, res, next) => {
  console.log(req.body);
  console.log(req.params.id);
  // let token = req.params.token;
  // if (token) {
  //   auth.verifyUser2(token).then((user) => {
  //     if (!user) {
  //       res.status(403).send();
  //       return;
  //     }

  //     // create a post with the userid
  //     Post.create({
  //       post: req.body.body,
  //       user_id: user.user_id,
  //       GameId: req.params.id,
  //     })
  //       .then((newPost) => {
  //         res.json(newPost);
  //       })
  //       .catch(() => {
  //         res.status(400).send();
  //       });
  //   });
  // }
  // console.log(req.body);
  // console.log(req.params.id);

  // create a post with the userid
  Post.create({
    post: req.body.post,
    GameId: req.params.id,
    user_id: req.body.userData.user_id,
  })
    .then((newPost) => {
      res.json(newPost);
    })
    .catch(() => {
      res.status(400).send();
    });
});

//--------------------------------------------------

//Delete Post
router.delete('/:id', (req, res, next) => {
  const postId = parseInt(req.params.id);

  if (!postId || postId <= 0) {
    res.status(400).send('Invalide ID');
    return;
  }
  Post.destroy({
    where: {
      post_id: postId,
    },
  })
    .then(() => {
      res.status(204).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

router.get('/:id', function (req, res, next) {
  const gameIdParam = parseInt(req.params.id);
  Post.findAll({
    where: {
      gameId: gameIdParam,
    },
  }).then((posts) => {
    res.json(posts);
  });
});

module.exports = router;
