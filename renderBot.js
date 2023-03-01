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

    // // adding/deleting rules eats up the rate limit
    // await client.tweets.addOrDeleteRules({
    //   add: [{ value: rule }],
    //   // delete: {
    //   //   ids: [],
    //   // },
    // });

    const rules = await client.tweets.getRules();
    console.log(`rules= ${JSON.stringify(rules)}`);
    const stream = client.tweets.searchStream({
      "tweet.fields": [
        "author_id",
        "referenced_tweets",
        "entities",
        "attachments",
      ],
    });

    // read the stream of incoming tweets that match our rules
    for await (const tweet of stream) {
      let randomCig = blanks[Math.floor(Math.random() * blanks.length)];
      console.log(`using cigawrette ${randomCig}`);
      loadImage(`${ipfs_url}/${randomCig}.jpg`)
        .then(async (image) => {
          const requester = await client.users.findUserById(tweet.data?.author_id);
          let replyTweet = `@${requester.data?.username}`;
          let renderTxt;
          let abort = false;
          // Use text from parent tweet
          if (tweet.data.referenced_tweets) {
            const parentId = tweet.data.referenced_tweets[0].id;
            const parentTweet = await client.tweets.findTweetById(parentId);
            console.log(`parentTweet: ${JSON.stringify(parentTweet)}`);
            renderTxt = parentTweet.data?.text;
            // strip reply mentions from the beginning of the text
            tweet.data.entities.mentions?.forEach((mention) => {
              console.log(`stripping ${mention.username}`)
              renderTxt = renderTxt.replace(`@${mention.username} `, "");
            });
            // strip urls that are equivent to the attached media
            tweet.data.entities.urls?.forEach((url) => {
              tweet.data.attachments.media_keys?.forEach((mediaKey) => {
                if (mediaKey === url.media_key) {
                  console.log(`stripping ${url.url}`);
                  renderTxt = renderTxt.replace(`@${url.url}`, "");
                } else {
                  console.log(`not stripping ${url.url} bc ${mediaKey} != ${url.media_key}`);
                }
              });
            });
            // catch second tweet that and abort
            if (renderTxt.includes(rule)) {
              console.log(`skipping tweet bc rule: ${JSON.stringify(renderTxt)}`);
              abort = true;
              return [abort, replyTweet];
            }
            // reply to op, but tag requester
            const op = await client.users.findUserById(parentTweet.data?.author_id);
            replyTweet = `@${op.data?.username} @${requester.data?.username}`
          } else { // Use the text from the current tweet
            console.log(`tweet: ${JSON.stringify(tweet)}`);
            renderTxt = tweet.data.text.slice(rule.length + 1);
          }
          renderTxt = renderTxt.replace(/&amp;/gi, "&");
          console.log("text to render:", renderTxt);
          putLabel(image, renderTxt);
          return [abort, replyTweet];
        })
        .then(async (data) => {
          let [abort, replyTweet] = data;
          // upload the image and attach it to a tweet
          if (abort) {
            console.log(`aborting upload: ${abort}`);
            return;
          }
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
            .then(() =>
              mediaUploader.tweet(replyTweet, tweet.data?.id)
            )
            .catch((e) => console.error("mediaUploader broke", e));
        }).catch((e) => console.error("loadImage chain broke", e));
    }
  } catch (error) {
    console.error("Error while running the bot: ", error);
  }
}
