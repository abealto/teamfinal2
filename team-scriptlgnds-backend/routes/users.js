var express = require('express');
var router = express.Router();
const { User } = require('../models');
const models = require('../models');
var bcrypt = require('bcrypt');
var auth = require('../services/auth');

/* GET users listing. */
router.get('/users', function (req, res, next) {
  User.findAll().then((userList) => {
    res.json(userList);
  });
});

/* GET /:id get individual user */
router.get('/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);

  User.findOne({
    where: {
      id: userId,
    },
  }).then(
    (theUser) => {
      if (theUser) {
        res.json(theUser);
      } else {
        res.status(404).send();
      }
    },
    (err) => {
      res.status(500).send(err);
    }
  );
});

//---------------------------------------------------------

/* POST Register user and create a user */
router.post('/signup', async (req, res, next) => {
  // verifing user&password do not equal null
  if (!req.body.username || !req.body.password) {
    res.status(400).send('Username and Password Required');
    return;
  }
  // hash the password
  // salt = the number of times the encryption runs
  // higher the salt number the greater the encrytion
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  User.create({
    username: req.body.username,
    email: req.body.email,
    password: auth.hashPassword(req.body.password),
  })
    .then((newUser) => {
      res.json({
        //only returning userid & username
        id: newUser.id,
        username: newUser.username,
      });
    })
    .catch(() => {
      res.status(400).send('User Not Created');
    });
});

// POST Login
router.post('/login', async (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then(async (user) => {
    // check if user exists
    if (!user) {
      res.status(404).send('Invalid Username');
      return;
    }
    // check the password
    // compare returns a boolean
    const valid = await bcrypt.compare(req.body.password, user.password);

    if (valid) {
      // create the token
      const jwt = auth.signUser(user);
      res.status(200).send({ jwt, user });
    } else {
      res.status(401).send('Invalid Password');
    }
  });
});

router.get('/profile/:token', function (req, res) {
  let token = req.params.token;
  if (token) {
    auth.verifyUser2(token).then((user) => {
      // make a find one in the models

      if (user) {
        User.findAll({
          where: { user_id: user.dataValues.user_id },
        }).then((response) => {
          res.json(response[0]);
        });
      }
    });
  }
});

//Get Single User Information
router.get('/profile/:id', function (req, res, next) {
  User.findOne({
    where: {
      user_id: req.params.id,
    },
  }).then((response) => {
    res.json(response);
  });
});

//-----------------------------------------------------------

/* PUT update a user */
router.put('/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);

  if (!catId || catId <= 0) {
    res.status(400).send('Invalid ID');
    return;
  }

  User.update(
    {
      email: req.body.email,
    },
    {
      where: {
        id: userId,
      },
    }
  )
    .then(() => {
      res.status(204).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

/* DELETE delete a user */
router.delete('/:id', (req, res, next) => {
  const userId = parseInt(req.params.id);

  if (!userId || userId <= 0) {
    res.status(400).send('Invalide ID');
    return;
  }

  User.destroy({
    where: {
      id: userId,
    },
  })
    .then(() => {
      res.status(204).send();
    })
    .catch(() => {
      res.status(400).send();
    });
});

router.get('/logout', (req, res) => {
  console.log('hello');
  // res.cookie('jwt', '', { expires: new Date(0) });
  // res.json('logout successful');
});

module.exports = router;
