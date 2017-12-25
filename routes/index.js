var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){});


var plantSchema = new schema({
    plant_name: String,
    description: String,
    plant_pic: String,
    detail_url: String
});

var plantModel = mongoose.model('plant', plantSchema);

/* GET home page. */
router.get('/',function(req, res, next){
    plantModel.find(function (err, result) {
    if (err) return console.error(err);
    //console.log("res:",result);
    res.render('index', {
        title: 'Express',
        plants:result
    });
});
});

module.exports = router;
