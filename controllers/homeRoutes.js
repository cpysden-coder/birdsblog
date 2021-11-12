const router = require('express').Router();
const { User, Post, Bird, Location } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
  const carouselFlag = true;
  res.render("homepage", {
    logged_in: req.session.logged_in,
    carouselFlag
  })
});

router.get('/login', (req, res) => {
  const carouselFlag = true;
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login', {
    carouselFlag,
    logged_in: req.session.logged_in,
  }
  );


});

router.get('/logout', (req, res) => {
  const carouselFlag = true;
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.render('homepage', {
        carouselFlag
      })
    });
  } else {
    res.render('homepage', {
      carouselFlag
    })
  }
});

//get all posts
router.get("/feed", withAuth, (req, res) => {
  Post.findAll({
    order: [["createdAt", "DESC"]],
    include: [{
      model: User,
      attributes: {
        exclude: ["password"]
      }
    },
    {
      model: Bird
    },
    {
      model: Location
    },
    {
      model: User
    }]
  }).then(dbPosts => {
    if (dbPosts.length) {
      const posts = dbPosts.map((project) => project.get({ plain: true }));

      res.render('feed', {
        posts,
        logged_in: req.session.logged_in
      })
    } else {
      res.status(404).json({ message: "No posts found in db" })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({ message: "An error occured getting all posts", err: err })
  });
});

// get all posts by a single user
router.get("/profile", withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },order: [["createdAt", "DESC"]],
    include: [
      {
        model: Bird
      },
      {
        model: Location
      },
      {
        model: User
      }
    ]
  }).then(userPosts => {
    // res.json(userPosts)
    if (userPosts) {
      const posts = userPosts.map((project) => project.get({ plain: true }));
      res.render('profile', { posts, logged_in: req.session.logged_in })
    } else {
      res.status(404).json({ message: "No users found in db" })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({ message: "An error occured", err: err })
  });
});

//render map
router.get('/map', (req, res) => {
  res.render("map")
  // res.render("map", {
  //   logged_in: req.session.logged_in,
  // })
});

module.exports = router;