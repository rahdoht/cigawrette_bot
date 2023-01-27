import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config({path: '.env'})

import Twitter from 'twitter'
let client = new Twitter({
    consumer_key:         process.env.PBR_API_KEY,
    consumer_secret:      process.env.PBR_API_KEY_SECRET,
    access_token:         process.env.PBR_ACCESS_TOKEN,
    access_token_secret:  process.env.PBR_ACCESS_TOKEN_SECRET,
  });

  let data = fs.readFileSync('./newImages/1.jpg');

  // Make post request on media endpoint. Pass file data as media parameter
  client.post('media/upload', {media: data}, function(error, media, response) {
    if(error) console.error("Error uploading: ", error);
    if (!error) {
  
      // If successful, a media object will be returned.
      console.log(media);
  
      // Lets tweet it
      var status = {
        status: 'test tweet',
        media_ids: media.media_id_string // Pass the media id string
      }
  
      client.post('statuses/update', status, function(error, tweet, response) {
        if (!error) {
          console.log(tweet);
        }
      });
  
    }
  });