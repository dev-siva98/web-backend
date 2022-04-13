var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/productHelpers');
const userHelpers = require('../helpers/userHelpers');
const auth = require('./auth')


router.get('/', (req, res) => {
  res.render('index', { title: 'Backend' });
});


router.get('/auth', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.getUser(req.user.id).then(response => {
      res.send(response)
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.error) {
      res.send(response)
    } else {
      userHelpers.getUser(response.id).then(user => {
        if (user.error) {
          res.send({ error: true, message: user.message })
        } else {
          response.user = user
          res.send(response)
        }
      })
    }
  })
})

router.post('/signin', (req, res) => {
  userHelpers.doSignin(req.body).then((response) => {
    res.send(response)
  })
})

router.get('/products', (req, res) => {
  productHelpers.getAllProducts().then((response) => {
    res.send(response)
  })
})

router.post('/addtocart', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.addToCart(req.user.id, req.body).then((response) => {
      res.send(response)
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

router.get('/fetchcart', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.getCart(req.user.id).then(response => {
      res.send(response)
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

module.exports = router;
