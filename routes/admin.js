var express = require('express');
var router = express.Router();
const orderHelpers = require('../helpers/orderHelpers');
var productHelpers = require('../helpers/productHelpers')
var userHelpers = require('../helpers/userHelpers')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Backend' });
});

router.post('/addproduct', (req, res) => {
  console.log(req.body)
  productHelpers.addProduct(req.body).then(response => {
    if (response.error) {
      res.status(500).send(response.message)
    }
    else {
      res.status(201).send(response)
    }
  })
})

router.get('/getorders', (req, res) => {
  orderHelpers.getAllOrders().then(response => {
    res.send(response)
  }).catch(err => {
    res.status(500).send(err)
  })
})

module.exports = router;
