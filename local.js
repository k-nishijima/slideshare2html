'use strict';

var async = require('async');
var ECT = require('ect');
var rssUtil = require('./rss-utils');

var oldLimit = new Date("01 Jan 2015 00:00:00");
var authors = {
    KoichiroNishijima: 'K Nishijima',
    tkonparu: 'T Konparu'
};
var urls = ['http://www.slideshare.net/rss/user/KoichiroNishijima/tag/aws',
            'http://www.slideshare.net/rss/user/tkonparu/tag/aws'];


var renderer = ECT({ root : __dirname });
var formatDate = function (date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
};

var getItems = function(url, callback) {
    rssUtil.parse(url, function(result) {
        if (result.status === 'ok') {

            // result.itemsが配列のように見えてObjectを返すので注意
            var keys = Object.keys(result.items);
            for (var i=0, len = keys.length; i<len; i++) {
                var item = result.items[keys[i]];
                var pubDate = new Date(item.pubdate);
                if (oldLimit < pubDate) {
                    var e = {
                        date: formatDate(pubDate, 'YYYY年MM月DD日'),
                        title: item.title,
                        desc: item.description,
                        link: item.link,
                        author: authors[item.author]
                    };
                    items.push(e);
                }
            }
            callback();
        }
    });
};


var items = [];
var q = async.queue(getItems);

q.drain = function () {
    items.sort(function(a,b){
        if(a.date < b.date) return 1;
        if(a.date > b.date) return -1;
        return 0;
    });
    var data = {items: items};
    var html = renderer.render('template.ect', data);
    console.log(html);
};
urls.forEach(function(url, i) {
    q.push(url);
});
