/**
 * Created by dongfangyiheng on 2017/12/23.
 */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var mongoose = require('mongoose');
var schema = mongoose.Schema;

mongoose.connect('localhost');




/*
 url = 'http://movie.douban.com/subject/25724855/'; //这里是举个例子而已，豆瓣的具体的电影网址可以自己替换

 request(url,(err,res,body)=>{handleDB(body);});
 /!*request(url).pipe(fs.createWriteStream('movie.txt'));*!/
 var IMDBLink='';
 function handleDB(html){
 var $ = cheerio.load(html); //引入cheerio的方法。这样的引入方法可以很好的结合jQuery的用法。
 var info = $('#info');
 // 获取电影名
 var movieName = $('#content>h1>span').filter(function(i,el){
 return $(this).attr('property') === 'v:itemreviewed';
 }).text();
 // 获取影片导演名
 var directories = '- 导演：' + $('#info span a').filter(function(i,el){
 return $(this).attr('rel') === 'v:directedBy';
 }).text();
 // 获取影片演员
 var starsName = '- 主演：';
 $('.actor .attrs a').each(function(i,elem){
 starsName += $(this).text() + '/';
 });
 // 获取片长
 var runTime = '- 片长：' + $('#info span').filter(function(i,el){
 return $(this).attr('property') === 'v:runtime';
 }).text();
 // 获取影片类型
 var kind = $('#info span').filter(function(i,el){
 return $(this).attr('property') === 'v:genre'
 }).text();
 // 处理影片类型数据
 var kLength = kind.length;
 var kinds = '- 影  片类型：';
 for (i = 0; i < kLength; i += 2){
 kinds += kind.slice(i,i+2) + '/';
 }
 // 获取电影评分和电影评分人数
 // 豆瓣
 var DBScore = $('.ll.rating_num').text();
 var DBVotes = $('a.rating_people>span').text().replace(/\B(?=(\d{3})+$)/g,',');
 var DB = '- 豆  瓣评分：' + DBScore + '/10' + '(' + 'from' + DBVotes + 'users' + ')';
 // IMDBLink
 IMDBLink = $('#info').children().last().prev().attr('href');
 startRequest(IMDBLink);
 var data = movieName + '\r\n' + directories + '\r\n' + starsName + '\r\n' + runTime + '\r\n' + kinds + '\r\n'+ DB +'\r\n';
 // 输出文件
 fs.appendFile('dbmovie.txt', data, 'utf-8', function(err){
 if (err) throw err;
 else console.log('大体信息写入成功'+'\r\n' + data)
 });
 }

 function startRequest(IMDBLink) {
 var Link = '';
 request(IMDBLink,(err,res,body)=>{
 handleIMDB(body);
 });

 function handleIMDB(Link){
 var $ = cheerio.load(Link);
 // 获取IMDB评分
 var IMDBScore = $('.ratingValue span').filter(function(i,el){
 return $(this).attr('itemprop') === 'ratingValue';
 }).text();
 // 获取IMDB评分人数
 var IMDBVotes = $('.small').filter(function(i,el){
 return $(this).attr('itemprop') === 'ratingCount';
 }).text();
 // 字符串拼接
 var IMDB = '- IMDB评分：' + IMDBScore + '/10' + '(' + 'from' + IMDBVotes + 'users' + ')' + '\r\n';
 // 输出文件
 fs.appendFile('dbmovie.txt', IMDB, 'utf-8', function(err){
 if (err) throw err;
 else console.log('IMDB信息写入成功' + '\r\n' + IMDB)
 });
 }
 }

 */


var plantSchema = new schema({
    plant_name: String,
    description: String,
    plant_pic: String,
    detail_url: String
});

var plantModel = mongoose.model('plant', plantSchema);
var plant=[];
var page_number=1;
plant_url='';

getPlantsData();

function getPlantsData() {
    for(let i=1;i<69;i++){
        page_number=i;
        plant_url='http://www.aihuhua.com/hua/page-'+ i +'.html';
        request(plant_url, (err, res, body) => {
            getPlantsInfo(body,i);
    })
    }
}

function getPlantsInfo(html,i) {
    if(plant.length > 1000)
        return;
    var $ = cheerio.load(html);
    var list = $(".main li");

    list.each((i, ele) => {
        var plant_name = $(ele).find('.title').text();
    var desc = $(ele).find('.desc').text();
    var more_info_url = $(ele).find('.title').attr("href");
    var plant_pic = $(ele).find('img').data('original');
    console.log("picUrl:",plant_pic);
    var obj = {
        plant_name: plant_name,
        description: desc,
        plant_pic: plant_pic,
        detail_url: more_info_url
    }
    plant_name ? plant.push(obj) : '';
})
    saveToDB(plant);
}

function saveToDB(plant) {
    plant.forEach((v, i) => {
        var pl = new plantModel(v);
    pl.save(function (err) {
        if (err) {
            console.log('保存失败');
            return;
        }
        //console.log('meow');
    });
})
}
