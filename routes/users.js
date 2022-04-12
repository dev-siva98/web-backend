var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/user/productHelpers');
const userHelpers = require('../helpers/user/userHelpers');
const auth = require('./auth')


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Backend' });
});


router.get('/auth', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.getUser(req.user.id).then(response => {
      res.status(200).send(response)
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    userHelpers.getUser(response.id).then(user => {
      response.user = user
      console.log(response)
      res.send(response)
    })
  })
})

router.post('/signin', (req, res) => {
  userHelpers.doSignin(req.body).then((response) => {
    userHelpers.getUser(response.id).then(user => {
      response.user = user
      console.log(response)
      res.send(response)
    })
  })
})

router.get('/products', (req, res) => {
  productHelpers.getAllProducts().then((response) => {
    if (response.error) {
      res.status(500).send(response.message)
    } else {
      res.status(200).send(response)
    }
  })
})

router.post('/addtocart', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.addToCart(req.user.id, req.body).then((response) => {
      if (response.error) {
        res.status(500).send(response.message)
      } else {
        console.log(response)
        res.status(201).send(response)
      }
    })
  } else {
    res.status(401).send('Unauthorized')
  }
})

router.get('/fetchcart', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.getCart(req.user.id).then(response => {
      if (response.error) {
        res.status(500).send(response.message)
      } else {
        res.status(200).send(response)
      }
    })
  } else {
    res.status(401).send('Unauthorized')
  }
})

module.exports = router;
