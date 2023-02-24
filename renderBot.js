import fs from "fs";
import dotenv from "dotenv";
import { loadImage } from "canvas";
import { Client } from "twitter-api-sdk";
import { putLabel } from "./utils.js";
import { TwitterMediaUploader } from "./mediaUploader.js";

dotenv.config({ silent: true });

export async function renderBot() {
  try {
    const rule = "@cigawrettebot render";
    const ipfs_url =
      "https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link";
    const blanks = JSON.parse(fs.readFileSync("blanks.json", "utf-8"));
    const client = new Client(process.env.BEARER_TOKEN);

    await client.tweets.addOrDeleteRules({
      add: [{ value: rule }],
      // delete: {
      //   ids: [],
      // },
    });

    const rules = await client.tweets.getRules();
    console.log(`rules= ${JSON.stringify(rules)}`);
    const stream = client.tweets.searchStream({
      "tweet.fields": ["author_id", "referenced_tweets"],
    });

    // read the stream of incoming tweets that match our rules
    for await (const tweet of stream) {
      let randomCig = blanks[Math.floor(Math.random() * blanks.length)];
      console.log(`using cigawrette ${randomCig}`);
      loadImage(`${ipfs_url}/${randomCig}.jpg`)
        .then(async (image) => {
          let renderTxt;
          let abort = false;
          if (tweet.data.referenced_tweets) {
            // Use the text from the parent tweet
            const parentId = tweet.data.referenced_tweets[0].id;
            const parentTweet = await client.tweets.findTweetById(parentId);
            console.log(`parentTweet: ${JSON.stringify(parentTweet)}`);
            renderTxt = parentTweet.data?.text;
          } else {
            // Use the text from the current tweet
            console.log(`tweet: ${JSON.stringify(tweet)}`);
            renderTxt = tweet.data.text.slice(rule.length);
          }
          // do not tweet images that include the rule
          if (renderTxt.includes(rule)) {
            console.log(`skipping tweet bc rule: ${JSON.stringify(renderTxt)}`);
            abort = true
            return abort;
          }
          console.log("text to render:", renderTxt);
          putLabel(image, renderTxt);
          return abort;
        })
        .then(async (abort) => {
          // upload the image and attach it to a tweet
          if (abort) {
            console.log(`aborting upload: ${abort}`)
            return;
          }
          const photos = [
            {
              path: "./renderedCig.jpg",
              type: "image/jpg",
            },
          ];
          const user = await client.users.findUserById(tweet.data?.author_id);
          const mediaUploader = new TwitterMediaUploader();
          mediaUploader
            .init(photos)
            .then(mediaUploader.processFile)
            .then(() =>
              mediaUploader.tweet(`@${user.data?.username}`, tweet.data?.id)
            )
            .catch((e) => console.error("something broke", e));
        });
    }
  } catch (error) {
    console.error("Error while running the bot: ", error);
  }
}
