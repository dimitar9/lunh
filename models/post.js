var uri = process.env.MONGOLAB_URI

//var uri = 'mongodb://localhost:27017/blog'

var mongodb_driver = require('mongodb');


function Post(username,post,time) {
	this.user = username;
	this.post = post;

	if(time) {
		this.time = time;
	} else {
		this.time = new Date();
	}
};

module.exports = Post;

Post.prototype.save = function save(callback) {

	var post = {
		user: this.user,
		post: this.post,
		time: this.time,
	};
	mongodb_driver.MongoClient.connect(uri, function (err, db)  {
		if (err) {
			return callback(err);
		}

		db.collection('posts', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}

			// collection.ensureIndex('user');

			collection.insert(post, {safe: true}, function(err, post) {
				db.close();
				callback(err, post);
			});
		});
	});
};

Post.get = function get(username, callback) {
	mongodb_driver.MongoClient.connect(uri, function (err, db)  {
		if (err) {
			return callback(err);
		}
		console.log('db connected.')
		db.collection('posts', function(err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			var query = {};
			if (username) {
				query.user = username;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs) {
				db.close();
				if (err) {
					callback(err, null);
				}

				var posts = [];
				docs.forEach(function(doc, index) {
					var post = new Post(doc.user, doc.post, doc.time);
					posts.push(post);
				});
				callback(null, posts);
			});
		});
	});
};
