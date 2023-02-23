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
            // Use the text from the parent tweet
            console.log(tweet.data.referenced_tweets);
            const parentId = tweet.data.referenced_tweets[0].id;
            parentTweet = await client.tweets.findTweetById(parentId);
            console.log("parentTweet:");
            console.log(parentTweet);
            renderTxt = parentTweet.data?.text;
          } else {
            // Use the text from the current tweet
            console.log("Tweet: " + tweet.data.text);
            renderTxt = tweet.data.text.slice("@cigawrettebot render ".length);
          }
          console.log("text to render:", renderTxt);
          putLabel(image, renderTxt);
        })
        .then(async () => {
          // upload the image and attach it to a tweet
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
