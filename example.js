import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import { Client } from "twitter-api-sdk";
import dotenv from "dotenv";
import { deepStrictEqual } from 'assert';
dotenv.config({ silent: true })

async function main() {
  const client = new Client(process.env.CIG_BEARER);
  //#region imageVariables
  const TWITTER_HANDLE = '@cigawrettebot';
  // const CANVAS = createCanvas(1639, 2048)
  // const CTX = CANVAS.getContext('2d')

  // const IMAGE_WIDTH = 1639
  // const IMAGE_HEIGHT = 2048

  // const TEXT_X = IMAGE_WIDTH / 2
  // const TEXT_Y = 1500;

  const MIN_CHAR_COUNT = 3
  const MAX_CHART_COUNT = 257



  //#endregion imageVariables

  //for adding and deleting rules
  // await client.tweets.addOrDeleteRules(
  //   {
  //     // add: [
  //     //   { value: "cat has:media", tag: "cats with media" },
  //     //   { value: "cat has:media -grumpy", tag: "happy cats with media" },
  //     //   { value: "meme", tag: "funny things" },
  //     //   { value: "meme has:images" },
  //     // ],
  //     // delete: {
  //     //   ids: ['1612663089240973312', '1612663089240973313', '1612663089240973314','1612663089240973315' ]
  //     // },
  //   }
  // );


  const rules = await client.tweets.getRules();
  console.log(rules);
  const stream = client.tweets.searchStream({
    "tweet.fields": ["author_id", "geo"],
  });

  for await (const tweet of stream){

  let images = fs.readdirSync('./images');
  let randomCigawette = Math.floor(Math.random() * images.length);
  let chosenCig = images[randomCigawette];
  loadImage(`images/${chosenCig}`).then(async (image) => {

    const CANVAS = createCanvas(1639, 2048)
    const CTX = CANVAS.getContext('2d')
  
    const IMAGE_WIDTH = 1639
    const IMAGE_HEIGHT = 2048
  
    const TEXT_X = IMAGE_WIDTH / 2
    const TEXT_Y = 1500;

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
    })
  }
}
main();
