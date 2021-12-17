require('dotenv').config();
const tmi = require('tmi.js');

// Define configuration options
const opts = {
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_OAUTH_TOKEN
  },
  channels: [
    'tonytyoung'
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
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

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
  } else if (commandName === '!blameShaka') {
    client.say(target, `tonytyLit`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === '!gdiDeniz') {
    const num = rollDice();
    client.say(target, `tonytyLit`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}