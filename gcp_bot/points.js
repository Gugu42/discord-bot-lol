var firebase = require("firebase");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

const xports = module.exports = {};

var firebaseConfig = config.FIREBASE_CONFIG;

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

xports.addPoint = async (userID, amount) => {
    var user = database.ref("/users/" + userID);

    var points = await new Promise(resolve => {
        user.once('value').then(function(snapshot) {
            resolve(points = (snapshot.val() && snapshot.val().points) || 0);
        });
    });

    points += amount;

    user.update({
        "points": points
    });
}

xports.getPoints = async (msg) => {
    var scoreboard = [];

    var ref = database.ref("/users/");

    ref.on("value", function(snapshot) {
        var users = snapshot.val();
        for(let user in users) {
            var guildUser = msg.guild.members.get(user);
            
            if(guildUser) {
                scoreboard.push({
                    "username":guildUser.displayName,
                    "points": users[user].points
                });
            }
        }

        if(scoreboard.length > 0) {
            scoreboard.sort(function(a, b) {
                return a.points - b.points;
            });
        }
        var message = "Point rankings : \n";
        for(let user of scoreboard) {
            message += user.username + " : " + user.points + "\n";
        }

        msg.channel.send(message);
        ref.off("value");
    })

    
}