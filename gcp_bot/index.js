const Discord = require('discord.js');
const client = new Discord.Client();
const https = require('https');
const http = require('http');
const fs = require('fs');
const ml = require('./ml');
const ytdl = require('ytdl-core');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    game: {
      name: "with his ass"
    }
  });
});


let PREFIX = '€';
let currentVoiceChannel;
let currentVoiceConnection;

client.on('message', async msg => {
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
      }
    } else {
      //any non-command will be written to our training data file
      if(message.indexOf("http") == -1) //we don't want URLs
        ml.addToBatch(message);
    }

    if(message.indexOf("hugger") !== -1) {
      //hugger contextual commands
      if(message.indexOf("join") !== -1) {
        if(msg.member.voiceChannel) {
          if(currentVoiceChannel === undefined) {
            currentVoiceChannel = msg.member.voiceChannel;
            currentVoiceConnection = await currentVoiceChannel.join();
          } else {
            msg.channel.send("i'm already in a voice channel get fucked idiot");
          }
        } else {
          msg.channel.send("you're not in a voice channel my dude");
        }
      } else if (message.indexOf("leave") !== -1) {
        if(currentVoiceChannel) {
          currentVoiceChannel.leave();
          currentVoiceConnection.disconnect();
          currentVoiceConnection = undefined;
          currentVoiceChannel = undefined;
        }
      } else if (message.indexOf("play") !== -1 && currentVoiceConnection) {
        let words = msg.content.split(" ");
        let url = "";
        for(let w of words) {
          if(w.indexOf("http") !== -1) {
            url = w.toString();
          }
        }

        if(url !== "") {
          try {
            const stream = ytdl(url, { filter: 'audioonly' });
          } catch (err) {
            msg.channel.send("that's not a youtube link is it ?");
          }
          currentVoiceConnection.playStream(stream);
        }
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

client.login('NDI5NTkyMTcyMDE5MzE4Nzk1' + '.DaD4ug.' + '9v3CfIm-KhvCygEcTfiDWxtcWGw');