var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongodb = require('mongodb');

var userSchema = new mongoose.Schema({
    name: String,
    Age: Number,
    LoyaltyPoints: Number,
    FavoriteBarber: String,
    Appointment: [
        {
            BarberName: String,
            Time: Date
        }]
})

var user = mongoose.model('user', userSchema);

router.get('/user', function (req, res, next) {
        mongodb.MongoClient.connect('mongodb://bizbuzz:123456@ds025399.mlab.com:25399/bizbuzz', function (err, db) {
        if (err) res.send(err);
        db.collection('user').find(function (err, results) {
                if (err) res.send(err);
                res.json(results);
                db.close();
            });
    });
});

router.get('/user-all', function (req, res, next) {
    user.find(function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

router.post('/user', function (req, res, next) {
    user.create(req.body, function (err, data) {
        if (err) return next(err);
        res.json(data);
    })
});

router.get('/hello', function (req, res) {
    res.json({
        "test": "hello"
    });
})

router.get('/user/:username/:password', function (req, res, next) {
    user.find({
        username: req.params.username
    }, function (err, data) {
        console.log(req.params.password);
        console.log(data.password);
        if (err) return next(err);
        if (data.password != req.params.password) return res.sendStatus(401);
        activity.find({
            userid: req.params.username
        }, function (err, data) {
            if (err) return next(err);
            res.json(data);
        })
    })

})

router.get('/activity', function (req, res) {
//    console.log(req.query.data);
//    var locParam = JSON.parse(req.query.data);
//    console.log(locParam);

    
    mongodb.MongoClient.connect('mongodb://tebyt:togethernyu@ds013738.mongolab.com:13738/heroku_t1qnbv72', function (err, db) {
        if (err) res.send(err);
        db.collection('activities')
            .find({
                loc: {
                    $geoWithin: {
                        $box: [[Number(req.query.ne_lg), Number(req.query.ne_la)], [Number(req.query.sw_lg), Number(req.query.sw_la)]]
                    }
                }
            })
            .toArray(function (err, results) {
                if (err) res.send(err);
//                console.log(results);
//                if (!results)
//                    results = [];

                res.json(results);

                db.close();
            });
    });



    //    activity.find({
    //        "loc": {
    //            $near: {
    //                $geometry: {
    //                    "type": "Point",
    //                    "coordinates": [locParam[0], locParam[1]]
    //                },
    //                $maxDistance: locParam[2]
    //            }
    //        }
    //    }, function(err, data) {
    //        if (err) res.send(err);
    //      res.json(data);
    //    })

});

router.post('/activity', function (req, res, next) {
    activity.create(req.body, function (err, data) {
        if (err) return next(err);
        res.json(data);
    })
});





router.get('/activity-all', function (req, res, next) {
    activity.find(function (err, data) {
        if (err) return next(err);
        res.json(data);
    });
});

module.exports = router;
