import got from 'got'
import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import * as qs from 'querystring'
import readline from 'readline'

import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import { Client } from "twitter-api-sdk";

import Twit from 'twit'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const oldClient = new Twit({
	consumer_key:         process.env.CIG_KEY,
  consumer_secret:      process.env.CIG_SECRET,
  access_token:         process.env.CIG_ACCESS,
  access_token_secret:  process.env.CIG_ACCESS_SECRET,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,  
})

const rd = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


// The code below sets the consumer key and consumer secret from your environment variables
// To set environment variables on macOS or Linux, run the export commands below from the terminal:
// export CONSUMER_KEY='YOUR-KEY'
// export CONSUMER_SECRET='YOUR-SECRET'
const consumer_key = process.env.CIG_KEY; 
const consumer_secret = process.env.CIG_SECRET; 

// Be sure to add replace the text of the with the text you wish to Tweet.
// You can also add parameters to post polls, quote Tweets, Tweet with reply settings, and Tweet to Super Followers in addition to other features.
let data = {
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
    rd.question(prompt, (out) => {
      rd.close();
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
  oauth_token_secret,
}, data) {

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


(async () => {
  try {
    // Get request token
    const oAuthRequestToken = await requestToken();
    // Get authorization
    authorizeURL.searchParams.append('oauth_token', oAuthRequestToken.oauth_token);
    console.log('Please go here and authorize:', authorizeURL.href);
    const pin = await input('Paste the PIN here: ');
    // Get the access token
    const oAuthAccessToken = await accessToken(oAuthRequestToken, pin.trim());

    //now we have the token to make requests
    const client = new Client(process.env.CIG_BEARER);

    const rules = await client.tweets.getRules();
    console.log(rules);
    const stream = client.tweets.searchStream({
      "tweet.fields": ["author_id", "geo"],
    });

    for await (const tweet of stream){
  
    let images = fs.readdirSync('./images');
    let randomCigawette = Math.floor(Math.random() * images.length);
    let chosenCig = images[randomCigawette];
    loadImage(`images/${chosenCig}`).then((image) => {
  
      const CANVAS = createCanvas(1639, 2048)
      const CTX = CANVAS.getContext('2d')
    
      const IMAGE_WIDTH = 1639
      const IMAGE_HEIGHT = 2048
    
      const TEXT_X = IMAGE_WIDTH / 2
      const TEXT_Y = 1500;
  
      //delete image before re-writing it
      fs.unlinkSync('./newImages/uwu1.jpg');
      
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
  
        let renderTxt = tweet.data.text.slice(21);
        
        console.log("text to render: ", renderTxt);
        CTX.fillText(
          renderTxt, //user input
          0, 0 //new origin in the middle of the square
      );
      //create the image buffer to write to an image file
      const IMG_BUFFER = CANVAS.toBuffer('image/jpeg')
      //write buffer to image file
      fs.writeFileSync('./newImages/uwu1.jpg', IMG_BUFFER)


			let b64content = fs.readFileSync('./newImages/uwu1.jpg', {encoding: 'base64'})	

			oldClient.post('media/upload', {media_data: b64content}, function(err, data, response){
        if(err) console.error('error: ', err);
        let mediaIdStr = data.media_id_string
				let altText = "A pack of Cigawrettes."
				let meta_params = {media_id: mediaIdStr, alt_text: {text: altText}}

				oldClient.post('media/metadata/create', meta_params, async function(err, data, response){
            if(!err){
              data = {
                "text": renderTxt,
                "media":{
                "media_ids": [mediaIdStr],
                }
              } 
              const response = await getRequest(oAuthAccessToken, data);
              console.dir(response, {
                depth: null
              });
            }
          });
        });	
      });	
    }
  } catch(err){
    console.error("error: ", err);
    process.exit(1)
  }
})();
