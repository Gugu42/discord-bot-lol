const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');
const http = require('http');
const fs = require('fs');
const ml = require('./ml');
const vocalmemes = require('./vocalmemes');
const points = require('./points');

const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));
const homedir = require('os').homedir();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "with his ass"
    }
  });

  setInterval(addPointsToOnlineUsers, 60*1000);

  if(!fs.existsSync(homedir + "/hugger/"))
    fs.mkdir(homedir + "/hugger");
});


let PREFIX = '€';

client.on('message', async msg => {
  try {
    const message = msg.content.trim().toLowerCase();

    if (message === 'alex is a stupid') {
      msg.channel.send('NIGGER');
    }

    if (message === 'amd') {
      msg.channel.send('yes');
    }

    if (message === 'intel') {
      msg.channel.send('no');
    }

    if (message === 'is sean right ?') {
      msg.channel.send('sean is always wrong');
    }

    if (message === 'sean is dumb') {
      msg.channel.send('agreed');
    }

    if (message.toLowerCase().startsWith(PREFIX.toLowerCase())) {
      const command = message.substring(PREFIX.length).split(/[ \n]/)[0].toLowerCase().trim();

      switch (command) {
        case 'sean':
          msg.channel.send('sean is an idiot');
          break;
        case 'btc':
          return command_crypto(msg, 'BTC', 'bitcoin');
        case 'eth':
          return command_crypto(msg, 'ETH', 'ethereum');
        case 'doge':
          return command_crypto(msg, 'DOGE', 'dogecoin');
        case 'coins':
          return command_coins(msg);
        case 'crashtest' :
          return command_crashtest(msg);
        case 'coco':
          return command_coco(msg);
        case 'gugu':
          return command_gugu(msg);
        case 'points':
          return command_points(msg);
        case 'train': 
          return command_train(msg);
        case 'guess':
          return command_guess(msg);
        case 'amd':
          return command_nasdaq(msg);
      }
    }/* else {
      //any non-command will be written to our training data file
      if(message.indexOf("http") == -1 && msg.author.username != client.user.username) //we don't want URLs
        ml.addToBatch(msg);
    }*/

    if(message.indexOf("hugger") !== -1) {
      vocalmemes.handleHuggerCommands(msg);
    }

    points.addPoint(msg.author.id, 1);
  } catch (err) {
    console.log("Whew lad we crashed ! " + err);
  }
});


function command_crypto(msg, cr, crypto) {
  var data = "";

  var req = https.get('https://api.coinmarketcap.com/v1/ticker/' + crypto + '/', (res) => {
    res.on('data', (d) => {
      data += d;
    });

    res.on('end', () => {
      jsonData = JSON.parse(data);
      msg.channel.send(`${cr} is worth ${jsonData[0].price_usd} usd`);
    });
  });
}

function command_coins(msg) {
  msg.channel.send({
    embed: {
      color: 3447003,
      title: "Coins list",
      fields: [{
          name: "€btc",
          value: "this one is worth too much"
        },
        {
          name: "€eth",
          value: "the lower value, the better gpu prices"
        },
        {
          name: "€doge",
          value: "the only coin that matters"
        }
      ]
    }
  });
}

function command_crashtest(msg) {
  msg.channel.send("??????????????????????????????");
  throw "doesnt matter tbh";
}

function command_coco(msg) {
  var data = "";

  var req = http.get('http://thecatapi.com/api/images/get?format=html&type=jpg', (res) => {
    res.on('data', (d) => {
      data += d;
    });

    res.on('end', () => {
      msg.channel.send(`${data.slice(data.indexOf('http://2'), data.length - 7)}`);
    });
  });
} 

function command_gugu(msg) {
  msg.channel.send(`:eyes:`);
}

function command_points(msg) {
  points.getPoints(msg);
}

function addPointsToOnlineUsers() {
  client.guilds.forEach((guild) => {
    guild.members.forEach((member) => {
      if(member.presence.status === "online")
        points.addPoint(member.id, 0.1);
    });
  });
}

function command_train(msg) {
  ml.trainNetwork(msg);
}

function command_guess(msg) {
  ml.guessWho(msg);
}

function command_nasdaq(msg) {
  var data = "";

  var req = https.get('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AMD&apikey=' + config.ALPHAVANTAGE_API_KEY, (res) => {
    res.on('data', (d) => {
      data += d;
    });

    res.on('end', () => {
      data = JSON.parse(data);
      msg.channel.send(`${data["Global Quote"]["05. price"]}$ -> ${data["Global Quote"]["10. change percent"]}`);
    });
  });
}

client.login(config.BOT_API_KEY);