const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'alex is a fucking') {
    msg.reply('NIGGER');
  }
});

client.login('NDI5NTkyMTcyMDE5MzE4Nzk1'+ '.DaD4ug.' +'9v3CfIm-KhvCygEcTfiDWxtcWGw');