const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "with his ass"
    }
  });
});



let PREFIX = '€';

client.on('message', msg => {
  try {
    const message = msg.content.trim().toLowerCase();

    if (message === 'alex is a fucking') {
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
      }
    }
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
  throw "doesnt matter tbh";
}

client.login('NDI5NTkyMTcyMDE5MzE4Nzk1' + '.DaD4ug.' + '9v3CfIm-KhvCygEcTfiDWxtcWGw');