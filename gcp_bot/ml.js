//var brain = require("brain.js");
var fs = require('fs');

//var net = new brain.recurrent.LSTM();

var exports = module.exports = {};

exports.addToBatch = (msg) => {
    fs.appendFile('./training_data/batch0', msg + "\n", function (err) {
        if (err) throw err;
    });
};

//collecting data for now, will do ML memes once I get a good enough batch (500+ messages would be nice)