var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/user/productHelpers');
const userHelpers = require('../helpers/user/userHelpers');
const auth = require('./auth')


router.get('/', (req, res, next) => {
  res.render('index', { title: 'Backend' });
});

router.get('/products', auth, (req, res) => {
  productHelpers.getAllProducts().then((response) => {
    res.send(response)
  })
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.status){
      console.log(response)
      res.send(response)
    }
    else{
      console.log(response)
    }
  })
})

router.post('/signin', (req, res) => {
  userHelpers.doSignin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      res.send(response)
    }else {
      res.send(response)
    }
  })
})







// router.get('/users', (req, res, next) => {
//   res.send('respond with a resource');
// });

// router.get('/orders', (req, res) => {
//   res.send(data);
// })

// router.post('/addproducts', (req, res) => {
//   console.log(req.body)
//   const body = req.body;

//   db.create(body, (err, data) => {
//     if (err) {
//       res.status(500).send(err)
//     } else {
//       res.status(201).send(data)
//     }
//   })

// })

// router.get('/products', (req, res) => {
//   res.header('Content-Range', `products : 0-${file.sync.length}/${file.sync.length}`)
//   res.send(file.sync)
// })

// router.get('/products/:id', (req, res) => {
//   res.send({
//     id:'61a9c904abe0e4bd8af4aa41',
//     pname:'Red',
//     weight:'2 KG'
//   })
// })

// router.delete('/products/:id', (req, res) => {
//   const userId = req.params.id
//   console.log(userId)
//   console.log(req.body)
//   res.send({})
// })

// router.post('/products', (req, res) => {
//   req.body.id = '61a9c904abe0e4bd8af4aa41'
//   console.log(req.body)
//   res.send(req.body)
// })

module.exports = router;
