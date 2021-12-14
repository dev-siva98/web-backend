var express = require('express');
// const data = require('../../data');
const db= require('../config/database');
var router = express.Router();
var productHelpers = require('../helpers/productHelpers')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Backend' });
});

router.get('/products', (req, res) => {
  let sort= JSON.parse(req.query.sort)
  let range=JSON.parse(req.query.range)
  let startIndex=range[0]+1
  let endIndex=range[1]+1
  let limit=range[1]-range[0]+1
  console.log(startIndex, endIndex, limit)


  productHelpers.getAllProducts(startIndex, limit, sort[0],sort[1]).then((response)=>{
    res.header('Content-Range', `products : ${startIndex}-${endIndex}/${response.count}`)
    res.send(response.products)
  })
})

router.post('/products', (req, res)=>{
  productHelpers.addProduct(req.body).then((response)=>{
    res.send(response)
  })
})

router.get('/products/:id', (req,res)=>{
  productHelpers.getProduct(req.params.id).then((response)=>{
    res.send(response)
  })
})

module.exports = router;
