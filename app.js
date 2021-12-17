const crypto = require('crypto')
const express = require('express');
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that you create from the message
const HMAC_PREFIX = 'sha256=';

app.use(express.json())

app.post('/eventsub', (req, res) => {
    let secret = getSecret();
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
        
        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            // TODO: Do something with event's data.
            console.log(`Event type: ${req.body.subscription.type}`);
            console.log(JSON.stringify(req.body.event, null, 4));
            
            res.sendStatus(204);
        }
        else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            res.status(200).send(req.body.challenge);
        }
        else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
            res.sendStatus(204);

            console.log(`${req.body.subscription.type} notifications revoked!`);
            console.log(`reason: ${req.body.subscription.status}`);
            console.log(`condition: ${JSON.stringify(req.body.subscription.condition, null, 4)}`);
        }
        else {
            res.sendStatus(204);
            console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
        }
    }
    else {
        console.log('403');
        res.sendStatus(403);
    }
})


function getSecret() {
    // TODO: Get your secret from secure storage. This is the secret you passed 
    // when you subscribed to the event.
    return process.env.SECRET;
}

// Build the message used to get the HMAC.
function getHmacMessage(request) {
    return (request.headers[TWITCH_MESSAGE_ID] + 
        request.headers[TWITCH_MESSAGE_TIMESTAMP] + 
        JSON.stringify(request.body));
}

// Get the HMAC.
function getHmac(secret, message) {
    return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

// Verify whether your signature matches Twitch's signature.
function verifyMessage(hmac, verifySignature) {
    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}