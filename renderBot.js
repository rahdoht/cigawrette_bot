import fs from "fs";
import dotenv from "dotenv";
import { loadImage } from "canvas";
import { Client } from "twitter-api-sdk";
import { putLabel } from "./utils.js";
import { TwitterMediaUploader } from "./mediaUploader.js";

dotenv.config({ silent: true });

export async function renderBot() {
  try {
    const client = new Client(process.env.BEARER_TOKEN);

    //the first time you run the bot you will need to add the rules to look for '@cigawrettebot render'
    // for adding and deleting rules
    // await client.tweets.addOrDeleteRules(
    //   {
    // add: [
    //    {},
    // ],
    //     delete: {
    //        ids: []
    //     },
    //   }
    // );

    // const tweet = await client.tweets.findTweetById("20");
    // const tweet = await client.tweets.findTweetById("1628243774160662529", {
    //   "tweet.fields": [
    //     "author_id",
    //     "conversation_id",
    //     "entities",
    //     "in_reply_to_user_id",
    //     "referenced_tweets",
    //     "context_annotations",
    //   ],
    // });
    // console.log(tweet);
    // console.log(tweet.data.referenced_tweets);
    // const tweet2 = await client.tweets.findTweetById(
    //   tweet.data?.referenced_tweets[0].id,
    //   {
    //     "tweet.fields": [
    //       "author_id",
    //       "conversation_id",
    //       "entities",
    //       "in_reply_to_user_id",
    //       "referenced_tweets",
    //       "context_annotations",
    //     ],
    //   }
    // );
    // console.log(tweet2);
    // var twt = await client.get(
    //   "statuses/show",
    //   { id: tweet.data?.referenced_tweets[0].id },
    //   function (error, parentTweet, response) {
    //     if (error) reject(error);
    //     // Use the text from the parent tweet
    //     console.log("Reply to: " + parentTweet.text);
    //     resolve(parentTweet.data.text);
    //   }
    // );
    // console.log(twt);

    const rules = await client.tweets.getRules();
    console.log(rules);
    const stream = client.tweets.searchStream({
      "tweet.fields": ["author_id", "referenced_tweets"],
    });

    //loop that reads the incoming tweets and makes the content based off of them,
    for await (const tweet of stream) {
      let images = fs.readdirSync("./images");
      let randomCigawrette = Math.floor(Math.random() * images.length);
      let chosenCig = images[randomCigawrette];
      loadImage(`images/${chosenCig}`)
        .then(async (image) => {
          let renderTxt;
          if (tweet.data.referenced_tweets) {
            console.log("expected reply tweet, trying...")
            console.log(tweet);
            console.log(tweet.data.referenced_tweets);
            // Retrieve the parent tweet using the API
            const parentId = tweet.data.referenced_tweets[0].id;
            console.log(`parentId=${parentId}`);

            renderTxt = await new Promise((resolve, reject) => {
              client.tweets.findTweetById(
                parentId,
                {},
                (err, parentTweet, res) => {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else if (parentTweet.data.text) {
                    console.log("Parent tweet: " + parentTweet.data.text);
                    resolve(parentTweet.data.text);
                  } else {
                    console.error("something unexpected went wrong");
                    reject(new Error("Unable to retrieve parent tweet text"));
                  }
                }
              );
            });
          } else {
            // Use the text from the current tweet
            console.log("Tweet: " + tweet.data.text);
            renderTxt = tweet.data.text.slice("@cigawrettebot render ".length);
          }
          console.log("text to render:", renderTxt);
          putLabel(image, renderTxt);
        })
        .then(async () => {
          //once the file is created, you are able to upload it and use it to make the tweet
          //do that here:
          const photos = [
            {
              path: "./renderedCig.jpg",
              type: "image/jpg",
            },
          ];
          const mediaUploader = new TwitterMediaUploader();
          mediaUploader
            .init(photos)
            .then(mediaUploader.processFile)
            .then(() => mediaUploader.tweet(""))
            .catch((e) => console.error("something broke", e));
        });
    }
    process.exit(0);
  } catch (error) {
    console.error("Error while running the bot: ", error);
  }
}
