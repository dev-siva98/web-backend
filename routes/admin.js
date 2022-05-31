var express = require('express');
var router = express.Router();
const OrderHelpers = require('../helpers/orderHelpers');
var productHelpers = require('../helpers/productHelpers')
var userHelpers = require('../helpers/userHelpers')

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Backend' });
});

router.post('/addproduct', (req, res) => {
  console.log(req.body)
  productHelpers.addProduct(req.body).then(response => {
    console.log('done')
    if (response.error) {
      console.log('yes')
      res.status(500).send(response.message)
    }
    else {
      console.log('no')
      res.status(201).send(response)
    }
  })
})

module.exports = router;
