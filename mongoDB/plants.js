/**
 * Created by dongfangyiheng on 2017/12/23.
 */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback){
    //do something

});

var plantSchema = new schema({
    plant_name: String,
    description: String,
    plant_pic: String,
    detail_url: String
});

var plant = mongoose.model('plant', plantSchema);


function getData() {
     return plant.find(function (err, plants) {
         if (err) return console.error(err);
         //console.log("plants:",plants)
         return plants;
     });
 }



module.exports = getData;
