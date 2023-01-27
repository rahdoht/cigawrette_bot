import needle from 'needle'
import Twit from 'twit'

import got from 'got'
import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import qs from 'querystring'

import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'

import readline from 'readline'


import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const consumer_key = process.env.CIG_API_KEY;
const consumer_secret = process.env.CIG_API_KEY_SECRET;


// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
const data = {
    "text": "Hello world!"
};

const endpointURL = `https://api.twitter.com/2/tweets`;

// this example uses PIN-based OAuth to authorize the user
const requestTokenURL = 'https://api.twitter.com/oauth/request_token?oauth_callback=oob&x_auth_access_type=write';
const authorizeURL = new URL('https://api.twitter.com/oauth/authorize');
const accessTokenURL = 'https://api.twitter.com/oauth/access_token';
const oauth = OAuth({
    consumer: {
        key: consumer_key,
        secret: consumer_secret
    },
    signature_method: 'HMAC-SHA1',
    hash_function: (baseString, key) => crypto.createHmac('sha1', key).update(baseString).digest('base64')
});

async function input(prompt) {
    return new Promise(async (resolve, reject) => {
        readline.question(prompt, (out) => {
            readline.close();
            resolve(out);
        });
    });
}

async function requestToken() {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: requestTokenURL,
        method: 'POST'
    }));

    const req = await got.post(requestTokenURL, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    });
    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}


async function accessToken({
    oauth_token,
    oauth_token_secret
}, verifier) {
    const authHeader = oauth.toHeader(oauth.authorize({
        url: accessTokenURL,
        method: 'POST'
    }));
    const path = `https://api.twitter.com/oauth/access_token?oauth_verifier=${verifier}&oauth_token=${oauth_token}`
    const req = await got.post(path, {
        headers: {
            Authorization: authHeader["Authorization"]
        }
    });
    if (req.body) {
        return qs.parse(req.body);
    } else {
        throw new Error('Cannot get an OAuth request token');
    }
}


async function getRequest({
    oauth_token,
    oauth_token_secret
}) {

    const token = {
        key: oauth_token,
        secret: oauth_token_secret
    };

    const authHeader = oauth.toHeader(oauth.authorize({
        url: endpointURL,
        method: 'POST'
    }, token));

    const req = await got.post(endpointURL, {
        json: data,
        responseType: 'json',
        headers: {
            Authorization: authHeader["Authorization"],
            'user-agent': "v2CreateTweetJS",
            'content-type': "application/json",
            'accept': "application/json"
        }
    });
    if (req.body) {
        return req.body;
    } else {
        throw new Error('Unsuccessful request');
    }
}


const token = process.env.BEARER_TOKEN
const T = new Twit({
    consumer_key: process.env.PBR_KEY,
    consumer_secret: process.env.PBR_SECRET,
    access_token: process.env.PBR_ACCESS,
    access_token_secret: process.env.PBR_ACCESS_SECRET,
})


const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';

const rules = [{
    'value': '@cigawrettebot render ',
},
];

async function getAllRules() {

    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }

    return (response.body);
}

async function deleteAllRules(rules) {

    if (!Array.isArray(rules.data)) {
        return null;
    }

    const ids = rules.data.map(rule => rule.id);

    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);

}

async function setRules() {

    const data = {
        "add": rules
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);

}

function streamConnect(retryAttempt) {

    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });

    stream.on('data', data => {
        try {
            const json = JSON.parse(data);

            console.log(json)

            let renderTxt = json.data.text.slice(21);
            console.log(renderTxt)
/////////////////////////////


            //#region variables
            const CANVAS = createCanvas(1639, 2048)
            const CTX = CANVAS.getContext('2d')

            const IMAGE_WIDTH = 1639
            const IMAGE_HEIGHT = 2048

            const TEXT_X = IMAGE_WIDTH / 2
            const TEXT_Y = 1500;
        
            console.log('did canvas set up')

            let images = fs.readdirSync('./images');
            console.log(images);
            let randomCigawette = Math.floor(Math.random() * images.length);
            console.log(randomCigawette)
            let chosenCig = images[randomCigawette];
            console.log(chosenCig)
            //#endregion variables


            loadImage(`images/${chosenCig}`).then((image) => {
                /*
                * draw the image over the whole canvas, starting from 
                * upper origin 0,0, spanning the complete width and 
                * height of the canvas, which is also the preset image height
                */
                CTX.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
                //set font
                //we'll be changing the font size dynamically with #{} later
                CTX.font = `bold 35px helvetica`
                CTX.textAlign = "center"
                //create the skewing of the text
                CTX.setTransform(
                    //skewing attributes
                    1.2, -0.2, -0.1, 1.5,
                    //placement of origin x,y
                    TEXT_X + 50, TEXT_Y
                )


                //right the text with the given attributes
                CTX.fillText(
                    renderTxt, //user input
                    0, 0 //new origin in the middle of the square
                );
                //create the image buffer to write to an image file
                const IMG_BUFFER = CANVAS.toBuffer('image/jpeg')
                //write buffer to image file
                fs.writeFileSync('./newImages/uwu1.jpg', IMG_BUFFER)

                let b64content = fs.readFileSync('./newImages/uwu1.jpg', { encoding: 'base64' })

                // first we must post the media to Twitter
                T.post('media/upload', { media_data: b64content }, function (err, data, response) {
                    // now we can assign alt text to the media, for use by screen readers and
                    // other text-based presentations and interpreters
                    let mediaIdStr = data.media_id_string

                    let meta_params = { media_id: mediaIdStr }


                    T.post('media/metadata/create', meta_params, function (err, data, response) {
                        if (err) console.log(err)
                        if (!err) {
                            // now we can reference the media and post a tweet (media will attach to the tweet)
                            let params = { status: renderTxt, media_ids: [mediaIdStr] }

                            T.post('statuses/update', params, function (err, data, response) {
                                console.log(data)
                            })
                        }
                    })
                })


            })








////////////////////////////////


            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
                process.exit(1)
            } else {
                // Keep alive signal received. Do nothing.
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });

    return stream;

}


(async () => {
    let currentRules;

    try {
        // Get request token
        const oAuthRequestToken = await requestToken();
        // Get authorization
        authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
        console.log('Please go here and authorize:', authorizeURL.href);
        const pin = await input('Paste the PIN here: ');
        // Get the access token
        const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());
        // Make the request
        const response = await getRequest(oAuthAccessToken);
        console.dir(response, {
            depth: null
        });
        // Gets the complete list of rules currently applied to the stream
        currentRules = await getAllRules();

        // Delete all rules. Comment the line below if you want to keep your existing rules.
        await deleteAllRules(currentRules);

        // Add rules to the stream. Comment the line below if you don't want to add new rules.
        await setRules();

    } catch (e) {
        console.error(e);
        process.exit(1);
    }

    // Listen to the stream.
    streamConnect(0);
})();