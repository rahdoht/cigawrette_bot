import fs from 'fs'
import dotenv from "dotenv";
import { createCanvas } from 'canvas'

dotenv.config({ silent: true });

// encodes all characters encoded with encodeURIComponent, plus: ! ~ * ' ( )
export const fullyEncodeURI = (value) =>
  encodeURIComponent(value)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2a")
    .replace(/~/g, "%7e");

export const oauth = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET,
};

export const putLabel = (image, label) => {
        const IMAGE_WIDTH = 1639;
        const IMAGE_HEIGHT = 2048;

        const CANVAS = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
        const CTX = CANVAS.getContext("2d");

        const TEXT_X = IMAGE_WIDTH / 2;
        const TEXT_Y = 1500;

        /*
         * draw the image over the whole canvas, starting from
         * upper origin 0,0, spanning the complete width and
         * height of the canvas, which is also the preset image height
         */
        CTX.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        //set font
        //we'll be changing the font size dynamically with #{} later
        CTX.font = `bold 35px helvetica`;
        CTX.textAlign = "center";
        //create the skewing of the text
        CTX.setTransform(
          //skewing attributes
          1.2,
          -0.2,
          -0.1,
          1.5,
          //placement of origin x,y
          TEXT_X + 50,
          TEXT_Y
        );
        //right the text with the given attributes

        CTX.fillText(
          label,
          0,
          0 //new origin in the middle of the square
        );
        //create the image buffer to write to an image file
        const IMG_BUFFER = CANVAS.toBuffer("image/jpeg");
        //write buffer to image file
        fs.writeFileSync("./newImages/uwu1.jpg", IMG_BUFFER);
}
