var brain = require("brain.js");
var fs = require('fs');
const homedir = require('os').homedir();

var exports = module.exports = {};

var net = new brain.recurrent.LSTM();

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
    let args = msg.content.split(" ");

    let filePath = homedir + "/hugger/training_data.json";
    var jsonRaw = fs.readFileSync(filePath);
    var jsonData = JSON.parse(jsonRaw);

    let iters = args[1] || 1000;

    var result = net.train(jsonData.data, {iterations: iters, log: true, logPeriod: iters/10});
    var newNetwork = net.toJSON();
    fs.writeFileSync(homedir + "/hugger/network.json", JSON.stringify(newNetwork));

    msg.channel.send("im done training, error is like " + result.error);
};

exports.guessWho = (msg) => {
    var input = msg.content.split(" ").splice(1).join(" ");
    console.log(input);

    var output = net.run(input);

    msg.channel.send("i think " + output + " sent this");
};