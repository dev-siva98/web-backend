var express = require('express');
var router = express.Router();
const OrderHelpers = require('../helpers/admin/OrderHelpers');
var productHelpers = require('../helpers/admin/productHelpers')
var userHelpers = require('../helpers/admin/userHelpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Backend' });
});

router.get('/products', (req, res) => {
  let sort = JSON.parse(req.query.sort)
  let range = JSON.parse(req.query.range)
  let startIndex = range[0]
  let endIndex = range[1]
  let limit = range[1] - range[0] + 1
  console.log(startIndex, endIndex, limit)


  productHelpers.getAllProducts(startIndex, limit, sort[0], sort[1]).then((response) => {
    res.header('Content-Range', `products : ${startIndex}-${endIndex}/${response.count}`)
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response.products)
    }
  })
})

router.post('/products', (req, res) => {
  productHelpers.addProduct(req.body).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})

router.get('/products/:id', (req, res) => {
  productHelpers.getProduct(req.params.id).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})

router.delete('/products/:id', (req, res) => {
  productHelpers.deleteProduct(req.params.id).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})

router.put('/products/:id', (req, res) => {
  productHelpers.updateProduct(req.params.id, req.body).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})


// Users

router.get('/users', (req, res) => {

  let sort = JSON.parse(req.query.sort)
  let range = JSON.parse(req.query.range)
  let startIndex = range[0]
  let endIndex = range[1]
  let limit = range[1] - range[0] + 1
  console.log(startIndex, endIndex, limit)

  userHelpers.getAllUsers(startIndex, limit, sort[0], sort[1]).then((response) => {
    res.header('Content-Range', `users : ${startIndex}-${endIndex}/${response.count}`)
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response.users)
    }
  })
})

router.post('/users', (req, res) => {
  userHelpers.addUser(req.body).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})


// Orders

router.get('/orders', (req, res) => {
  let sort = JSON.parse(req.query.sort)
  let range = JSON.parse(req.query.range)
  let startIndex = range[0]
  let endIndex = range[1]
  let limit = range[1] - range[0] + 1
  console.log(startIndex, endIndex, limit)

  OrderHelpers.getAllOrders(startIndex, limit, sort[0], sort[1]).then((response) => {
    res.header('Content-Range', `orders : ${startIndex}-${endIndex}/${response.count}`)
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response.orders)
    }
  })
})

router.post('/orders', (req, res) => {
  OrderHelpers.addOrder(req.body).then((response) => {
    if (response.status) {
      res.status(500).send(response)
    }
    else {
      res.send(response)
    }
  })
})


module.exports = router;
