var settings = require('../settings'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db('heroku_app31786437', new Server('mongodb://heroku_app31786437:e65g3btvanua3gfbmk6s23gl5v@ds051740.mongolab.com:51740/heroku_app31786437', 51740, {}), {safe: true});
