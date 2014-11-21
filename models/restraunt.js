var uri = 'mongodb://heroku_app31786437:e65g3btvanua3gfbmk6s23gl5v@ds051740.mongolab.com:51740/heroku_app31786437';
var mongodb_driver = require('mongodb');


function Restraunt(username,restraunt_name,time) {
    this.user = username;
    this.restraunt_name = restraunt_name;

    if(time) {
        this.time = time;
    } else {
        this.time = new Date();
    }
};

module.exports = Restraunt;

Restraunt.prototype.save = function save(callback) {

    var restraunt = {
        user: this.user,
        restraunt_name: this.restraunt_name,
        time: this.time,
    };
    mongodb_driver.MongoClient.connect(uri, function (err, db)  {
        if (err) {
            return callback(err);
        }

        db.collection('restraunts', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }

            // collection.ensureIndex('user');

            collection.insert(restraunt, {safe: true}, function(err, restraunt) {
                db.close();
                callback(err, restraunt);
            });
        });
    });
};

Restraunt.get = function get( callback) {
    mongodb_driver.MongoClient.connect(uri, function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('restraunts', function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            var query = {};
            collection.aggregate([
                {"$group":
                {"_id": "$restraunt_name",
                    "value": {"$sum": 1}
                }
                },
                {"$sort": {"value": -1}},
                {"$limit": 5}
            ] , function (err, result) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(result[0]);
                restraunt_chosen = result[0];
                callback(null, restraunt_chosen);
            });

        });
    });
};


