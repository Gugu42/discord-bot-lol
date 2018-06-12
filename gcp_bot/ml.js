var brain = require("brain.js");
var fs = require('fs');
const homedir = require('os').homedir();

var exports = module.exports = {};

exports.addToBatch = (msg) => {
    let filePath = homedir + "/hugger/training_data.json";
    
    var json;

    if(!fs.existsSync(filePath)) {
        json = {data: []};
        fs.writeFileSync(filePath, JSON.stringify(json));
    }

    fs.readFile(filePath, function(err, data) {
        json = JSON.parse(data);
        json.data.push(
            {input: msg.content.trim(), output: msg.author.username}
        )

        fs.writeFile(filePath, JSON.stringify(json));
    });
};

exports.trainNetwork = (msg) => {
    let filePath = homedir + "/hugger/training_data.json";
    var jsonRaw = fs.readFileSync(filePath);
    var jsonData = JSON.parse(jsonRaw);

    var net = new brain.recurrent.LSTM();

    var result = net.train(jsonData.data, {log: true, logPeriod: 2000});

    msg.channel.send("im done training, error is like " + result.error);

    var newNetwork = net.toJSON();
    fs.writeFileSync(homedir + "/hugger/network.json", JSON.stringify(newNetwork));
};
