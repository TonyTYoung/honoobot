require('dotenv').config();
const tmi = require('tmi.js');
const https = require('https');
const appClientId = process.env.APP_CLIENT_ID;
const authToken = process.env.AUTH_TOKEN;
const twitchChannel = 'tonytyoung'

// Define configuration options
const opts = {
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    },
    channels: [
        twitchChannel
    ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // Remove whitespace from chat message
    const commandName = msg.trim().toLowerCase();
    if (commandName[0] !== '!') { return; }

    // If the command is known, let's execute it
    if (commandName === '!dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!ffxiv') {
        client.say(target, `Have you heard of the critically acclaimed MMORPG Final Fantasy XIV with an EXPANDED FREE TRIAL? Which you can play through the entirety of A Realm Reborn and the award winning Heavensward Expansion up to level 60 for FREE with no restrictions on playtime.`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!prime' || commandName === '!shakaprime') {
        client.say(target, `Subscribe and support the stream with Prime Gaming! Prime Gaming continues to include a monthly Twitch channel subscription, tons of awesome content in your favorite games, 5+ PC games every month, and more with your Amazon Prime membership. https://gaming.amazon.com/`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!lit') {
        client.say(target, `tonytyLit`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!blame') {
        client.say(target, `tonytyLit`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!blameshaka') {
        client.say(target, `tonytyLit`);
        console.log(`* Executed ${commandName} command`);
    } else if (commandName === '!gdideniz') {
        const num = rollDice();
        client.say(target, `tonytyLit`);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
    }
}

// Function called when the "dice" command is issued
function rollDice() {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

let isStreamOnline = true;

function keepAliveRequest() {
    // hack to not idle after ~30 mins if stream online
    const options = {
            method: 'GET',
            hostname: 'honoobot.herokuapp.com', // TODO does this need to be hardcoded?
            port: 443,
            path: '/'
        };
    const req = https.request(options, res => {});
    req.end();
}

let interval = setInterval(function() {
    const options = {
            method: 'GET',
            hostname: 'api.twitch.tv',
            port: 443,
            path: `/helix/streams?user_login=${twitchChannel}`,
            headers: {
                'Client-ID': appClientId,
                'Authorization': 'Bearer ' + authToken
            }
        };
    let json = '';
    let data;
    const req = https.request(options, res => {
        res.on('data', d => {
            json += d;
        });
        res.on('end', function () {
            if (res.statusCode === 200) {
                try {
                    data = JSON.parse(json);
                    isStreamOnline = data.data.length;
                    json = '';
                } catch (e) {
                    console.log('Error parsing JSON!');
                    isStreamOnline = false;
                }
            } else {
                console.log('Status:', res.statusCode);
            }
        });
    });
    req.end();
    if (isStreamOnline) {
        console.log('Stream still online.');
        keepAliveRequest();
    } else {
        console.log('Stream offline.');
        clearInterval(interval);
    }
}, 25 * 60 * 1000);