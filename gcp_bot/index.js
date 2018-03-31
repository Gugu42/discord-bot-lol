const Discord = require('discord.js');
const client = new Discord.Client();



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
    }
  }
});

client.login('NDI5NTkyMTcyMDE5MzE4Nzk1' + '.DaD4ug.' + '9v3CfIm-KhvCygEcTfiDWxtcWGw');