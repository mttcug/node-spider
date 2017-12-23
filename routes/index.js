var express = require('express');
var router = express.Router();
var plant = require('../mongoDB/plants');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("plant:",plant.getData());
  res.render('index', {
    title: 'Express',
      plant:plants.plantsList
  });
});

module.exports = router;
