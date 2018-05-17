const ytdl = require('ytdl-core');
const ytsearch = require('youtube-search');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

const xports = module.exports = {};

let currentVoiceChannel;
let currentVoiceConnection;

let queue = [];

xports.handleHuggerCommands = async (msg) => {
    const message = msg.content.trim().toLowerCase();
    if (message.indexOf("join") !== -1) {
        if (msg.member.voiceChannel) {
            if (currentVoiceChannel === undefined) {
                currentVoiceChannel = msg.member.voiceChannel;
                currentVoiceConnection = await currentVoiceChannel.join();
            } else {
                msg.channel.send("i'm already in a voice channel get fucked idiot");
            }
        } else {
            msg.channel.send("you're not in a voice channel my dude");
        }
    } else if (message.indexOf("leave") !== -1) {
        if (currentVoiceChannel) {
            currentVoiceChannel.leave();
            currentVoiceConnection.disconnect();
            currentVoiceConnection = undefined;
            currentVoiceChannel = undefined;
        }
    } else if (message.indexOf("play") !== -1 && currentVoiceConnection) {
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
    }
}

playSong = (url, msg) => {
    try {
        const stream = ytdl(url, {
            filter: 'audioonly'
        });

        console.log("Playing : " + url);
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
            resolve({url: res[0].link, title: res[0].title});
        });
    });
}