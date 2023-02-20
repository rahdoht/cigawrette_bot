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

    const rules = await client.tweets.getRules();
    console.log(rules);
    const stream = client.tweets.searchStream({
      "tweet.fields": ["author_id", "geo"],
    });

    //loop that reads the incoming tweets and makes the content based off of them,
    for await (const tweet of stream) {
      let images = fs.readdirSync("./images");
      let randomCigawrette = Math.floor(Math.random() * images.length);
      let chosenCig = images[randomCigawrette];
      loadImage(`images/${chosenCig}`)
        .then(async (image) => {
          let renderTxt = tweet.data.text.slice(
            "@cigawrettebot render ".length
          );
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
            .then(() => mediaUploader.tweet("(holding frame)"))
            .catch((e) => console.error("something broke", e));
        });
    }
    process.exit(0);
  } catch (error) {
    console.error("Error while running the bot: ", error);
  }
}
