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
var filmSchema = new schema({
    film_name: String,
    sub_name: String,
    score: String,
    film_pic: String,
    detail_url: String
});

var filmModel = mongoose.model('film', filmSchema);

var film = [];
url = 'http://www.iqiyi.com/dianying_new/i_list_paihangbang.html';


request(url, (err, res, body) => {
 getFilmData(body);
 })


function getFilmData(html) {
    var $ = cheerio.load(html);
    var list = $(".wrapper-piclist li");

    list.each((i, ele) => {
        var film_name = $(ele).find('.site-piclist_info_title').find('a').text();
    var sub_name = $(ele).find('.site-piclist_info_describe').text();
    var score = $(ele).find('.score').children().text();
    var more_info_url = $(ele).find('.site-piclist_info_title').find('a').attr("href");
    var film_img = $(ele).find('.site-piclist_pic_link img').attr('src');
    var obj = {
        film_name: film_name,
        sub_name: sub_name,
        score: score,
        film_pic: film_img,
        detail_url: more_info_url
    }
    film.push(obj);
})
    saveToDB(film);
}

function saveToFilmDB(film) {
    film.forEach((v, i) => {
        var movie = new filmModel(v);
    movie.save(function (err) {
        if (err) {
            console.log('保存失败')
            return;
        }
        console.log('meow');
    });
})
}


