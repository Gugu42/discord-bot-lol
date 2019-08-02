const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const fs = require('fs');
const cron = require('node-schedule');

const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

const xports = module.exports = {};

let currentVoiceChannel;
let currentVoiceConnection;

let queue = [];
let aloneInterv;
let cronJob = undefined;

xports.handleHuggerCommands = async (msg) => {
    const message = msg.content.trim().toLowerCase();
    if (message.indexOf("join") !== -1) {
        join(msg);
    } else if (message.indexOf("leave") !== -1) {
        leave();
    } else if (message.indexOf("play") !== -1) {
        if(!currentVoiceConnection)
            await join(msg);
        
        let words = msg.content.split(" ");
        let url = "";
        for (let w of words) {
            if (w.indexOf("http") !== -1) {
                url = w.toString();
            }
        }

        if (url === "") {
            let searchres = await getYoutubeURL(message.slice(message.indexOf("play ")+5));
            url = searchres.url;
            msg.channel.send(searchres.title);
        }

        if (url !== "") {
            queue.push(url);
            if (queue.length <= 1)
                playSong(url, msg);
            else
                msg.channel.send("something's already playing, but your shit is in my queue");
        }
    } else if (message.indexOf("skip") !== -1 && currentVoiceConnection) {
        let dispatcher = currentVoiceConnection.player.dispatcher;
        dispatcher.end();
    } else if (message.indexOf("missed you") !== -1) {
        msg.channel.send("ur gay");
    } else if (message.indexOf("bully") !== -1) {
        msg.channel.send("hell yea");
        if (cronJob === undefined) {
            cronJob = cron.scheduleJob('0 0 * * * *', function() {
                msg.channel.send("hey fatman you're bad at video games");
            });
        }
    }
}

playSong = (url, msg) => {
    try {
        const stream = ytdl(url, {
            filter: 'audioonly'
        });

        let dispatcher = currentVoiceConnection.playStream(stream);
        dispatcher.on("end", () => {
            queue.shift();
            if (queue.length >= 1) {
                playSong(queue[0]);
            }
        });
    } catch (err) {
        console.log(err);
        msg.channel.send("i can't play that dude");
    }
}

getYoutubeURL = (search) => {
    return new Promise((resolve, reject) => {
        let opts = {
            maxResults: 1,
            key: config.YOUTUBE_API_KEY
        };
    
        ytsearch(search, opts, (err, res) => {
            if (err) {
                console.error(err);
            }
            resolve({url: res[0].link, title: res[0].title});
        });
    });
}

join = async (msg) => {
    if (msg.member.voiceChannel) {
        if (currentVoiceChannel === undefined && msg.member.voiceChannel.joinable) {
            currentVoiceChannel = msg.member.voiceChannel;
            currentVoiceConnection = await currentVoiceChannel.join();
        } else {
            msg.channel.send("get fucked idiot");
        }

        aloneInterv = setInterval(() => {
            if(currentVoiceChannel && currentVoiceChannel.members.size <= 1) {
                leave();
                clearInterval(aloneInterv);
            }
        }, 5000);
    } else {
        msg.channel.send("you're not in a voice channel my dude");
    }
}

leave = () => {
    if (currentVoiceChannel) {
        queue = [];
        currentVoiceChannel.leave();
        currentVoiceConnection.disconnect();
        currentVoiceConnection = undefined;
        currentVoiceChannel = undefined;
        if(aloneInterv)
            clearInterval(aloneInterv);
    }
}