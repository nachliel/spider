'use strict';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    const dbo = db.db("spider");

    dbo.collection("sites").find({}).toArray(function(err, result) {
        for (let doc in result) {
            console.log('url: '+ doc);
        }
        db.close();
    });
});