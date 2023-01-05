import Twit from 'twit'
import { createCanvas, loadImage } from 'canvas'
import fetch from 'node-fetch'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ silent: true })


//#region variables
const TWITTER_HANDLE = '@cigawrettebot';
const CANVAS = createCanvas(1639, 2048)
const CTX = CANVAS.getContext('2d')

const IMAGE_WIDTH = 1639
const IMAGE_HEIGHT = 2048

const TEXT_X = IMAGE_WIDTH / 2
const TEXT_Y = 1500;

const MIN_CHAR_COUNT = 3
const MAX_CHART_COUNT = 257

let images = fs.readdirSync('./images');
let randomCigawette = Math.floor(Math.random() * images.length);
let chosenCig = images[randomCigawette];
let message;

//#endregion variables

//#region pre-made-phrases
let givenPhrase1 = "[INSERT TEXT HERE]"

let givenPhrase2 = `A longer phrase that is
about quarter of the provided 
length that could be taken`

let givenPhrase3 = `An even longer phrase that is
about half of the provided 
length that could be taken
wee weoo weoo weo ewoweo 
leedle leedle leedle leedle
lee`
//#endregion pre-made-phrases


fetch("https://api.twitter.com/2/tweets/search/stream/rules", {
    method: "POST",
    headers: {
        "Content-type": 'application/json',
        "Authentication": "Bearer AAAAAAAAAAAAAAAAAAAAAGiKiAEAAAAA3wYtmd%2Flqi700mP7%2Bl%2FhrTysx94%3DEodLpDVKqWbzKBrY6w35lywmeLDFARSnvFoTR7g0I8yCE0KuWR",

    },
    body: {
        "add": [
            { "value": "cat has:images", "tag": "cats with images" }
        ]
    }
}).then(response => response.json())
    .then(data => console.log(data));

//image and text placement on canvas

// loadImage(`images/${chosenCig}`).then((image) => {
//     /*
//     * draw the image over the whole canvas, starting from 
//     * upper origin 0,0, spanning the complete width and 
//     * height of the canvas, which is also the preset image height
//     */
//     CTX.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT)
//     //set font
//     //we'll be changing the font size dynamically with #{} later
//     CTX.font = `bold 35px helvetica`
//     CTX.textAlign = "center"
//     //create the skewing of the text
//     CTX.setTransform(
//         //skewing attributes
//         1.2, -0.2, -0.1, 1.5,
//         //placement of origin x,y
//         TEXT_X + 50, TEXT_Y
//     )
//     //right the text with the given attributes
//     CTX.fillText(
//         "How is this?", //user input
//         0, 0 //new origin in the middle of the square
//     );
//     //create the image buffer to write to an image file
//     const IMG_BUFFER = CANVAS.toBuffer('image/jpeg')
//     //write buffer to image file
//     fs.writeFileSync('./newImages/uwu1.jpg', IMG_BUFFER)
// })



/**
 * 280
 * -23
 * 257 available characters
 */

