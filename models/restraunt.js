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

Restraunt.get = function get(username, callback) {
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
            if (username) {
                query.user = username;
            }
            collection.find(query).sort({time: -1}).toArray(function(err, docs) {
                mongodb.close();
                if (err) {
                    callback(err, null);
                }

                var restraunts = [];
                docs.forEach(function(doc, index) {
                    var restraunt = new Restraunt(doc.user, doc.restraunt_name, doc.time);
                    restraunts.push(restraunt);
                });
                callback(null, restraunts);
            });
        });
    });
};
