'use strict';

var FeedParser = require('feedparser');
var http = require('http');

function rssUtils() {
    var self = {};

    self.parse = function(url, callback) {
        var feedMeta;
        var items = [];

        http.get(url, function(res) {
            res.pipe(new FeedParser({}))
                .on('error', function(error) {
                    callback({
                        status: 'ng',
                        message: 'HTTP failure while fetching feed'
                    });
                })
                .on('meta', function(meta) {
                    feedMeta = meta;
                })
                .on('readable', function() {
                    var stream = this;
                    var item;
                    while (item = stream.read()) {
                        var i = {
                            title: item.title,
                            description: item.description,
                            pubdate: item.pubdate,
                            link: item.link,
                            author: item.author
                        };
                        items.push(i);
                    }
                })
                .on('end', function() {
                    var result;
                    result = {
                        status: 'ok',
                        title: feedMeta.title,
                        pubdate: feedMeta.pubdate,
                        items: items
                    };

                    callback(result);
                });
        });
    };
    
    return self;
}

module.exports = new rssUtils();
