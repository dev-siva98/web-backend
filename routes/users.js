const express = require('express');
const router = express.Router();
const productHelpers = require('../helpers/productHelpers');
const userHelpers = require('../helpers/userHelpers');
const cartHelpers = require('../helpers/cartHelpers')
const auth = require('./auth')


router.get('/', (req, res) => {
  res.render('index', { title: 'Backend' });
});


router.get('/auth', auth, (req, res) => {
  if (req.authenticated) {
    userHelpers.getUser(req.user.id).then(response => {
      res.send(response)
    }).catch(err => {
      res.send({ error: true, message: err.message })
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
        response.user = user
        res.send(response)
      }).catch(err => {
        res.send({ error: true, message: err.message })
      })
    }
  }).catch(err => {
    res.send({ error: true, message: err.message })
  })
})

router.post('/signin', (req, res) => {
  userHelpers.doSignin(req.body).then((response) => {
    res.send(response)
  }).catch(err => {
    res.send({ error: true, message: err.message })
  })
})

router.get('/products', (req, res) => {
  productHelpers.getAllProducts().then((response) => {
    res.send(response)
  }).catch(err => {
    res.send({ error: true.valueOf, message: err.message })
  })
})

router.get('/fetchcart', auth, (req, res) => {
  if (req.authenticated) {
    cartHelpers.getCart(req.user.id).then(response => {
      res.send(response)
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

router.post('/addtocart', auth, (req, res) => {
  if (req.authenticated) {
    cartHelpers.addToCart(req.user.id, req.body).then((response) => {
      res.send(response)
    }).catch(err => {
      res.send({ error: true, message: err.message })
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

router.get('/clearcart', auth, (req, res) => {
  if (req.authenticated) {
    cartHelpers.clearCart(req.user.id).then((response) => {
      res.send(response)
    }).catch(err => {
      res.send({ error: true, message: err.message })
    })
  } else {
    res.send({ error: true, message: 'Unauthorized' })
  }
})

module.exports = router;
