import Twit from 'twit'
import { createCanvas, loadImage } from 'canvas'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ silent: true })

// Connect to Twitter API
let T = new Twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_KEY_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
})


//#region variables
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
//     CTX.font = `bold 25px helvetica`
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
//         givenPhrase1, //user input
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



// let renderStream = T.stream(
//     'statuses/filter',
//     { track: '@Yintii_ render "' }
// );

// renderStream.on('tweet', (tweet) => {
//     console.log(tweet)
//     T.post(
//         'statuses/update',
//         { status: 'render deez nuts' },
//         (err, data, response) => {
//             if (err) return err
//             console.log(response)
//             console.log(data)
//         }

//     )
// })
T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function (err, data, response) {
    console.log(data)
})