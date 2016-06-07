var tools = require('./scripts/helper/dateTools');
var path = require('path');
var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res) {
  res.render('index.html');
});

// favicon request handler
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});

app.get('/:date', function (req, res) {

    var date = req.params.date;
    var output = {unix: null, natural: null};

    // If 'date' is a number
    if(!isNaN(date)) {
        // Convert to milliseconds (assumes given unix timestamp is in seconds)
        output.unix = Number(date);
        output.natural = tools.getNaturalDate(date);
    }
    else {
        date = tools.parse(date);
        if(date) {
            output.natural = date.natural;
            output.unix = Number(tools.getUnixDate(date.month, date.date, date.year));
        }
    }
    res.send(output);
});

app.listen(port, function () {
    console.log('App is running locally on http://localhost: ' + port + '.');
});
