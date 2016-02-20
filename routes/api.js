var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var activitySchema = new mongoose.Schema( {
    userid: String,
    type: String,
    loc: { type: [Number], index: '2dsphere' },
    subject: String,
    content: String,
    startTime: Date,
    endTime: Date
});
//activitySchema.index({location: 1});

var activity = mongoose.model('activity', activitySchema);

router.get('/activity/:longitude/:latitude', function(req, res) {
    activity.findOne( { loc: { near: { $geoWithin: { type: "Point", coordinates: [req.params.longitude, req.params.latitude] } } } }, function(err, data) {
        res.json(data);
    });
});

router.post('/activity', function (req, res, next) {
    activity.create(req.body, function(err, data) {
        if (err) return next(err);
        res.json(data);
    })  
});

router.get('/activity', function(req, res) {
    activity.findOne({userid: "er"}, function(err, data) {
        if (err) return next(err);
        res.json(data);
    });
})

router.get('/hello', function(req, res) {
    res.json({"test": "hello"});
})

module.exports = router;