var mongodb = require('./db');

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
    mongodb.open(function(err, db) {
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
                mongodb.close();
                callback(err, restraunt);
            });
        });
    });
};

Restraunt.get = function get( callback) {
    mongodb.open(function(err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('restraunts', function(err, collection) {
            if (err) {
                mongodb.close();
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


